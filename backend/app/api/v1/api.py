from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, Optional

from app.services.legal_service import legal_service
from app.services.doc_intel_service import doc_intel_service
from app.services.marketing_service import marketing_service
from app.services.booking_service import booking_service
from app.services.eng_service import eng_service
from app.rag.engine import rag_engine

api_router = APIRouter()

# Request Pydantic Models
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
    sys_name: str = "AI Core Platform Enterprise Engine"
    tech_spec_text: str = "FastAPI backend, PostgreSQL, Qdrant vector database, Celery task queue, Multi-Agent workflow."

@api_router.get("/project/info")
def get_project_info():
    return {
        "title": "90-Day AI Engineer & System Design Unified Platform",
        "description": "1 Core Engine (FastAPI + RAG + Multi-Agent) scaling 5 Vertical Products",
        "verticals": [
            {"id": 1, "name": "Trợ Lý Pháp Luật - Kiểm Sát Viên", "code": "LEGAL_AI"},
            {"id": 2, "name": "AI Document Intelligence Platform", "code": "DOC_INTEL"},
            {"id": 3, "name": "AI Marketing & Sales Agent", "code": "LOCAL_MARKETING"},
            {"id": 4, "name": "AI Customer Support & Booking Agent", "code": "SUPPORT_BOOKING"},
            {"id": 5, "name": "Engineering Knowledge Assistant", "code": "ENG_KNOWLEDGE"}
        ],
        "status": "ONLINE"
    }

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
