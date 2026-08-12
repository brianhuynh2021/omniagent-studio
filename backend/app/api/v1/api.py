from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from typing import Dict, Any, Optional, List

from app.core.config import settings
from app.services.legal_service import legal_service
from app.services.doc_intel_service import doc_intel_service
from app.services.marketing_service import marketing_service
from app.services.booking_service import booking_service
from app.services.eng_service import eng_service
from app.domains.registry import global_domain_registry, DomainAgentMeta
from app.domains.plugin_protocol import VerticalManifest, BaseVerticalPlugin, ToolDefinition
from app.agents.core.orchestrator import global_orchestrator
from app.agents.core.tool_registry import global_tool_registry
from app.services.custom_agent_service import custom_agent_service, CreateCustomAgentRequest

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

class DocIntelQARequest(BaseModel):
    query: str = "Quy định bảo mật dữ liệu công ty và thủ tục xin nghỉ phép?"

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
def get_sample_legal_cases():
    return legal_service.get_sample_cases()

@api_router.post("/legal/process")
def process_legal_dossier(req: LegalProcessRequest):
    return legal_service.process_case_dossier(req.title, req.content)

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
