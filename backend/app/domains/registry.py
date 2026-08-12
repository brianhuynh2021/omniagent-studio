from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from app.domains.plugin_protocol import BaseVerticalPlugin, VerticalManifest

class DomainAgentMeta(BaseModel):
    id: str
    name: str
    domain_key: str
    icon: str
    description: str
    suggested_prompts: List[str]
    default_tools: List[str]
    system_prompt: str

class DomainMeta(BaseModel):
    key: str
    name: str
    icon: str
    description: str
    agents_count: int
    tags: List[str]

class UniversalCoreRegistry:
    """Universal Core AI Registry. Manages dynamic tenant manifests and registered core AI sub-agents."""
    def __init__(self):
        self._plugins: Dict[str, BaseVerticalPlugin] = {}
        self._core_agents: Dict[str, DomainAgentMeta] = {}
        self._bootstrap_core_agents()

    def _bootstrap_core_agents(self):
        core_list = [
            DomainAgentMeta(
                id="legal_prosecutor_assistant",
                name="Trợ Lý Kiểm Sát Viên & Pháp Luật",
                domain_key="legal",
                icon="⚖️",
                description="Hỗ trợ đọc hồ sơ hình sự/dân sự, lập đề cương hỏi và soạn báo cáo đề xuất vụ án.",
                suggested_prompts=[
                    "Phân tích tài liệu hình sự vụ án trộm cắp tài sản và lập đề cương hỏi đối với bị cáo.",
                    "Soạn báo cáo đề xuất giải quyết vụ án dân sự về tranh chấp đất đai theo Điều 203 Luật Đất đai."
                ],
                default_tools=["vector_rag_search", "web_search"],
                system_prompt="Bạn là Trợ lý AI Chuyên sâu ngành Kiểm sát và Pháp luật Việt Nam."
            ),
            DomainAgentMeta(
                id="healthcare_triage_assistant",
                name="Trợ Lý Phân Loại & Tóm Tắt Bệnh Án",
                domain_key="healthcare",
                icon="🏥",
                description="Hỗ trợ y bác sĩ tóm tắt lịch sử khám bệnh, gợi ý mã ICD-10 và cảnh báo tương tác thuốc.",
                suggested_prompts=[
                    "Tóm tắt hồ sơ bệnh án của bệnh nhân nam 54 tuổi có tiền sử cao huyết áp và tiểu đường type 2.",
                    "Tra cứu và gợi ý mã ICD-10 phù hợp cho triệu chứng viêm phổi kẽ cấp tính."
                ],
                default_tools=["vector_rag_search", "code_sandbox"],
                system_prompt="Bạn là Trợ lý Y khoa AI."
            ),
            DomainAgentMeta(
                id="finance_audit_agent",
                name="Chuyên Viên Phân Tích & Audit Tài Chính",
                domain_key="finance",
                icon="📊",
                description="Phân tích báo cáo tài chính Q3/Q4, tính toán các chỉ số P/E, ROE và cảnh báo biến động rủi ro.",
                suggested_prompts=[
                    "Đánh giá chỉ số tài chính dòng tiền lưu chuyển thuần của doanh nghiệp bán lẻ."
                ],
                default_tools=["code_sandbox", "sql_query_engine"],
                system_prompt="Bạn là Chuyên gia Phân tích Tài chính và Kiểm toán Rủi ro."
            ),
            DomainAgentMeta(
                id="enterprise_doc_intel",
                name="AI Document Intelligence Engine",
                domain_key="enterprise",
                icon="🏢",
                description="Hỏi đáp thông minh trên toàn bộ kho tài liệu nội bộ, hợp đồng và quy định công ty.",
                suggested_prompts=[
                    "Tìm quy định về chính sách thưởng doanh số Q3 trong sổ tay nhân sự."
                ],
                default_tools=["vector_rag_search", "web_search"],
                system_prompt="Bạn là Trợ lý Tri thức Enterprise RAG."
            )
        ]

        for agent in core_list:
            self._core_agents[agent.id] = agent

    def register_plugin(self, plugin: BaseVerticalPlugin):
        manifest = plugin.get_manifest()
        self._plugins[manifest.vertical_id] = plugin

    def get_plugin(self, vertical_id: str) -> Optional[BaseVerticalPlugin]:
        return self._plugins.get(vertical_id)

    def list_vertical_manifests(self) -> List[VerticalManifest]:
        return [p.get_manifest() for p in self._plugins.values()]

    def list_domains(self) -> List[DomainMeta]:
        res: List[DomainMeta] = []
        for p in self._plugins.values():
            m = p.get_manifest()
            res.append(DomainMeta(
                key=m.vertical_id,
                name=m.name,
                icon=m.icon,
                description=m.description,
                agents_count=1,
                tags=m.tags
            ))
        
        legacy_meta = [
            DomainMeta(key="legal", name="Legal & Judicial AI", icon="⚖️", description="Trợ lý Pháp luật, Kiểm sát viên, Soạn thảo đề xuất vụ án & Trích xuất chứng cứ", agents_count=1, tags=["RAG", "Legal Audit"]),
            DomainMeta(key="healthcare", name="Healthcare & Clinical AI", icon="🏥", description="Phân tích bệnh án, gợi ý mã ICD-10, Triage phân loại triệu chứng", agents_count=1, tags=["Medical Guardrails", "ICD-10"]),
            DomainMeta(key="finance", name="Finance & Risk Analytics", icon="📊", description="Tóm tắt báo cáo tài chính, phát hiện bất thường giao dịch", agents_count=1, tags=["Risk Audit", "Fraud Detection"]),
            DomainMeta(key="enterprise", name="Enterprise Knowledge RAG", icon="🏢", description="Hỏi đáp tài liệu nội bộ công ty, phân quyền Multi-Tenant", agents_count=1, tags=["Multi-Tenant", "GraphRAG"])
        ]
        res.extend(legacy_meta)
        return res

    def get_agent_meta(self, key_or_id: str) -> Optional[DomainAgentMeta]:
        plugin = self.get_plugin(key_or_id)
        if plugin:
            m = plugin.get_manifest()
            return DomainAgentMeta(
                id=m.vertical_id,
                name=m.name,
                domain_key=m.vertical_id,
                icon=m.icon,
                description=m.description,
                suggested_prompts=m.suggested_prompts,
                default_tools=[t.name for t in m.tools],
                system_prompt=m.system_prompt
            )
        return self._core_agents.get(key_or_id)

    def list_agents(self, domain_key: Optional[str] = None) -> List[DomainAgentMeta]:
        res: List[DomainAgentMeta] = []
        for p in self._plugins.values():
            m = p.get_manifest()
            if not domain_key or domain_key == m.vertical_id:
                res.append(DomainAgentMeta(
                    id=m.vertical_id,
                    name=m.name,
                    domain_key=m.vertical_id,
                    icon=m.icon,
                    description=m.description,
                    suggested_prompts=m.suggested_prompts,
                    default_tools=[t.name for t in m.tools],
                    system_prompt=m.system_prompt
                ))
        for core_ag in self._core_agents.values():
            if not domain_key or domain_key == core_ag.domain_key:
                res.append(core_ag)
        return res

global_domain_registry = UniversalCoreRegistry()
