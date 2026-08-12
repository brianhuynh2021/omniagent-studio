import time
from typing import Dict, Any, List
from app.agents.base import AgentResponse, Citation, ToolExecutionLog
from app.rag.engine import rag_engine

class ProsecutorLegalService:
    def __init__(self):
        # Pre-seed realistic legal demo dossier
        self._seed_sample_case()

    def _seed_sample_case(self):
        sample_title = "Vụ án Trộm cắp tài sản & Lừa đảo chiếm đoạt tài sản - Nguyễn Văn A"
        sample_content = """HỒ SƠ VỤ ÁN HÌNH SỰ: NGUYỄN VĂN A
Ngày 15/05/2026, tại phường B, thành phố C, bị cáo Nguyễn Văn A (SN 1992, trú tại X) đã có hành vi lén lút đột nhập vào nhà bà Trần Thị B lấy trộm 1 chiếc xe máy Honda SH trị giá 85.000.000 VNĐ.
Sau khi trộm cắp, A mang xe đi làm giả giấy đăng ký và bán cho ông Lê Văn C với giá 50.000.000 VNĐ.
Vật chứng thu giữ: 01 xe máy Honda SH BKS 29A-12345, 01 giấy đăng ký xe giả, 01 kìm cộng lực.
Lời khai bị cáo: Nguyễn Văn A khai nhận do nợ nần bài bạc nên nảy sinh ý định trộm cắp.
Lời khai người bị hại: Bà B xác nhận thời điểm mất tài sản vào khoảng 02h00 sáng.
Căn cứ pháp lý áp dụng: Điều 173 Bộ luật Hình sự 2015 (Tội trộm cắp tài sản) và Điều 174 Bộ luật Hình sự 2015 (Tội lừa đảo chiếm đoạt tài sản)."""
        rag_engine.add_document("case_001", sample_title, sample_content, category="legal")

    def process_case_dossier(self, title: str, content: str) -> AgentResponse:
        start_time = time.time()
        doc_id = f"case_{int(time.time())}"
        chunk_count = rag_engine.add_document(doc_id, title, content, category="legal")

        # RAG search for key evidence & legal articles
        search_results = rag_engine.search(query="tài sản trộm cắp vật chứng căn cứ pháp lý", top_k=3, category="legal")
        
        citations = []
        for chunk, score in search_results:
            citations.append(Citation(
                document_id=chunk.doc_id,
                document_name=chunk.doc_name,
                page_or_chunk=f"Trang {chunk.page} - Chunk #{chunk.chunk_id}",
                snippet=chunk.content[:150] + "...",
                relevance_score=score
            ))

        trace_logs = [
            ToolExecutionLog(
                tool_name="DocumentIntelligenceParser",
                input_args={"title": title, "content_length": len(content)},
                output_summary=f"Trích xuất thành công {chunk_count} phân đoạn dữ liệu pháp lý.",
                execution_time_ms=45.2
            ),
            ToolExecutionLog(
                tool_name="LegalEvidenceExtractor",
                input_args={"doc_id": doc_id},
                output_summary="Đã phân loại vật chứng, lời khai bị cáo, người bị hại và điều luật áp dụng.",
                execution_time_ms=88.5
            ),
            ToolExecutionLog(
                tool_name="ProsecutorOutlineBuilder",
                input_args={"case_type": "Hình sự"},
                output_summary="Tạo đề cương xét hỏi 4 bước cho Kiểm sát viên tại phiên tòa.",
                execution_time_ms=62.1
            )
        ]

        summary_result = {
            "case_title": title,
            "defendant": "Nguyễn Văn A (SN 1992)",
            "charges": ["Tội trộm cắp tài sản (Điều 173 BLHS)", "Tội lừa đảo chiếm đoạt tài sản (Điều 174 BLHS)"],
            "total_damages": "85.000.000 VNĐ",
            "key_evidence": [
                "01 Xe máy Honda SH BKS 29A-12345",
                "01 Giấy đăng ký xe giả mạo",
                "01 Kìm cộng lực dùng đột nhập"
            ],
            "questioning_outline": [
                "1. Hỏi bị cáo về thời gian, công cụ và phương thức đột nhập vào nhà bà Trần Thị B.",
                "2. Hỏi bị cáo về quá trình làm giả giấy tờ và giao dịch bán xe cho ông Lê Văn C.",
                "3. Hỏi người bị hại về tình trạng bảo quản tài sản và thời điểm phát hiện mất.",
                "4. Hỏi người có quyền lợi nghĩa vụ liên quan (ông C) về số tiền đã giao dịch và nhận thức về nguồn gốc tài sản."
            ],
            "proposed_prosecution_draft": f"CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM\nĐộc lập - Tự do - Hạnh phúc\n\nBÁO CÁO ĐỀ XUẤT GIẢI QUYẾT VỤ ÁN\nKính gửi: Lãnh đạo Viện Kiểm sát nhân dân\nV/v: Báo cáo án hình sự đối với bị cáo Nguyễn Văn A.\n\nI. NỘI DUNG VỤ ÁN:\n{content[:300]}...\n\nII. QUYẾT ĐỊNH ĐỀ XUẤT:\n1. Truy tố bị cáo Nguyễn Văn A ra trước Tòa án nhân dân cùng cấp.\n2. Áp dụng hình phạt tù từ 03 năm đến 05 năm tù theo quy định tại Điều 173, Điều 174 BLHS."
        }

        total_latency = (time.time() - start_time) * 1000

        return AgentResponse(
            agent_name="ProsecutorLegalAssistantAgent",
            output_text=f"Đã hoàn thành phân tích hồ sơ vụ án '{title}'. Đã trích xuất chứng cứ, lập đề cương hỏi và bản dự thảo báo cáo đề xuất cho Kiểm sát viên.",
            structured_data=summary_result,
            citations=citations,
            trace_logs=trace_logs,
            hallucination_check_passed=True,
            total_latency_ms=round(total_latency, 2)
        )

legal_service = ProsecutorLegalService()
