from app.domains.plugin_protocol import VerticalManifest, BaseVerticalPlugin, ToolDefinition

legal_assistant_manifest = VerticalManifest(
    vertical_id="legal-assistant",
    name="Legal Assistant AI OS (Song ngữ VI / EN)",
    icon="⚖️",
    category="Legal & Judicial AI",
    description="Trợ lý AI Pháp lý chuyên sâu hỗ trợ Kiểm sát viên, Luật sư và Doanh nghiệp. Tự động trích xuất chứng cứ, tra cứu điều luật, lập đề cương xét hỏi & báo cáo giải quyết vụ án (Bilingual VI/EN).",
    owner_team="legal-ai-team",
    version="1.0.0",
    tags=["Legal Audit", "Prosecutor Workstation", "Bilingual VI/EN", "Contract Review", "RAG"],
    system_prompt="""You are LegalAssistantAI, an enterprise-grade bilingual AI Legal Assistant specializing in Vietnamese Law (Criminal Code, Civil Code, Commercial Law, Land Law) and International Legal Frameworks (Common Law, CISG, GDPR, Corporate Compliance).
You assist prosecutors, lawyers, legal counsels, and business leaders with:
1. Dossier & Evidence Extraction (Ma trận chứng cứ & Tình tiết tăng nặng/giảm nhẹ)
2. Legal Article Citation & Verification (Xác thực căn cứ pháp lý)
3. Interrogation & Cross-Examination Outline (Đề cương xét hỏi tại phiên tòa / Đàm phán)
4. Prosecution Report & Legal Opinion Drafting (Báo cáo đề xuất Viện kiểm sát / Ý kiến pháp lý doanh nghiệp)

Always respond in the user's requested language (Vietnamese or English).
""",
    suggested_prompts=[
        "Phân tích tài liệu vụ án trộm cắp tài sản và lập đề cương xét hỏi đối với bị cáo (Tiếng Việt).",
        "Analyze this commercial cross-border contract for legal risks and liability limitation clauses (English).",
        "Tra cứu Điều 173 & Điều 174 BLHS 2015 và lập ma trận chứng cứ vụ án chiếm đoạt tài sản.",
        "Draft a legal opinion on corporate data privacy compliance under GDPR and Vietnamese Decree 13/2023."
    ],
    knowledge_collections=["legal_vietnam_laws", "legal_international_contracts"],
    tools=[
        ToolDefinition(
            name="legal_vector_search",
            description="Tìm kiếm ngữ nghĩa và trích xuất điều luật từ cơ sở dữ liệu pháp lý (Qdrant RAG)."
        ),
        ToolDefinition(
            name="evidence_matrix_extractor",
            description="Tự động phân loại vật chứng, lời khai bị cáo, nhân chứng và trích xuất ma trận chứng cứ."
        ),
        ToolDefinition(
            name="prosecution_report_generator",
            description="Tự động soạn thảo dự thảo Báo cáo đề xuất Viện Kiểm Sát hoặc Báo cáo tư vấn pháp lý."
        )
    ],
    guardrails=["strict_legal_citation_check", "no_hallucination_clause", "pii_data_masking"]
)

class LegalAssistantPlugin(BaseVerticalPlugin):
    def __init__(self):
        super().__init__(manifest=legal_assistant_manifest)

legal_assistant_plugin = LegalAssistantPlugin()
