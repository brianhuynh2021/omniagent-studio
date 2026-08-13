"""Cloud OCR adapters and a safe fallback chain.

The adapters are deliberately lazy: importing the application does not need
cloud SDKs or credentials. A caller must explicitly opt in before bytes from a
dossier can reach Google or AWS; classified material is rejected by the
classification guard.
"""

import os
from dataclasses import dataclass
from typing import Any, Callable, List, Optional

from app.domains.legal_assistant.classification import guard_external


class OCRProviderError(RuntimeError):
    pass


@dataclass(frozen=True)
class OCRResult:
    text: str
    provider: str
    method: str


class LocalTesseractProvider:
    name = "tesseract"
    external = False

    def available(self) -> bool:
        import shutil
        return bool(shutil.which("tesseract") or os.getenv("TESSERACT_CMD"))

    def recognize(self, data: bytes, classification: Optional[str] = None) -> OCRResult:
        if not self.available():
            raise OCRProviderError("Tesseract chưa được cài.")
        try:
            import pytesseract
            from PIL import Image
            from io import BytesIO
            cmd = os.getenv("TESSERACT_CMD")
            if cmd:
                pytesseract.pytesseract.tesseract_cmd = cmd
            image = Image.open(BytesIO(data))
            if image.mode not in ("L", "RGB"):
                image = image.convert("RGB")
            langs = os.getenv("TESSERACT_LANGS", "vie+eng")
            try:
                text = pytesseract.image_to_string(image, lang=langs)
            except pytesseract.TesseractError:
                text = pytesseract.image_to_string(image, lang="eng")
                langs = "eng"
        except Exception as exc:
            raise OCRProviderError(str(exc)) from exc
        text = (text or "").strip()
        if not text:
            raise OCRProviderError("OCR không nhận được chữ nào.")
        return OCRResult(text=text, provider=self.name, method=f"ocr:{langs}")


class GoogleVisionOCRProvider:
    name = "google_vision"
    external = True

    def __init__(self, client: Any = None, client_factory: Optional[Callable[[], Any]] = None):
        self._client = client
        self._client_factory = client_factory

    def available(self) -> bool:
        return self._client is not None or bool(
            os.getenv("GOOGLE_APPLICATION_CREDENTIALS") or os.getenv("GOOGLE_CLOUD_PROJECT")
        )

    def _get_client(self) -> Any:
        if self._client is None:
            try:
                from google.cloud import vision
            except ImportError as exc:
                raise OCRProviderError("google-cloud-vision chưa được cài.") from exc
            try:
                self._client = (
                    self._client_factory() if self._client_factory else vision.ImageAnnotatorClient()
                )
            except Exception as exc:
                raise OCRProviderError(f"Google Vision chưa sẵn sàng: {exc}") from exc
        return self._client

    def recognize(self, data: bytes, classification: Optional[str] = None) -> OCRResult:
        guard_external(classification, "ocr")
        client = self._get_client()
        try:
            response = client.document_text_detection(image={"content": data})
            text = (getattr(response, "full_text_annotation", None).text or "").strip()
        except Exception as exc:
            raise OCRProviderError(f"Google Vision OCR thất bại: {exc}") from exc
        if not text:
            raise OCRProviderError("Google Vision không nhận được chữ nào.")
        return OCRResult(text=text, provider=self.name, method="cloud:google-vision")


class AwsTextractOCRProvider:
    name = "aws_textract"
    external = True

    def __init__(self, client: Any = None, client_factory: Optional[Callable[[], Any]] = None):
        self._client = client
        self._client_factory = client_factory

    def available(self) -> bool:
        return self._client is not None or bool(
            os.getenv("AWS_ACCESS_KEY_ID") or os.getenv("AWS_PROFILE")
        )

    def _get_client(self) -> Any:
        if self._client is None:
            try:
                import boto3
                self._client = self._client_factory() if self._client_factory else boto3.client("textract")
            except Exception as exc:
                raise OCRProviderError(f"AWS Textract chưa sẵn sàng: {exc}") from exc
        return self._client

    def recognize(self, data: bytes, classification: Optional[str] = None) -> OCRResult:
        guard_external(classification, "ocr")
        try:
            response = self._get_client().detect_document_text(Document={"Bytes": data})
            lines = [
                block.get("Text", "")
                for block in response.get("Blocks", [])
                if block.get("BlockType") == "LINE"
            ]
            text = "\n".join(line for line in lines if line).strip()
        except Exception as exc:
            raise OCRProviderError(f"AWS Textract OCR thất bại: {exc}") from exc
        if not text:
            raise OCRProviderError("AWS Textract không nhận được chữ nào.")
        return OCRResult(text=text, provider=self.name, method="cloud:aws-textract")


class OCRFallbackChain:
    def __init__(self, providers: List[Any]):
        self.providers = providers
        self.last_errors: List[str] = []

    def recognize(self, data: bytes, classification: Optional[str] = None) -> OCRResult:
        self.last_errors = []
        for provider in self.providers:
            if not provider.available():
                self.last_errors.append(f"{provider.name}: unavailable")
                continue
            try:
                return provider.recognize(data, classification=classification)
            except Exception as exc:
                self.last_errors.append(f"{provider.name}: {exc}")
        raise OCRProviderError("; ".join(self.last_errors) or "Không có OCR provider nào.")

    def status(self) -> dict:
        return {
            "providers": [
                {"provider": provider.name, "available": provider.available(), "external": provider.external}
                for provider in self.providers
            ],
            "last_errors": self.last_errors,
        }


def configured_chain(allow_external_ocr: bool = False) -> OCRFallbackChain:
    providers: List[Any] = [LocalTesseractProvider()]
    provider_name = os.getenv("OCR_CLOUD_PROVIDER", "none").lower().strip()
    if allow_external_ocr and provider_name in {"google", "google_vision", "auto"}:
        providers.append(GoogleVisionOCRProvider())
    if allow_external_ocr and provider_name in {"aws", "textract", "auto"}:
        providers.append(AwsTextractOCRProvider())
    return OCRFallbackChain(providers)
