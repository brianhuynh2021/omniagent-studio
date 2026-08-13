from fastapi import APIRouter, HTTPException, Query, UploadFile, File, Form
from pydantic import BaseModel, Field
from typing import Dict, Any, Optional, List

from app.core.config import settings
from app.domains.legal_assistant.service import legal_assistant_service
from app.domains.legal_assistant import case_bank, extraction, llm
from app.services.doc_intel_service import doc_intel_service
from app.services.marketing_service import marketing_service
from app.services.booking_service import booking_service
from app.services.eng_service import eng_service
from app.domains.registry import global_domain_registry, DomainAgentMeta
from app.domains.plugin_protocol import VerticalManifest, BaseVerticalPlugin, ToolDefinition
from app.agents.core.orchestrator import global_orchestrator
from app.agents.core.tool_registry import global_tool_registry
from app.services.custom_agent_service import custom_agent_service, CreateCustomAgentRequest
from app.rag.engine import rag_engine
from app.domains.legal_assistant.cloud_ocr import configured_chain

api_router = APIRouter()

# Core System Info
@api_router.get("/project/info")
def get_project_info():
    domains = global_domain_registry.list_domains()
    agents = global_domain_registry.list_agents()
    tools = global_tool_registry.list_tools()
    verticals = global_domain_registry.list_vertical_manifests()
    return {
        "title": settings.PROJECT_NAME,
        "engine": settings.ENGINE_NAME,
        "version": settings.VERSION,
        "description": "Enterprise-grade Grab-Style Multi-Vertical AI Agent Core Platform Ecosystem",
        "domains_count": len(domains),
        "total_agents_count": len(agents),
        "vertical_plugins_count": len(verticals),
        "tools_available_count": len(tools),
        "status": "ONLINE",
        "llm_provider": settings.LLM_PROVIDER
    }

# Vertical Ecosystem Endpoints (Super-App Architecture)
@api_router.get("/verticals/list")
def list_vertical_manifests():
    return global_domain_registry.list_vertical_manifests()

@api_router.get("/verticals/{vertical_id}")
def get_vertical_manifest(vertical_id: str):
    plugin = global_domain_registry.get_plugin(vertical_id)
    if not plugin:
        raise HTTPException(status_code=404, detail=f"Vertical plugin '{vertical_id}' not found.")
    return plugin.get_manifest()

@api_router.post("/verticals/register")
def register_vertical_manifest(manifest: VerticalManifest):
    plugin = BaseVerticalPlugin(manifest=manifest)
    global_domain_registry.register_plugin(plugin)
    return {"message": f"Vertical Manifest [{manifest.name}] registered successfully.", "vertical_id": manifest.vertical_id}

# Domain & Agent Registry Endpoints
@api_router.get("/domains/list")
def list_domains():
    return global_domain_registry.list_domains()

@api_router.get("/agents/list")
def list_agents(domain_key: Optional[str] = Query(None, description="Filter agents by domain key")):
    return global_domain_registry.list_agents(domain_key)

@api_router.get("/tools/list")
def list_tools():
    return global_tool_registry.list_tools()

# Dynamic Execution Model
class DynamicAgentExecuteRequest(BaseModel):
    agent_id: str
    input_query: str
    tools_override: Optional[List[str]] = None
    context: Optional[Dict[str, Any]] = None

@api_router.post("/agents/execute")
def execute_agent(req: DynamicAgentExecuteRequest):
    agent_meta = global_domain_registry.get_agent_meta(req.agent_id)
    if not agent_meta:
        raise HTTPException(status_code=404, detail=f"Agent '{req.agent_id}' not found.")
    
    tools_to_run = req.tools_override if req.tools_override is not None else agent_meta.default_tools
    
    response = global_orchestrator.execute_react_workflow(
        agent_name=agent_meta.name,
        system_prompt=agent_meta.system_prompt,
        input_query=req.input_query,
        enabled_tools=tools_to_run,
        domain_tag=agent_meta.domain_key,
        context=req.context
    )
    return response

# Custom Agent Studio Endpoints
@api_router.post("/agents/custom/create")
def create_custom_agent(req: CreateCustomAgentRequest):
    new_agent = custom_agent_service.create_agent(req)
    return {"message": "Agent created successfully", "agent": new_agent}

@api_router.get("/agents/custom/list")
def list_custom_agents():
    return custom_agent_service.list_custom_agents()

# Legacy & Domain Specific Quick Routes
class LegalProcessRequest(BaseModel):
    title: str = "Vụ án Trộm cắp tài sản - Nguyễn Văn A"
    content: str
    lang: Optional[str] = "vi"
    persona: Optional[str] = "all_in_one"

class LegalChatRequest(BaseModel):
    question: str
    content: str
    title: Optional[str] = ""
    lang: Optional[str] = "vi"
    persona: Optional[str] = "all_in_one"
    history: Optional[List[Dict[str, str]]] = None
    # Explicit per-request consent to send this dossier to a third-party
    # model. Never defaulted on — state-secret dossiers must not leave the
    # machine unless the operator says so.
    allow_external_llm: Optional[bool] = False

class LegalStatsRequest(BaseModel):
    title: Optional[str] = ""
    content: str

class DocIntelQARequest(BaseModel):
    query: str = "Quy định bảo mật dữ liệu công ty và thủ tục xin nghỉ phép?"

