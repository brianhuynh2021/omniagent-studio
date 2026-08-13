import pytest

from app.domains.legal_assistant import classification as cls
from app.domains.legal_assistant.cloud_ocr import (
    AwsTextractOCRProvider,
    GoogleVisionOCRProvider,
    OCRFallbackChain,
    OCRProviderError,
    OCRResult,
)


class FakeGoogleResponse:
    class Annotation:
        text = "Điều 173 — trộm cắp tài sản"

    full_text_annotation = Annotation()


class FakeGoogleClient:
    def document_text_detection(self, image):
        assert image["content"] == b"image-bytes"
        return FakeGoogleResponse()


class FakeAwsClient:
    def detect_document_text(self, Document):
        assert Document["Bytes"] == b"image-bytes"
        return {"Blocks": [
            {"BlockType": "LINE", "Text": "Điều 173"},
            {"BlockType": "WORD", "Text": "ignored"},
            {"BlockType": "LINE", "Text": "trộm cắp tài sản"},
        ]}


def test_google_adapter_is_mock_verified():
    result = GoogleVisionOCRProvider(client=FakeGoogleClient()).recognize(
        b"image-bytes", classification=cls.PUBLIC
    )
    assert result == OCRResult(
        text="Điều 173 — trộm cắp tài sản",
        provider="google_vision",
        method="cloud:google-vision",
    )


def test_aws_adapter_is_mock_verified():
    result = AwsTextractOCRProvider(client=FakeAwsClient()).recognize(
        b"image-bytes", classification=cls.PUBLIC
    )
    assert result.text == "Điều 173\ntrộm cắp tài sản"
    assert result.provider == "aws_textract"


def test_fallback_chain_tries_next_provider():
    class Broken:
        name = "broken"
        external = False

        def available(self):
            return True

        def recognize(self, data, classification=None):
            raise OCRProviderError("broken provider")

    class Working:
        name = "mock"
        external = False

        def available(self):
            return True

        def recognize(self, data, classification=None):
            return OCRResult("mock text", "mock", "mock")

    chain = OCRFallbackChain([Broken(), Working()])
    assert chain.recognize(b"x").text == "mock text"
    assert "broken provider" in chain.last_errors[0]


def test_secret_classification_never_reaches_google():
    called = []

    class MustNotCall:
        def document_text_detection(self, image):
            called.append(True)

    with pytest.raises(Exception):
        GoogleVisionOCRProvider(client=MustNotCall()).recognize(
            b"secret", classification=cls.SECRET
        )
    assert not called
