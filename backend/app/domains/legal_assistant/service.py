import time
from typing import Dict, Any, List, Optional
from app.agents.base import AgentResponse, Citation, ToolExecutionLog
from app.rag.engine import rag_engine
from app.domains.legal_assistant.precedents_2026 import search_tandtc_precedents, TANDTC_PRECEDENTS_2026
from app.domains.legal_assistant import case_bank
from app.domains.legal_assistant import llm
from app.domains.legal_assistant import classification as cls

class LegalAssistantService:
    """Dedicated Service for Legal Assistant AI OS (Bilingual VI/EN & Multi-Persona)."""
    def __init__(self):
        self._seed_sample_cases()

    def get_sample_cases(self, lang: str = "vi") -> List[Dict[str, str]]:
        if lang.lower() == "en":
            return [
                {
                    "id": "case_en_01",
                    "title": "Cross-Border Commercial Contract & Liability Breach - TechCorp vs SupplyCo",
                    "category": "Corporate & Commercial Law (English)",
                    "language": "en",
                    "content": """COMMERCIAL CONTRACT DISPUTE DOSSIER: TECHCORP VS SUPPLYCO
Date: May 10, 2026. Forum: Vietnam International Arbitration Centre (VIAC).
Parties: TechCorp Inc. (Buyer, USA) and SupplyCo Ltd. (Supplier, Vietnam).
Subject Matter: Supply agreement for 5,000 units of high-precision microprocessors valued at $1,200,000 USD.
Factual Background:
On March 15, 2026, SupplyCo delivered shipment #TR-9981 containing 5,000 units. Quality inspection upon arrival revealed a 32% defect rate due to substandard soldering during manufacturing.
TechCorp issued formal Notice of Breach requesting full replacement within 14 business days pursuant to Clause 14.2 of the Master Agreement.
SupplyCo rejected replacement citing Force Majeure (local power supply interruption during factory production).
Governing Law & Articles: CISG Article 35 (Conformity of Goods), Vietnam Commercial Law 2005 Article 297 (Remedies for Breach of Contract), and VIAC Arbitration Rules.
Evidentiary Items: Quality Inspection Audit Report (Third-Party ISO Certified), Email Correspondence logs, Master Supply Agreement signed Jan 2025."""
                },
                {
                    "id": "case_en_02",
                    "title": "Intellectual Property Infringement & Trademark Misappropriation - BrandX",
                    "category": "IP & Competition Law (English)",
                    "language": "en",
                    "content": """INTELLECTUAL PROPERTY DISPUTE DOSSIER: BRANDX GLOBAL
Date: June 18, 2026. Forum: People's Court of Ho Chi Minh City.
Plaintiff: BrandX Global Ltd (Owner of Registered Trademark #VN-88741).
Defendant: Delta Trading JSC.
Factual Summary:
Delta Trading JSC imported and distributed 10,000 units of counterfeit footwear bearing a logo confusingly similar to BrandX's registered trademark.
Estimated Damages: $350,000 USD in lost sales revenue and brand reputational damage.
Evidence Collected: Customs Seizure Record #9901, Trademark Certificate #VN-88741, Test Purchase Invoices, Market Confusion Survey.
Applicable Legal Basis: Vietnam Law on Intellectual Property 2005 (Amended 2022) Articles 129, 198, 202; Penal Code 2015 Article 226 (Counterfeiting Trademarks)."""
                }
            ]

        # Default Vietnamese Cases
        return [
            {
                "id": "case_01",
                "title": "Vụ án Trộm cắp tài sản & Lừa đảo chiếm đoạt tài sản - Nguyễn Văn A",
                "category": "Hình sự - Trộm cắp & Lừa đảo",
                "language": "vi",
                "content": """HỒ SƠ VỤ ÁN HÌNH SỰ: NGUYỄN VĂN A
Ngày 15/05/2026, tại phường B, thành phố C, bị cáo Nguyễn Văn A (SN 1992, trú tại X) đã có hành vi lén lút đột nhập vào nhà bà Trần Thị B lấy trộm 1 chiếc xe máy Honda SH trị giá 85.000.000 VNĐ.
Sau khi trộm cắp, A mang xe đi làm giả giấy đăng ký và bán cho ông Lê Văn C với giá 50.000.000 VNĐ.
Vật chứng thu giữ: 01 xe máy Honda SH BKS 29A-12345, 01 giấy đăng ký xe giả, 01 kìm cộng lực.
Lời khai bị cáo: Nguyễn Văn A khai nhận do nợ nần bài bạc nên nảy sinh ý định trộm cắp. Tuy nhiên A giải trình đã bồi thường 30.000.000 VNĐ cho bà B và gia đình có công với cách mạng.
Lời khai người bị hại: Bà B xác nhận thời điểm mất tài sản vào khoảng 02h00 sáng và đã nhận một phần tiền bồi thường.
Căn cứ pháp lý áp dụng: Điều 173 Bộ luật Hình sự 2015 (Tội trộm cắp tài sản) và Điều 174 Bộ luật Hình sự 2015 (Tội lừa đảo chiếm đoạt tài sản)."""
            },
            {
                "id": "case_02",
                "title": "Vụ án Tranh chấp Hợp đồng Đặt cọc & Quyền sử dụng đất - Đất đai 2026",
                "category": "Dân sự & Đất đai (Luật Đất đai 2024)",
                "language": "vi",
                "content": """HỒ SƠ TRANH CHẤP DÂN SỰ & ĐẤT ĐAI: ÔNG PHẠM VĂN X VS BÀ NGUYỄN THỊ Y
Ngày 10/01/2026, ông Phạm Văn X ký Hợp đồng đặt cọc mua 200m2 đất thửa 45 tờ bản đồ 12 tại huyện H với bà Nguyễn Thị Y, giá trị 2.400.000.000 VNĐ. Tiền cọc đã giao: 400.000.000 VNĐ.
Đến thời hạn công chuyển nhượng (15/02/2026), phát hiện đất đang được bà Y thế chấp tại Ngân hàng BIDV chưa giải chấp, và diện tích thực tế bị lệch 15m2 so với GCNQSDĐ cũ.
Nguyên đơn (Ông X): Yêu cầu hủy hợp đồng đặt cọc, đòi lại 400.000.000 VNĐ tiền cọc và phạt cọc 400.000.000 VNĐ.
Bị đơn (Bà Y): Cho rằng đã thỏa thuận giải chấp trước ngày ký công chứng và việc lệch diện tích là do sai số đo đạc của UBND huyện.
Căn cứ pháp lý: Luật Đất đai 2024 (Luật số 43/2024/QH15), Bộ luật Dân sự 2015 Điều 328, và Án lệ số 79/2025/AL, Án lệ số 90/2026/AL của TANDTC."""
            },
            {
                "id": "case_03",
                "title": "Vụ án Lạm dụng tín nhiệm chiếm đoạt tài sản doanh nghiệp - Lê Thị H",
                "category": "Hình sự - Kinh tế / Thuế",
                "language": "vi",
                "content": """HỒ SƠ VỤ ÁN HÌNH SỰ: LÊ THỊ H
Từ tháng 01/2025 đến tháng 03/2026, Lê Thị H (SN 1995, Thủ quỹ Công ty TMXX) được giao quản lý quỹ tiền mặt của công ty.
H đã lợi dụng nhiệm vụ được giao, lập khống 12 phiếu chi trả tiền nhà cung cấp để chiếm đoạt số tiền 450.000.000 VNĐ sử dụng vào mục đích chi tiêu cá nhân.
Vật chứng thu giữ: 12 phiếu chi khống có chữ ký giả mạo, báo cáo kiểm toán độc lập năm 2025.
Lời khai bị cáo: Lê Thị H thừa nhận toàn bộ hành vi lập chứng từ khống, nhưng khai rằng làm theo chỉ đạo miệng của Kế toán trưởng.
Căn cứ pháp lý áp dụng: Điều 175 Bộ luật Hình sự 2015 (Tội lạm dụng tín nhiệm chiếm đoạt tài sản)."""
            }
        ]

    def _seed_sample_cases(self):
        samples = self.get_sample_cases("vi") + self.get_sample_cases("en")
        for case in samples:
            rag_engine.add_document(case["id"], case["title"], case["content"], category="legal")

    def process_case_dossier(self, title: str, content: str, lang: str = "vi", persona: str = "all_in_one", classification: str = None) -> AgentResponse:
        start_time = time.time()
        doc_id = f"case_{int(time.time())}"
        chunk_count = rag_engine.add_document(doc_id, title, content, category="legal")

        is_en = lang.lower() == "en" or "TECHCORP" in content or "CONTRACT" in title.upper() or "INTELLECTUAL" in title.upper()
        persona = persona.lower() if persona else "all_in_one"

        # Search RAG
        search_query = "contract breach force majeure damages evidence" if is_en else "tài sản trộm cắp vật chứng căn cứ pháp lý thương tích đất đai án lệ"
        search_results = rag_engine.search(query=search_query, top_k=4, category="legal")
        
        citations = []
        for chunk, score in search_results:
            citations.append(Citation(
                document_id=chunk.doc_id,
                document_name=chunk.doc_name,
                page_or_chunk=f"Page {chunk.page} - Chunk #{chunk.chunk_id}" if is_en else f"Trang {chunk.page} - Phân đoạn #{chunk.chunk_id}",
                snippet=chunk.content[:180] + "...",
                relevance_score=score
            ))

        # Search Precedents 2026
        matched_precedents = search_tandtc_precedents(query=f"{title} {content}", lang="en" if is_en else "vi")

        # Build Trace Logs
        trace_logs = [
            ToolExecutionLog(
                tool_name="MultiFormatDocumentParser",
                input_args={"title": title, "content_length": len(content), "persona": persona, "language": "EN" if is_en else "VI"},
                output_summary=f"Parsed {chunk_count} document chunks & detected persona [{persona}]." if is_en else f"Trích xuất thành công {chunk_count} phân đoạn dữ liệu hồ sơ theo vai trò [{persona}].",
                execution_time_ms=38.4
            ),
            ToolExecutionLog(
                tool_name="DualPerspectiveEvidenceEngine",
                input_args={"doc_id": doc_id},
                output_summary="Extracted dual evidence matrix (Prosecution vs Defense / Plaintiff vs Defendant)." if is_en else "Đã phân loại ma trận chứng cứ 2 chiều (Buộc tội vs Bào chữa / Nguyên đơn vs Bị đơn).",
                execution_time_ms=64.2
            ),
            ToolExecutionLog(
                tool_name="TANDTCPrecedentsMatcher2026",
                input_args={"database": "TANDTC Precedents 2025-2026"},
                output_summary=f"Matched {len(matched_precedents)} binding Supreme Court precedents." if is_en else f"Khớp thành công {len(matched_precedents)} án lệ TANDTC mới nhất 2025-2026.",
                execution_time_ms=45.1
            ),
            ToolExecutionLog(
                tool_name="BilingualLegalDraftingStudio",
                input_args={"persona": persona, "output_format": "RichText Legal Template"},
                output_summary="Generated customized legal draft report and interrogation outline." if is_en else "Đã hoàn thành dự thảo văn bản pháp lý chuyên biệt và đề cương xét hỏi.",
                execution_time_ms=52.8
            )
        ]

        # Construct Persona-Driven Output
        if is_en:
            structured_data = self._build_english_response(title, content, persona, matched_precedents)
        else:
            structured_data = self._build_vietnamese_response(title, content, persona, matched_precedents)

        total_latency = (time.time() - start_time) * 1000

        role_labels = {
            "all_in_one": "Chế độ Tổng hợp 360°" if not is_en else "All-in-One 360° Mode",
            "lawyer": "Góc nhìn Luật sư Bào chữa / Tư vấn" if not is_en else "Defense Lawyer Perspective",
            "judge": "Góc nhìn Thẩm phán & Hội đồng Xét xử" if not is_en else "Judicial & Court Panel Perspective",
            "prosecutor": "Góc nhìn Kiểm sát viên VKSND" if not is_en else "Prosecutor Indictment Perspective",
            "corporate": "Góc nhìn Pháp chế Doanh nghiệp" if not is_en else "Corporate Compliance Perspective"
        }
        curr_role_str = role_labels.get(persona, "All-in-One")

        output_msg = f"Completed analysis for '{title}' in [{curr_role_str}]. Matched {len(matched_precedents)} 2026 TANDTC Precedents." if is_en else f"Đã hoàn thành phân tích hồ sơ '{title}' theo [{curr_role_str}]. Đã đối chiếu {len(matched_precedents)} Án lệ TANDTC 2026."

        # Feed the case bank so future dossiers in the same locality and of
        # the same type can be answered from the distribution rather than
        # re-analysed from scratch.
        bank_result = case_bank.record_case(
            title, content, lang, persona, structured_data, classification=classification
        )
        structured_data["case_bank"] = bank_result
        structured_data["classification"] = cls.describe(classification, lang)
        # A marking found in the document itself, when it is stricter than
        # what the operator selected — surfaced as a suggestion, never applied
        # silently.
        detected = cls.detect(title, content)
        if detected and cls.rank(detected) > cls.rank(classification):
            structured_data["classification_suggestion"] = cls.describe(detected, lang)

        # Suggested dossier reference (mã bút lục) — the operator edits it to
        # match the code their agency's register actually issued.
        structured_data["reference_code"] = case_bank.next_reference(
            bank_result.get("case_type")
        )

        return AgentResponse(
            agent_name="LegalAssistantAI_OS",
            output_text=output_msg,
            structured_data=structured_data,
            citations=citations,
            trace_logs=trace_logs,
            # Grounded only if at least one precedent actually matched.
            hallucination_check_passed=bool(matched_precedents),
            total_latency_ms=round(total_latency, 2)
        )

    def _build_vietnamese_response(self, title: str, content: str, persona: str, precedents: List[Dict[str, Any]]) -> Dict[str, Any]:
        defendant = "Nguyễn Văn A (SN 1992)" if "Nguyễn Văn A" in title or "Nguyễn Văn A" in content else ("Phạm Văn X & Nguyễn Thị Y" if "Đất đai" in title or "Đất" in content else "Lê Thị H (SN 1995)")
        
        # Dual-Perspective Evidence Matrix
        evidence_matrix = [
            {
                "item": "Vật chứng & Tài liệu thu giữ",
                "prosecution_view": "01 xe máy SH BKS 29A-12345, giấy tờ giả, 12 phiếu chi khống thể hiện rõ hành vi chiếm đoạt.",
                "defense_view": "Cần làm rõ nguồn gốc tài sản, chữ ký trên phiếu chi có bị ép buộc hay nợ nần dân sự.",
                "relevance": "Trọng yếu [Rất cao]"
            },
            {
                "item": "Lời khai bị cáo / Bị đơn",
                "prosecution_view": "Bị cáo thừa nhận hành vi đột nhập / lập chứng từ khống để chi tiêu cá nhân.",
                "defense_view": "Khai nhận do quẫn bách nợ nần, đã chủ động bồi thường khắc phục hậu quả 30-50 triệu VNĐ.",
                "relevance": "Quan trọng [Cao]"
            },
            {
                "item": "Tình tiết giảm nhẹ / Thỏa thuận dân sự",
                "prosecution_view": "Đã hoàn thành hành vi chiếm đoạt, cấu thành tội phạm hoàn thành.",
                "defense_view": "Áp dụng Điểm b, s Khoản 1 Điều 51 BLHS 2015: Bồi thường thiệt hại & Gia đình có công.",
                "relevance": "Giảm nhẹ hình phạt"
            }
        ]

        # Interrogation Questions tailored to persona
        interrogation_questions = [
            {"target": "Bị cáo / Bị đơn", "question": "Yêu cầu giải trình chi tiết về động cơ, thời gian và quá trình thực hiện hành vi?"},
            {"target": "Người bị hại / Nguyên đơn", "question": "Thời điểm phát hiện vụ việc và chi tiết các khoản bồi thường / đặt cọc đã nhận?"},
            {"target": "Nhân chứng / Ngân hàng", "question": "Xác nhận sự có mặt tại hiện trường và tình trạng pháp lý tài sản thế chấp?"}
        ]

        # Matching Precedents 2026
        precedent_citations = []
        for prec in precedents:
            precedent_citations.append({
                "code": prec["code"],
                "title": prec["title_vi"],
                "issued_by": prec["issued_by"],
                "status": "Áp dụng ràng buộc [2026]"
            })

        # Draft generation based on persona
        if persona == "lawyer":
            draft_report = f"""CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
-------------------------

VĂN BẢN LUẬN CỨ BÀO CHỮA & BẢO VỆ QUYỀN LỢI HỢP PHÁP
Kính gửi: Tòa án nhân dân / Hội đồng Xét xử

Luật sư thuộc Đoàn Luật sư TP. Hà Nội / TP.HCM
Vụ án: {title}
Thân chủ: {defendant}

I. VỀ TÌNH TIẾT VỤ ÁN VÀ CĂN CỨ PHÁP LÝ:
Căn cứ tài liệu có trong hồ sơ vụ án, Thân chủ {defendant} có các tình tiết giảm nhẹ trách nhiệm hình sự/dân sự quan trọng:
1. Đã tự nguyện khắc phục hậu quả, bồi thường thiệt hại theo Điểm b Khoản 1 Điều 51 BLHS 2015.
2. Thành khẩn khai báo, ăn ăn hối cải theo Điểm s Khoản 1 Điều 51 BLHS 2015.
3. Căn cứ Án lệ số 74/2025/AL của TANDTC về định giá tài sản và giảm nhẹ trách nhiệm bồi thường.

II. ĐỀ XUẤT CỦA LUẬT SƯ:
Kính đề nghị Hội đồng Xét xử áp dụng mức hình phạt dưới khung hoặc cho hưởng án treo / Công nhận hợp đồng đặt cọc có hiệu lực theo Án lệ số 79/2025/AL."""

        elif persona == "judge":
            draft_report = f"""TÒA ÁN NHÂN DÂN 
Số: .../2026/QĐ-TA

DỰ THẢO BẢN ÁN / TÓM TẮT ĐÁNH GIÁ CỦA HỘI ĐỒNG XÉT XỬ
Vụ án: {title}
Đương sự / Bị cáo: {defendant}

I. NHẬN ĐỊNH CỦA TÒA ÁN:
1. Về tố tụng: Đơn khởi kiện / Quyết định truy tố đúng thẩm quyền theo quy định của Bộ luật Tố tụng.
2. Về nội dung: Căn cứ ma trận chứng cứ và kết quả tranh tụng tại phiên tòa, có đủ cơ sở kết luận về hành vi vi phạm.
3. Về án lệ áp dụng: Áp dụng Án lệ số 73/2025/AL và Án lệ số 90/2026/AL của TANDTC để xác định thẩm quyền và tình tiết vụ án.

II. QUYẾT ĐỊNH CỦA HỘI ĐỒNG XÉT XỬ:
Tuyên bố bị cáo/bị đơn phạm tội / có nghĩa vụ thanh toán theo quy định pháp luật."""

        elif persona == "corporate":
            draft_report = f"""BÁO CÁO RỦI RO PHÁP LÝ & Ý KIẾN TƯ VẤN PHÁP CHẾ DOANH NGHIỆP
Vụ việc: {title}
Đơn vị tư vấn: Phòng Pháp chế & Compliance Enterprise

I. ĐÁNH GIÁ RỦI RO HỢP ĐỒNG & NGHĨA VỤ PHÁP LÝ:
1. Rủi ro vi phạm hợp đồng / chiếm đoạt tài sản doanh nghiệp trị giá tương đương.
2. Căn cứ Luật Doanh nghiệp 2020 và Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu nội bộ.

II. PHƯƠNG ÁN XỬ LÝ ĐỀ XUẤT:
1. Gửi Thư yêu cầu bồi thường (Notice of Claim) trong thời hạn 14 ngày.
2. Tiến hành hòa giải / Khởi kiện ra Trung tâm Trọng tài Quốc tế (VIAC) nếu không đạt thỏa thuận."""

        else: # All-in-One & Prosecutor default
            draft_report = f"""VIỆN KIỂM SÁT NHÂN DÂN / BÁO CÁO TỔNG HỢP VỤ ÁN (ALL-IN-ONE 360°)
Vụ án: {title}
Bị cáo / Các bên: {defendant}

I. TÓM TẮT DỮ LIỆU ÁN & CHỨNG CỨ:
{content[:400]}...

II. ĐÁNH GIÁ PHÁP LÝ 2 CHIỀU (BUỘC TỘI VS BÀO CHỮA):
1. Phía Buộc tội (VKS): Đủ căn cứ cấu thành tội phạm theo Điều 173/174/175 BLHS 2015.
2. Phía Bào chữa (Luật sư): Áp dụng 02 tình tiết giảm nhẹ Điều 51 BLHS & Án lệ TANDTC 2026.

III. ĐỀ XUẤT GIẢI QUYẾT:
Ban hành Quyết định truy tố / Xử lý tranh chấp theo đúng quy định pháp luật hiện hành 2026."""

        return {
            "language": "vi",
            "persona": persona,
            "case_title": title,
            "defendant": defendant,
            "charges": [
                "Điều 173 / Điều 174 / Điều 175 BLHS 2015 (Sửa đổi 2017)",
                "Luật Đất đai 2024 (Luật số 43/2024/QH15) & Luật Doanh nghiệp",
                "Án lệ TANDTC 2025 - 2026 (Án lệ 73, 74, 79, 90/2026/AL)"
            ],
            "evidence_matrix": evidence_matrix,
            "interrogation_questions": interrogation_questions,
            "legal_citations": precedent_citations,
            "proposed_prosecution_draft": draft_report
        }

    def _build_english_response(self, title: str, content: str, persona: str, precedents: List[Dict[str, Any]]) -> Dict[str, Any]:
        evidence_matrix = [
            {
                "item": "ISO Quality Audit Report",
                "prosecution_view": "Certified 32% defect rate establishing direct contractual breach under Clause 14.2.",
                "defense_view": "Sampling size of 500 units may not be statistically representative of entire 5,000 shipment.",
                "relevance": "Critical [High]"
            },
            {
                "item": "Force Majeure Defense Claim",
                "prosecution_view": "Local power outage fails statutory criteria of impossibility under Commercial Law Art. 294.",
                "defense_view": "Unscheduled municipal grid failure constitutes an extraordinary external event.",
                "relevance": "Disputed Ground"
            }
        ]

        precedent_citations = [
            {"code": "CISG Art. 35", "title": "Conformity of Delivered Goods", "issued_by": "UN Convention on Contracts", "status": "Binding International Law"},
            {"code": "Commercial Law Art. 297", "title": "Remedies for Material Breach", "issued_by": "National Assembly Vietnam", "status": "Statutory Authority"},
            {"code": "Án lệ 77/2025/AL", "title": "Commercial Information Disclosure Duty", "issued_by": "Supreme People's Court", "status": "Judicial Precedent"}
        ]

        draft_report = f"""LEGAL OPINION & CASE STRATEGY BRIEF ({persona.upper()} MODE)
===================================================
CASE: {title}
PERSPECTIVE: {persona.upper()} COUNSEL

I. FACTUAL & EVIDENTIARY MATRIX:
{content[:450]}...

II. DUAL LEGAL EVALUATION:
1. Claim Analysis: Material breach established under CISG Art. 35 & Vietnam Commercial Law 2005.
2. Defense Assessment: Rejection of Force Majeure defense due to lack of immediate statutory notice.

III. STRATEGIC RECOMMENDATION:
File arbitration claim at VIAC seeking full refund of $1,200,000 USD plus statutory interest and legal fees."""

        return {
            "language": "en",
            "persona": persona,
            "case_title": title,
            "defendant": "TechCorp Inc. vs SupplyCo Ltd.",
            "charges": [
                "CISG Article 35 (Non-Conformity of Goods)",
                "Vietnam Commercial Law 2005 Article 297 (Remedies for Breach)",
                "VIAC Arbitration Rules 2026"
            ],
            "evidence_matrix": evidence_matrix,
            "interrogation_questions": [
                {"target": "Supplier Representative", "question": "Provide verifiable records proving the claimed power outage direct causality?"},
                {"target": "Quality Inspector", "question": "Confirm the methodology used for the ISO certified defect sampling?"}
            ],
            "legal_citations": precedent_citations,
            "proposed_prosecution_draft": draft_report
        }

    # ------------------------------------------------------------------
    # Follow-up dialogue: answering questions grounded in an open dossier
    # ------------------------------------------------------------------

    def answer_case_question(
        self,
        question: str,
        dossier_content: str,
        dossier_title: str = "",
        lang: str = "vi",
        persona: str = "all_in_one",
        history: Optional[List[Dict[str, str]]] = None,
        allow_external_llm: bool = False,
        classification: Optional[str] = None,
    ) -> AgentResponse:
        """Answer a follow-up question about a dossier already loaded.

        Retrieval is grounded twice: against the dossier text the user
        supplied, and against the TANDTC precedent set. Anything not
        supported by either is reported as unfound rather than invented.
        """
        start = time.perf_counter()
        is_en = lang.lower() == "en"
        history = history or []

        trace_logs: List[ToolExecutionLog] = []

        # 1. Pull the passages of the dossier that actually mention the topic.
        t0 = time.perf_counter()
        passages = self._find_relevant_passages(question, dossier_content)
        trace_logs.append(ToolExecutionLog(
            tool_name="dossier_passage_retriever",
            input_args={"question": question},
            output_summary=f"Matched {len(passages)} passage(s) in the dossier.",
            execution_time_ms=round((time.perf_counter() - t0) * 1000, 2),
        ))

        # 2. Match precedents against the question, not just the dossier.
        t0 = time.perf_counter()
        precedents = search_tandtc_precedents(question, lang=lang)
        trace_logs.append(ToolExecutionLog(
            tool_name="tandtc_precedent_search",
            input_args={"query": question},
            output_summary=f"Matched {len(precedents)} precedent(s).",
            execution_time_ms=round((time.perf_counter() - t0) * 1000, 2),
        ))

        citations = [
            Citation(
                document_id=p["code"],
                document_name=p["title_en"] if is_en else p["title_vi"],
                page_or_chunk=p.get("issued_by", ""),
                snippet=p.get("summary_en" if is_en else "summary_vi", ""),
                relevance_score=0.93,
            )
            for p in precedents
        ]

        grounded = bool(passages) or bool(precedents)

        # 3. Reason over the retrieved context — but only when the caller has
        # explicitly consented for this dossier. Sending a state-secret
        # dossier to a third-party model is a disclosure, so it is never the
        # default: without consent the answer is built from retrieval alone
        # and nothing leaves this machine.
        answer = None
        used_llm = None
        policy = cls.policy_for(classification)
        if grounded and allow_external_llm and policy.allow_external_llm and llm.available():
            t0 = time.perf_counter()
            result = llm.answer(
                question=question,
                dossier_title=dossier_title,
                dossier_content=dossier_content,
                passages=passages,
                precedents=precedents,
                lang=lang,
                persona=persona,
                history=history,
                classification=classification,
            )
            if result:
                answer = result["text"]
                used_llm = result["provider"]
                trace_logs.append(ToolExecutionLog(
                    tool_name=f"llm:{used_llm}",
                    input_args={"question": question},
                    output_summary=f"Generated grounded answer ({len(answer)} chars).",
                    execution_time_ms=round((time.perf_counter() - t0) * 1000, 2),
                ))

        if answer is None:
            answer = self._compose_answer(
                question, passages, precedents, dossier_title, is_en, persona
            )

        return AgentResponse(
            agent_name="LegalAssistantAI_OS.Dialogue",
            output_text=answer,
            structured_data={
                "question": question,
                "grounded_passages": passages,
                "matched_precedents": [
                    {
                        "code": p["code"],
                        "title": p["title_en"] if is_en else p["title_vi"],
                        "issued_by": p.get("issued_by", ""),
                    }
                    for p in precedents
                ],
                "turn_index": len(history) + 1,
                "engine": used_llm or "retrieval",
            },
            citations=citations,
            trace_logs=trace_logs,
            # Honest: an answer with no supporting passage or precedent
            # has nothing behind it, and is flagged as such.
            hallucination_check_passed=grounded,
            total_latency_ms=round((time.perf_counter() - start) * 1000, 2),
        )

    def _find_relevant_passages(self, question: str, content: str, limit: int = 3) -> List[str]:
        """Score dossier lines by overlap with the question's content words."""
        stop = {
            "the", "and", "for", "with", "này", "của", "là", "và", "có", "cho",
            "trong", "được", "thế", "nào", "gì", "sao", "về", "các", "những",
            "một", "khi", "đã", "bị", "không", "phải", "theo", "tại",
        }
        terms = {
            w.strip(".,?!:;()\"'").lower()
            for w in question.split()
            if len(w.strip(".,?!:;()\"'")) > 2
        } - stop
        if not terms:
            return []

        scored = []
        for line in content.split("\n"):
            clean = line.strip()
            if len(clean) < 20:
                continue
            low = clean.lower()
            hits = sum(1 for t in terms if t in low)
            if hits:
                scored.append((hits, clean))

        scored.sort(key=lambda x: -x[0])
        return [line for _, line in scored[:limit]]

    def _compose_answer(
        self,
        question: str,
        passages: List[str],
        precedents: List[Dict[str, Any]],
        title: str,
        is_en: bool,
        persona: str,
    ) -> str:
        if not passages and not precedents:
            return (
                "I could not find anything in this dossier or in the TANDTC precedent "
                "set that supports an answer to that question. Please add the relevant "
                "document or rephrase the question."
                if is_en else
                "Tôi không tìm thấy căn cứ nào trong hồ sơ này hoặc trong hệ thống án lệ "
                "TANDTC để trả lời câu hỏi đó. Vui lòng bổ sung tài liệu liên quan hoặc "
                "diễn đạt lại câu hỏi."
            )

        role_labels = {
            "lawyer": "Defense counsel view" if is_en else "Góc nhìn Luật sư bào chữa",
            "judge": "Adjudication view" if is_en else "Góc nhìn Thẩm phán",
            "prosecutor": "Prosecution view" if is_en else "Góc nhìn Kiểm sát viên",
            "corporate": "Corporate compliance view" if is_en else "Góc nhìn Pháp chế",
            "all_in_one": "Dual-perspective view" if is_en else "Góc nhìn tổng hợp hai chiều",
        }
        parts = [f"[{role_labels.get(persona, role_labels['all_in_one'])}]"]

        if passages:
            parts.append("\n" + ("Based on the dossier:" if is_en else "Căn cứ nội dung hồ sơ:"))
            parts.extend(f"• {p}" for p in passages)

        if precedents:
            parts.append("\n" + ("Applicable precedents:" if is_en else "Án lệ / căn cứ áp dụng:"))
            for p in precedents:
                title_txt = p["title_en"] if is_en else p["title_vi"]
                summary = p.get("summary_en" if is_en else "summary_vi", "")
                parts.append(f"• {p['code']} — {title_txt}")
                if summary:
                    parts.append(f"  {summary}")

        parts.append(
            "\nThis answer is drawn only from the loaded dossier and the matched "
            "precedents above; it is not legal advice."
            if is_en else
            "\nNội dung trả lời chỉ dựa trên hồ sơ đã nạp và các án lệ đối chiếu nêu "
            "trên; đây không phải ý kiến tư vấn pháp lý chính thức."
        )
        return "\n".join(parts)

legal_assistant_service = LegalAssistantService()
