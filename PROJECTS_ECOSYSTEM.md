# 🌐 OmniAgent Studio — Danh Mục & Lộ Trình Hệ Sinh Thái Dự Án (Projects Ecosystem Catalog)

> **Enterprise Microkernel Agent Operating System & Multi-Vertical AI Ecosystem**  
> *Tài liệu đặc tả toàn bộ các dự án con (Vertical Agents) đã có, đang phát triển và các dự án tiềm năng sẵn sàng mở rộng trên nền tảng OmniAgent Studio.*

---

## 🏛️ Tổng Quan Kiến Trúc Nền Tảng (Platform Overview)

OmniAgent Studio hoạt động dựa trên mô hình **Microkernel Agent OS**, tách biệt hoàn toàn giữa **Kernel Lõi (Aegis Core AI Engine)** và **Không gian Ứng dụng nghiệp vụ (Vertical Projects Space)**.

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                               USER SPACE (HỆ SINH THÁI DỰ ÁN NGHIỆP VỤ)                                 │
│   Legal Assistant  │  HR & Talent   │  Procurement  │  E-Commerce  │  Doc Intel  │  1000+ Future Apps  │
└───────────────────────────────────────────────────┬────────────────────────────────────────────────────┘
                                                    │ Declarative Manifests / MCP Standard / SDK
                                                    ▼
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                               KERNEL SPACE (AEGIS CORE AI ENGINE)                                      │
│                                                                                                        │
│  ┌──────────────────────────────┐  ┌──────────────────────────────┐  ┌─────────────────────────────┐  │
│  │ 1. Supervisor Intent Router  │  │ 2. Dual Memory Subsystem     │  │ 3. Multi-Agent Scheduler    │  │
│  │    (Dynamic Task Dispatcher) │  │    (Episodic + GraphRAG)     │  │    & Event Bus / Flywheel   │  │
│  ├──────────────────────────────┼──────────────────────────────┼─────────────────────────────┤  │
│  │ 4. Universal Tool Driver     │  │ 5. Multi-Tenant Guardrails   │  │ 6. Observability, Metrics   │  │
│  │    (RAG, OCR, SQL, Sandbox)  │  │    & Data Privacy Sandbox    │  │    & Token Billing Metering │  │
│  └──────────────────────────────┘  └──────────────────────────────┘  └─────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 📑 Mục Lục