class RAGDocumentRequest(BaseModel):
    doc_id: str
    title: str
    content: str
    category: str = "general"
    classification: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

class RAGIngestRequest(BaseModel):
    documents: List[RAGDocumentRequest]
    classification: Optional[str] = None

class RAGSearchRequest(BaseModel):
    query: str
    top_k: int = Field(default=3, ge=1, le=50)
    category: Optional[str] = None
    classification: Optional[str] = None

class MarketingCampaignRequest(BaseModel):
    biz_name: str = "Aroma Cafe & Bistro"
    biz_type: str = "Quán Cafe & Ăn sáng"
    promotion_goal: str = "Khai trương món mới Combo Bữa Sáng giảm 20%"

class BookingMessageRequest(BaseModel):
    message: str = "Tôi muốn đặt lịch làm dịch vụ bảo dưỡng vào ngày mai lúc 15h"
    customer_phone: Optional[str] = "0912345678"

class EngAnalyzeRequest(BaseModel):
    sys_name: str = "Aegis AI Platform Enterprise Engine"
    tech_spec_text: str = "FastAPI backend, PostgreSQL, Qdrant vector database, Celery task queue, Multi-Agent workflow."

@api_router.get("/legal/sample-cases")
def get_sample_legal_cases(lang: Optional[str] = Query("vi", description="Language code: vi or en")):
    return legal_assistant_service.get_sample_cases(lang=lang or "vi")

@api_router.post("/legal/process")
def process_legal_dossier(req: LegalProcessRequest):
    return legal_assistant_service.process_case_dossier(req.title, req.content, lang=req.lang or "vi", persona=req.persona or "all_in_one")

@api_router.post("/legal/chat")
def legal_followup_chat(req: LegalChatRequest):
    """Answer a follow-up question grounded in an already-loaded dossier."""
    return legal_assistant_service.answer_case_question(
        question=req.question,
        dossier_content=req.content,
        dossier_title=req.title or "",
        lang=req.lang or "vi",
        persona=req.persona or "all_in_one",
        history=req.history,
        allow_external_llm=bool(req.allow_external_llm),
    )

@api_router.post("/legal/precedent-stats")
def legal_precedent_stats(req: LegalStatsRequest):
    """Article distribution from prior cases matching this dossier's
    locality and type — answers without invoking the model."""
    return case_bank.lookup_precedent_stats(req.title or "", req.content)

@api_router.get("/legal/case-bank")
def legal_case_bank_summary():
    return case_bank.bank_summary()

@api_router.post("/legal/extract")
async def legal_extract_files(
    files: List[UploadFile] = File(...),
    classification: Optional[str] = Form(None),
    allow_external_ocr: bool = Form(False),
):
    """Extract real text from uploaded dossier files (PDF / DOCX / image OCR).

    Per-file results are returned individually so a partial failure (one
    scanned PDF among several) still yields the text that did extract.
    """
    results = []
    for upload in files:
        data = await upload.read()
        outcome = extraction.extract(
            upload.filename or "",
            data,
            classification=classification,
            allow_external_ocr=allow_external_ocr,
        )
        results.append({"filename": upload.filename, **outcome})

    combined = "\n\n".join(
        f"[{r['filename']}]\n{r['text']}" for r in results if r.get("ok") and r.get("text")
    )
    return {
        "results": results,
        "combined_text": combined,
        "extracted_count": sum(1 for r in results if r.get("ok")),
        "failed_count": sum(1 for r in results if not r.get("ok")),
    }

@api_router.get("/legal/engine")
def legal_engine_status():
    """Which reasoning engine is active: a configured LLM, or retrieval-only."""
    info = llm.provider_info()
    info["ocr_available"] = extraction.tesseract_available()
    info["cloud_ocr"] = configured_chain(allow_external_ocr=True).status()
    return info

@api_router.get("/rag/status")
def rag_status():
    """Report the active vector/embedding backend and whether Qdrant is live."""
    return rag_engine.status()

@api_router.post("/rag/ingest")
def rag_ingest(req: RAGIngestRequest):
    """Ingest supplied chunks/documents into Qdrant or the local fallback."""
    return rag_engine.ingest_documents(
        [document.model_dump() for document in req.documents],
        classification=req.classification,
    ) | {"status": rag_engine.status()}

@api_router.post("/rag/search")
def rag_search(req: RAGSearchRequest):
    results = rag_engine.search(
        query=req.query,
        top_k=req.top_k,
        category=req.category,
        classification=req.classification,
    )
    return {
        "query": req.query,
        "backend": rag_engine.backend,
        "results": [
            {**chunk.payload(), "score": score}
            for chunk, score in results
        ],
    }

@api_router.post("/doc_intel/qa")
def doc_intel_qa(req: DocIntelQARequest):
    return doc_intel_service.search_and_qa(req.query)

@api_router.post("/marketing/campaign")
def generate_marketing(req: MarketingCampaignRequest):
    return marketing_service.generate_marketing_campaign(req.biz_name, req.biz_type, req.promotion_goal)

@api_router.post("/booking/message")
def customer_booking_chat(req: BookingMessageRequest):
    return booking_service.handle_customer_message(req.message, req.customer_phone or "")

@api_router.post("/eng/analyze")
def analyze_engineering_spec(req: EngAnalyzeRequest):
    return eng_service.analyze_tech_spec(req.sys_name, req.tech_spec_text)
