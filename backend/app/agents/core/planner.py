import time
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class DAGNode(BaseModel):
    step_id: str
    step_name: str
    description: str
    tool_required: str
    dependencies: List[str] = Field(default_factory=list)
    status: str = "PENDING"  # PENDING | RUNNING | COMPLETED | FAILED
    execution_ms: float = 0.0
    output_summary: Optional[str] = None

class DAGPlan(BaseModel):
    plan_id: str
    goal: str
    nodes: List[DAGNode] = Field(default_factory=list)
    total_estimated_steps: int = 0
    created_at: float = Field(default_factory=time.time)

class AgentPlanner:
    """Planning & Task Decomposition Engine for Level 7 AI Engineering Maturity."""
    
    def create_execution_plan(self, title: str, content: str, persona: str = "all_in_one", lang: str = "vi") -> DAGPlan:
        start_time = time.time()
        is_en = lang.lower() == "en"
        
        nodes = [
            DAGNode(
                step_id="step_1_ingest",
                step_name="Ingestion & Format Normalization" if is_en else "Trích Xuất & Chuẩn Hóa Hồ Sơ",
                description="Parse raw dossier documents into chunked text streams and detect language." if is_en else "Phân tích cú pháp văn bản hồ sơ và nhận diện ngôn ngữ.",
                tool_required="MultiFormatDocumentParser",
                dependencies=[]
            ),
            DAGNode(
                step_id="step_2_rag",
                step_name="Vector RAG & Precedent Retrieval" if is_en else "Truy Xuất Tri Thức & Án Lệ TANDTC 2026",
                description="Search Qdrant vector store and match binding Supreme Court precedents." if is_en else "Truy xuất cơ sở dữ liệu Qdrant và đối chiếu Án lệ TANDTC 2026.",
                tool_required="TANDTCPrecedentsMatcher2026",
                dependencies=["step_1_ingest"]
            ),
            DAGNode(
                step_id="step_3_evidence",
                step_name="Dual-Perspective Evidence Extraction" if is_en else "Trích Xuất Ma Trận Chứng Cứ 2 Chiều",
                description="Extract prosecution vs defense evidence items, witness statements, and aggravating factors." if is_en else "Lập ma trận đối chiếu chứng cứ giữa phái Buộc tội và Phái Bào chữa.",
                tool_required="DualPerspectiveEvidenceEngine",
                dependencies=["step_2_rag"]
            ),
            DAGNode(
                step_id="step_4_debate",
                step_name="Multi-Agent Simulation & Debate Protocol" if is_en else "Tranh Luận Đa Agent (VKS ⚔️ Luật Sư ➔ HĐXX)",
                description="Simulate adversarial debate between Prosecutor Agent and Defense Counsel Agent." if is_en else "Giả lập phiên tranh tụng phản biện giữa Agent Kiểm sát viên và Agent Luật sư.",
                tool_required="MultiAgentDebateEngine",
                dependencies=["step_3_evidence"]
            ),
            DAGNode(
                step_id="step_5_evals",
                step_name="RAG Verification & Quality Evals" if is_en else "Đánh Giá Chất Lượng RAG & Groundness Evals",
                description="Verify faithfulness score, answer relevancy, and citation precision." if is_en else "Tính toán chỉ số trung thực Faithfulness và Relevancy score.",
                tool_required="RAGEvaluator",
                dependencies=["step_4_debate"]
            )
        ]

        plan_id = f"dag_plan_{int(start_time)}"
        goal_text = f"Analyze case '{title}' under [{persona}] lens" if is_en else f"Phân tích toàn diện hồ sơ '{title}' theo vai trò [{persona}]"

        return DAGPlan(
            plan_id=plan_id,
            goal=goal_text,
            nodes=nodes,
            total_estimated_steps=len(nodes)
        )

agent_planner = AgentPlanner()