1. [Phần 1: Các Dự Án Con Đang Hoạt Động (Active Projects)](#phần-1-các-dự-án-con-đang-hoạt-động-active-projects)
2. [Phần 2: Các Dự Án Ưu Tiên Cao — Sẵn Sàng Triển Khai Ngay (High-Priority Deployable)](#phần-2-các-dự-án-ưu-tiên-cao--sẵn-sàng-triển-khai-ngay-high-priority-deployable)
3. [Phần 3: Các Dự Án Doanh Nghiệp Chiến Lược (Enterprise Strategic Roadmap)](#phần-3-các-dự-án-doanh-nghiệp-chiến-lược-enterprise-strategic-roadmap)
4. [Phần 4: Ma Trận Tái Sử Dụng Công Nghệ & Công Cụ (Reusability Matrix)](#phần-4-ma-trận-tái-sử-dụng-công-nghệ--công-cụ-reusability-matrix)
5. [Phần 5: Hướng Dẫn Khởi Tạo Dự Án Con Mới (Quick Extension Guide)](#phần-5-hướng-dẫn-khởi-tạo-dự-án-con-mới-quick-extension-guide)

---

## Phần 1: Các Dự Án Con Đang Hoạt Động (Active Projects)

### 1.1. ⚖️ Legal & Judicial AI Assistant (Trợ Lý Kiểm Sát Viên & Pháp Luật)
* **Trạng thái**: Production Ready / Chuyên sâu nhất.
* **Đối tượng**: Kiểm sát viên, Thẩm phán, Luật sư, Chuyên viên pháp chế doanh nghiệp.
* **Tính năng chính**:
  * **Intake & OCR Hồ sơ đa tầng**: Xử lý hồ sơ bản chụp/scan tài liệu vụ án (Tesseract, AWS Textract, Google Vision).
  * **Trích xuất & Kiểm tra Mâu thuẫn**: Phân tích lời khai, xác định mốc thời gian, kiểm tra thời hiệu truy cứu trách nhiệm hình sự.
  * **Đề cương hỏi cung / Xét hỏi**: Tự động sinh danh mục câu hỏi nghiệp vụ theo từng bị can/bị cáo/người làm chứng.
  * **Soạn thảo Báo cáo Đề xuất Án**: Xuất văn bản báo cáo theo chuẩn biểu mẫu ngành Kiểm sát.
  * **Tra cứu Án lệ & Văn bản Quy phạm (Precedents 2026)**: RAG tra cứu trực tiếp Bộ luật Hình sự, Dân sự và Án lệ TAND Tối cao.

### 1.2. 🏢 Enterprise Document Intelligence (Khai Thác & Hỏi Đáp Tri Thức Doanh Nghiệp)
* **Trạng thái**: Active.
* **Đối tượng**: Ban Giám đốc, Quản lý các phòng ban, Nhân viên toàn công ty.
* **Tính năng chính**:
  * Ingest tài liệu nội bộ (PDF, DOCX, TXT, Markdown).
  * Tìm kiếm ngữ nghĩa Hybrid RAG kết hợp Vector Search (Qdrant) & Full-text Search.
  * Phân quyền truy cập tài liệu theo cấp độ người dùng (Multi-Tenant RBAC).
  * Trích xuất thông tin hợp đồng, quy chế, chính sách công ty.

### 1.3. 🎯 Marketing Growth & Campaign Generator (AI Sáng Tạo & Lập Kế Hoạch Marketing)
* **Trạng thái**: Active.
* **Đối tượng**: Marketing Team, Brand Manager, Copywriter, Content Creator.
* **Tính năng chính**:
  * Lập kế hoạch chiến dịch Marketing đa kênh (Facebook Ads, Google, TikTok, Email, SEO) theo ngân sách và mục tiêu.
  * Sinh nội dung quảng cáo (Ad Copy), tiêu đề thu hút, kịch bản video ngắn (Shorts/Reels/TikTok).
  * Gợi ý phân bổ ngân sách và KPI ước tính cho từng kênh.

### 1.4. 📅 Smart Support & Booking Coordinator (AI CSKH & Đặt Lịch Tự Động 24/7)
* **Trạng thái**: Active.
* **Đối tượng**: Doanh nghiệp dịch vụ (Phòng khám, Spa, Tư vấn, Khách sạn, Bất động sản).
* **Tính năng chính**:
  * Tiếp nhận yêu cầu tư vấn và hỗ trợ khách hàng tự động 24/7.
  * Kiểm tra slot lịch trống, tự động xếp lịch hẹn, dời lịch hoặc hủy lịch.
  * Tự động gửi email/tin nhắn xác nhận và kích hoạt Webhook thông báo đội ngũ quản lý.

### 1.5. 💻 Engineering Knowledge & Software Architecture (Trợ Lý Kỹ Thuật & Kiến Trúc Phần Mềm)
* **Trạng thái**: Active.
* **Đối tượng**: Software Engineers, Tech Leads, DevOps, System Architects.
* **Tính năng chính**:
  * Đánh giá kiến trúc hệ thống (System Architecture Review), phát hiện nút thắt cổ chai (bottlenecks).
  * Rà soát mã nguồn (Code Review), phát hiện lỗi bảo mật và kiểm tra chuẩn coding standard.
  * Tra cứu tài liệu kỹ thuật nội bộ và sinh mã nguồn mẫu (Boilerplate Generation).

### 1.6. 🛠️ Agent Studio (No-Code/Low-Code Custom Agent Builder)
* **Trạng thái**: Active.
* **Đối tượng**: Toàn bộ người dùng muốn tạo Agent riêng mà không cần code.
* **Tính năng chính**:
  * Thiết lập System Prompt, vai trò và tính cách cho Agent.
  * Gắn quyền sử dụng các công cụ lõi: RAG, Web Search, Code Sandbox, SQL Engine.
  * Xuất bản và lưu trữ agent dưới dạng **Declarative Manifest** theo chuẩn MCP.

### 1.7. 🏥 Healthcare & Clinical AI (Demo Prototype)
* **Tính năng**: Phân loại triệu chứng lâm sàng (Triage), tóm tắt tiền sử bệnh án, gợi ý mã **ICD-10** và cảnh báo nguy cơ tương tác thuốc.

### 1.8. 📊 Finance & Risk Analytics (Demo Prototype)
* **Tính năng**: Phân tích báo cáo tài chính (P/E, ROE, Dòng tiền), phát hiện giao dịch bất thường và lập báo cáo thẩm định rủi ro.

---

## Phần 2: Các Dự Án Ưu Tiên Cao — Sẵn Sàng Triển Khai Ngay (High-Priority Deployable)

*Các dự án này có thể tái sử dụng ngay từ 70% - 90% hạ tầng mã nguồn và công cụ sẵn có trong repository.*

### 2.1. 👥 HR & Talent Acquisition Agent (AI Tuyển Dụng & Đánh Giá Nhân Sự)
* **Mục tiêu**: Tự động hóa khâu lọc CV, phỏng vấn sơ loại và onboarding nhân viên.
* **Công cụ tái sử dụng**: `OCR Pipeline`, `Vector RAG`, `Extraction Service`.
* **Tính năng chi tiết**:
  * **Bulk Resume Parser & Matching**: Tải lên hàng chục/hàng trăm CV cùng lúc, tự động trích xuất thông tin học vấn, kỹ năng, kinh nghiệm và chấm điểm độ phù hợp (% Match Score) so với JD.
  * **Personalized Interview Generator**: Phân tích các lỗ hổng/điểm nghi vấn trên CV để sinh bộ câu hỏi phỏng vấn kỹ thuật và xử lý tình huống chuyên sâu cho người phỏng vấn.
  * **Onboarding Assistant**: Bot hỏi đáp tự động giúp nhân viên mới làm quen với quy trình nội bộ, văn hóa, chính sách phúc lợi và công cụ làm việc.

### 2.2. 📦 Procurement & Invoice Auditor (AI Thu Mua, OCR Hóa Đơn & Đối Soát 3 Chiều)
* **Mục tiêu**: Tự động hóa kiểm soát chi phí, đối soát hóa đơn chứng từ mua hàng cho phòng Kế toán / Thu mua.
* **Công cụ tái sử dụng**: `OCR Pipeline`, `SQL Engine`, `Guardrails Service`.
* **Tính năng chi tiết**:
  * **OCR Hóa đơn VAT / Hóa đơn điện tử**: Tự động nhận diện mã số thuế, tên nhà cung cấp, bảng kê chi tiết mặt hàng, đơn giá, thuế GTGT.
  * **3-Way Matching (Đối soát 3 chiều)**: Tự động so khớp dữ liệu giữa **Đơn mua hàng (PO)** ↔ **Phiếu nhập kho (GRN)** ↔ **Hóa đơn nhà cung cấp (Invoice)**, cảnh báo sai lệch số lượng hoặc đơn giá vượt hạn mức.
  * **So sánh Báo giá Nhà Cung Cấp**: Đọc nhiều file báo giá (Excel/PDF) khác nhau, phân tích so sánh về giá thành, thời gian giao hàng, điều khoản bảo hành và thanh toán.

### 2.3. 🛍️ E-Commerce Multi-Channel Operations (AI Vận Hành Thương Mại Điện Tử)
* **Mục tiêu**: Tăng tốc bán hàng và tối ưu hóa vận hành trên Shopee, Lazada, TikTok Shop, Amazon.
* **Công cụ tái sử dụng**: `Web Search`, `ReAct Engine`, `Extraction Service`.
* **Tính năng chi tiết**:
  * **SEO Product Listing**: Tự động tạo tiêu đề, mô tả sản phẩm chuẩn SEO theo thuật toán từng sàn, sinh từ khóa tìm kiếm và cấu trúc bullet points hấp dẫn.
  * **Review & Sentiment Intelligence**: Thu thập và phân tích hàng ngàn đánh giá của khách hàng, phân loại vấn đề (chất lượng sản phẩm, đóng gói, giao vận, thái độ CSKH) để đưa ra hành động khắc phục.
  * **Kịch bản Livestream / Video Bán hàng**: Tự động sinh dàn ý kịch bản tương tác, các kịch bản xử lý từ chối và deal khuyến mãi cho KOC/Host bán hàng.

### 2.4. 🏠 Real Estate & Property Valuation (AI Thẩm Định Bất Động Sản & Pháp Lý)
* **Mục tiêu**: Hỗ trợ môi giới, nhà đầu tư và ngân hàng thẩm định bất động sản nhanh chóng.
* **Công cụ tái sử dụng**: `OCR Pipeline`, `Legal RAG Engine`, `Code Sandbox`.
* **Tính năng chi tiết**:
  * **OCR Sổ đỏ / Sổ hồng**: Trích xuất số thửa, số tờ bản đồ, diện tích sử dụng, mục đích sử dụng đất, sơ đồ thửa đất và các ghi chú hạn chế quyền.
  * **Rà soát Hợp đồng Đặt cọc / Mua bán**: Đối chiếu điều khoản phạt cọc, tiến độ thanh toán, thời hạn công chứng với quy định của Luật Kinh doanh Bất động sản và Luật Đất đai.
  * **Định giá & Phân tích Dòng tiền**: Tính toán tỷ suất sinh lời cho thuê (Cap Rate/Yield), ước tính dòng tiền vay ngân hàng theo lịch trả góp.

---

## Phần 3: Các Dự Án Doanh Nghiệp Chiến Lược (Enterprise Strategic Roadmap)

### 3.1. 🛡️ Data Privacy & Compliance Auditor (AI Kiểm Toán Tuân Thủ Nghị Định 13 & GDPR)
* **Đối tượng**: Ngân hàng, Fintech, Tập đoàn đa quốc gia, Doanh nghiệp xử lý dữ liệu người dùng.
* **Tính năng chính**:
  * Quét tự động chính sách bảo mật (Privacy Policy), điều khoản dịch vụ (ToS) để phát hiện các lỗ hổng không tuân thủ Nghị định 13/2023/NĐ-CP (Việt Nam) hoặc GDPR (Châu Âu).
  * Sinh Báo cáo Đánh giá Tác động Xử lý Dữ liệu Cá nhân (DPIA - Data Protection Impact Assessment).
  * Hỗ trợ quy trình tiếp nhận và xử lý yêu cầu quyền của chủ thể dữ liệu (Data Subject Rights).

### 3.2. 🎓 EdTech & Corporate Training Tutor (AI Đào Tạo Doanh Nghiệp & Khảo Thí)
* **Đối tượng**: Các trung tâm đào tạo, trường đại học, khối nhân sự L&D (Learning & Development).
* **Tính năng chính**:
  * **Auto-Quiz Generator**: Tự động sinh đề thi trắc nghiệm và tự luận kèm thang điểm đáp án từ giáo trình / tài liệu PDF.
  * **Chấm bài tự luận thông minh**: Chấm điểm câu trả lời của học viên, chỉ ra các điểm còn thiếu và gợi ý phương án cải thiện chi tiết.
  * **Gia sư 1-on-1 cá nhân hóa**: Đóng vai người hướng dẫn, giải đáp kiến thức và luyện thi theo tiến độ của từng học viên.

### 3.3. 🏭 Industrial & Predictive Maintenance Agent (AI Giám Sát & Bảo Trì Thiết Bị Nhà Máy)
* **Đối tượng**: Nhà máy sản xuất, đơn vị vận hành tòa nhà, khu công nghiệp.
* **Tính năng chính**:
  * Đọc dữ liệu cảm biến (nhiệt độ, độ rung, áp suất) và nhật ký vận hành để phát hiện sớm dấu hiệu hư hỏng.
  * Tra cứu sổ tay bảo trì (Maintenance Manual) để đề xuất quy trình sửa chữa và danh mục linh kiện thay thế cần thiết.

### 3.4. 🚚 Logistics Route & Dispatch Optimization (AI Điều Vận & Tối Ưu Lộ Trình Vận Tải)
* **Đối tượng**: Doanh nghiệp giao nhận, 3PL, đội xe vận chuyển hàng hóa.
* **Tính năng chính**:
  * Tối ưu hóa lộ trình giao hàng đa điểm dựa trên tải trọng xe, khung giờ cấm đường và vị trí khách hàng.
  * Giám sát trạng thái đơn hàng và tự động giải quyết các sự cố phát sinh trong quá trình giao nhận (thay đổi địa chỉ, không liên lạc được).

### 3.5. 🏨 Hospitality & Hotel Concierge (Trợ Lý Du Lịch, Đặt Phòng & Trải Nghiệm Khách Hàng)
* **Đối tượng**: Khách sạn, Resort, Công ty lữ hành du lịch.
* **Tính năng chính**:
  * Tư vấn lịch trình du lịch cá nhân hóa theo ngân sách và sở thích.
  * Tích hợp đặt phòng khách sạn, dịch vụ ăn uống, đưa đón sân bay và xử lý khiếu nại của khách hàng đa ngôn ngữ.

### 3.6. 🏦 Credit Underwriting & Risk Scoring (AI Thẩm Định Hồ Sơ Vay Vốn & Tín Dụng)
* **Đối tượng**: Ngân hàng thương mại, Công ty tài chính, Quỹ tín dụng.
* **Tính năng chính**:
  * OCR hồ sơ vay: CMND/CCCD, sổ hộ khẩu/xác nhận cư trú, sao kê bảng lương, hóa đơn điện nước.
  * Tính toán chỉ số DTI (Debt-to-Income), kiểm tra lịch sử tín dụng và đề xuất phê duyệt/từ chối sơ bộ.

---

## Phần 4: Ma Trận Tái Sử Dụng Công Nghệ & Công Cụ (Reusability Matrix)

| Dự Án Con / Vertical Agent | OCR Engine | Qdrant RAG | Web Search | SQL Engine | Code Sandbox | Multi-Agent | Độ Khả Thi Triển Khai |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Legal & Judicial AI** | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | **Đã hoàn thiện** |
| **Enterprise Doc Intel** | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ | **Đã hoàn thiện** |
| **Marketing Growth** | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ | **Đã hoàn thiện** |
| **Smart Booking & CSKH** | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ | **Đã hoàn thiện** |
| **Engineering Assistant** | ❌ | ✅ | ✅ | ❌ | ✅ | ✅ | **Đã hoàn thiện** |
| **HR & Talent Acquisition** | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ | 🟢 **Triển khai trong 2-3 ngày** |
| **Procurement & Invoices** | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ | 🟢 **Triển khai trong 2-3 ngày** |
| **E-Commerce Operations** | ❌ | ✅ | ✅ | ✅ | ❌ | ✅ | 🟢 **Triển khai trong 2-3 ngày** |
| **Real Estate Valuation** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 🟢 **Triển khai trong 3-5 ngày** |
| **Compliance & Privacy** | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ | 🟡 **Triển khai trong 1 tuần** |
| **EdTech & Training** | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ | 🟡 **Triển khai trong 1 tuần** |
| **Credit Underwriting** | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ | 🟡 **Triển khai trong 1-2 tuần** |

---

## Phần 5: Hướng Dẫn Khởi Tạo Dự Án Con Mới (Quick Extension Guide)

Để bổ sung một dự án con mới vào OmniAgent Studio mà không ảnh hưởng tới core kernel, bạn chỉ cần thực hiện 3 bước chuẩn hóa theo mô hình Plugin:

### Bước 1: Khai báo Manifest Backend (`backend/app/domains/<vertical_name>/manifest.py`)
```python
from app.domains.plugin_protocol import VerticalManifest, BaseVerticalPlugin, ToolDefinition

hr_manifest = VerticalManifest(
    vertical_id="hr_talent",
    name="HR & Talent Acquisition AI",
    icon="👥",
    description="Lọc CV thông minh, đối soát JD và sinh bộ câu hỏi phỏng vấn ứng viên.",
    tags=["Recruitment", "Resume Parsing", "HR Tech"],
    tools=[
        ToolDefinition(name="vector_rag_search", description="Tìm kiếm trong kho CV & JD"),
        ToolDefinition(name="ocr_engine", description="Đọc và trích xuất file CV dạng PDF/Image")
    ],
    system_prompt="Bạn là Chuyên gia Tuyển dụng và Đánh giá Nhân sự AI."
)

hr_plugin = BaseVerticalPlugin(manifest=hr_manifest)
```

### Bước 2: Đăng ký vào Registry (`backend/app/domains/registry.py`)
```python
from app.domains.hr_talent.manifest import hr_plugin

# Trong constructor UniversalCoreRegistry:
self.register_plugin(hr_plugin)
```

### Bước 3: Tạo Giao Diện Frontend (`frontend/src/projects/<vertical_name>/`)
* Tạo View component React kết nối với API `/api/v1/agents/execute` hoặc endpoint chuyên dụng.
* Thêm route/tab vào `AppHeader.jsx` và `App.jsx`.

---

*Tài liệu được cập nhật tự động và quản lý tập trung trong hệ thống OmniAgent Studio.*
