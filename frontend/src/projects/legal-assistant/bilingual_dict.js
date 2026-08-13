export const legalTranslations = {
  vi: {
    brand: "Trợ lý pháp lý",

    // Screen 1 — intake
    intakeTitle: "Phân tích hồ sơ pháp lý",
    intakeSub: "Nạp hồ sơ, chọn góc nhìn nghiệp vụ, nhận kết quả đối chiếu căn cứ.",
    dropTitle: "Kéo thả hồ sơ vào đây",
    dropHint: "hoặc bấm để chọn tệp",
    dropFormats: "PDF · DOCX · TXT · Ảnh",
    orPaste: "hoặc",
    pasteToggle: "Dán nội dung trực tiếp",
    pastePlaceholder: "Dán nội dung hồ sơ, biên bản, hợp đồng...",
    loadedMeta: "Đã nạp · sẵn sàng phân tích",
    extracting: "Đang trích xuất nội dung...",
    extractingHint: "Đọc PDF / Word / OCR ảnh",
    extractFailed: "Không kết nối được dịch vụ trích xuất.",
    engineRetrieval: "Tra cứu nội bộ",
    engineLabel: "Bộ máy",

    // Dossier reference code (mã bút lục)
    refLabel: "Mã bút lục",
    refHint: "Mã đề xuất — sửa cho khớp sổ thụ lý của cơ quan",
    refCopied: "Đã sao chép mã",

    // Search within the dossier
    searchPlaceholder: "Tìm trong hồ sơ...",
    searchNoResult: "Không tìm thấy",
    searchCount: "kết quả",

    // External LLM consent
    llmOffLabel: "Xử lý nội bộ",
    llmOnLabel: "Dùng AI ngoài",
    llmWarnTitle: "Dữ liệu sẽ rời khỏi máy này",
    llmWarnBody: "Toàn văn hồ sơ sẽ được gửi tới nhà cung cấp AI bên ngoài để xử lý. KHÔNG bật với hồ sơ mật nhà nước.",
    llmWarnConfirm: "Tôi hiểu, vẫn bật",
    llmWarnCancel: "Huỷ",
    llmNotConfigured: "Chưa cấu hình khoá AI",
    privacyLocal: "Không có dữ liệu nào rời khỏi máy này",
    clearFile: "Gỡ hồ sơ",
    roleLabel: "Vai trò",
    btnProcess: "Phân tích hồ sơ",
    btnProcessing: "Đang phân tích...",
    samplesLabel: "Chưa có hồ sơ? Thử mẫu:",

    // Loading
    loadingTitle: "Đang phân tích hồ sơ",
    loadingSub: "Đối chiếu căn cứ pháp lý và án lệ...",

    // Screen 2 — results
    backToIntake: "Hồ sơ khác",
    verifiedPrefix: "Đã đối chiếu",
    verifiedUnit: "căn cứ",
    secSummary: "Tóm tắt",
    secEvidence: "Chứng cứ",
    secCitations: "Căn cứ pháp lý",
    secQuestions: "Câu hỏi",
    partiesLabel: "Đương sự / Bị cáo",
    chargesLabel: "Căn cứ & tội danh áp dụng",
    colItem: "Hạng mục",
    colPros: "Buộc tội / Nguyên đơn",
    colDef: "Bào chữa / Bị đơn",
    noDefenseView: "Đang rà soát lập luận bào chữa",
    issuedByLabel: "Cơ quan ban hành:",
    defaultIssuer: "Tòa án nhân dân tối cao",
    targetPrefix: "Đối tượng",
    questionPrefix: "Câu",
    actDraft: "Soạn thảo văn bản",
    actExport: "Xuất Word",
    actCopy: "Sao chép",
    actCopied: "Đã sao chép",

    // Screen 3 — drafting
    draftTitle: "Soạn thảo văn bản pháp lý",
    backToResults: "Quay lại kết quả",
    insertHeading: "Chèn căn cứ",
    insertAction: "Chèn vào văn bản",
    insertedPrefix: "[BỔ SUNG LẬP LUẬN AI]",
    citationBasis: "Căn cứ",

    // Dialogue
    secDialogue: "Trao đổi",
    chatTitle: "Hỏi thêm về hồ sơ",
    chatPlaceholder: "Hỏi về tình tiết, điều luật, hướng lập luận...",
    chatSend: "Gửi",
    chatThinking: "Đang tra cứu...",
    chatEmpty: "Đặt câu hỏi về vụ án này. Câu trả lời chỉ dựa trên hồ sơ đã nạp và án lệ đối chiếu.",
    chatUngrounded: "Không tìm thấy căn cứ",
    chatSuggest1: "Có tình tiết giảm nhẹ nào áp dụng được?",
    chatSuggest2: "Điểm yếu trong lập luận buộc tội là gì?",
    chatSuggest3: "Án lệ nào liên quan trực tiếp?",

    // Attaching documents to an open dossier
    addDocTitle: "Bổ sung tài liệu",
    addDocHint: "Kéo thả hoặc bấm để thêm phụ lục, biên bản mới",
    addDocReanalyze: "Phân tích lại có tài liệu mới",
    addedDocs: "Tài liệu đã bổ sung",

    // Manual clauses
    addClauseTitle: "Thêm điều khoản / căn cứ",
    addClausePlaceholder: "VD: Điều 51 BLHS 2015 - Tình tiết giảm nhẹ",
    addClauseBtn: "Thêm",
    manualClauses: "Căn cứ bổ sung thủ công",
    removeClause: "Gỡ",

    // Case bank statistics
    statsTitle: "Thống kê từ hồ sơ tương tự",
    statsScopeLocality: "cùng địa bàn & loại vụ",
    statsScopeType: "cùng loại vụ",
    statsSample: "vụ tương tự",
    statsLocality: "Địa bàn",
    statsCaseType: "Loại vụ",
    statsNone: "Chưa đủ dữ liệu thống kê",
    statsNoneHint: "Cần ít nhất 3 hồ sơ tương tự. Kho hiện có",
    statsBankTotal: "hồ sơ đã xử lý",
    statsFromBank: "Tra từ kho, không gọi mô hình",

    personas: {
      all_in_one: { name: "Tổng hợp", desc: "Đánh giá toàn diện hai chiều buộc tội và bào chữa" },
      lawyer: { name: "Luật sư", desc: "Tập trung tình tiết giảm nhẹ, bảo vệ thân chủ" },
      judge: { name: "Thẩm phán", desc: "Tóm tắt khách quan, đối chiếu án lệ & dự thảo bản án" },
      prosecutor: { name: "Kiểm sát viên", desc: "Lập ma trận chứng cứ buộc tội & báo cáo truy tố" },
      corporate: { name: "Pháp chế", desc: "Rà soát rủi ro hợp đồng, compliance & hòa giải" }
    }
  },

  en: {
    brand: "Legal Assistant",

    // Screen 1 — intake
    intakeTitle: "Analyze a legal dossier",
    intakeSub: "Load a dossier, pick a professional lens, get source-checked analysis.",
    dropTitle: "Drop your dossier here",
    dropHint: "or click to browse files",
    dropFormats: "PDF · DOCX · TXT · Images",
    orPaste: "or",
    pasteToggle: "Paste content directly",
    pastePlaceholder: "Paste dossier content, records, contracts...",
    loadedMeta: "Loaded · ready to analyze",
    extracting: "Extracting content...",
    extractingHint: "Reading PDF / Word / image OCR",
    extractFailed: "Could not reach the extraction service.",
    engineRetrieval: "Local retrieval",
    engineLabel: "Engine",

    // Dossier reference code
    refLabel: "Reference no.",
    refHint: "Suggested code — edit to match your agency's register",
    refCopied: "Code copied",

    // Search within the dossier
    searchPlaceholder: "Search this dossier...",
    searchNoResult: "No matches",
    searchCount: "matches",

    // External LLM consent
    llmOffLabel: "Local only",
    llmOnLabel: "Use external AI",
    llmWarnTitle: "Data will leave this machine",
    llmWarnBody: "The full dossier will be sent to an external AI provider for processing. Do NOT enable for classified state dossiers.",
    llmWarnConfirm: "I understand, enable",
    llmWarnCancel: "Cancel",
    llmNotConfigured: "No AI key configured",
    privacyLocal: "No data leaves this machine",
    clearFile: "Remove dossier",
    roleLabel: "Role",
    btnProcess: "Analyze dossier",
    btnProcessing: "Analyzing...",
    samplesLabel: "No dossier yet? Try a sample:",

    // Loading
    loadingTitle: "Analyzing dossier",
    loadingSub: "Matching statutes and precedents...",

    // Screen 2 — results
    backToIntake: "New dossier",
    verifiedPrefix: "Matched",
    verifiedUnit: "references",
    secSummary: "Summary",
    secEvidence: "Evidence",
    secCitations: "Legal references",
    secQuestions: "Questions",
    partiesLabel: "Parties / Defendant",
    chargesLabel: "Applicable laws & claims",
    colItem: "Item",
    colPros: "Prosecution / Claimant",
    colDef: "Defense / Respondent",
    noDefenseView: "Defense argument under review",
    issuedByLabel: "Issued by:",
    defaultIssuer: "Supreme People's Court",
    targetPrefix: "Target",
    questionPrefix: "Q",
    actDraft: "Open drafting",
    actExport: "Export Word",
    actCopy: "Copy",
    actCopied: "Copied",

    // Screen 3 — drafting
    draftTitle: "Legal drafting",
    backToResults: "Back to results",
    insertHeading: "Insert references",
    insertAction: "Insert into draft",
    insertedPrefix: "[AI ARGUMENT INSERT]",
    citationBasis: "Pursuant to",

    // Dialogue
    secDialogue: "Discussion",
    chatTitle: "Ask about this dossier",
    chatPlaceholder: "Ask about facts, statutes, argument strategy...",
    chatSend: "Send",
    chatThinking: "Searching...",
    chatEmpty: "Ask a question about this case. Answers draw only on the loaded dossier and matched precedents.",
    chatUngrounded: "No supporting basis found",
    chatSuggest1: "Which mitigating factors apply here?",
    chatSuggest2: "What are the weaknesses in the prosecution case?",
    chatSuggest3: "Which precedents are directly relevant?",

    // Attaching documents to an open dossier
    addDocTitle: "Add documents",
    addDocHint: "Drop or click to add annexes, new records",
    addDocReanalyze: "Re-analyze with new documents",
    addedDocs: "Added documents",

    // Manual clauses
    addClauseTitle: "Add clause / reference",
    addClausePlaceholder: "e.g. Article 51 Penal Code 2015 - Mitigating factors",
    addClauseBtn: "Add",
    manualClauses: "Manually added references",
    removeClause: "Remove",

    // Case bank statistics
    statsTitle: "Statistics from similar dossiers",
    statsScopeLocality: "same locality & case type",
    statsScopeType: "same case type",
    statsSample: "similar cases",
    statsLocality: "Locality",
    statsCaseType: "Case type",
    statsNone: "Not enough data yet",
    statsNoneHint: "Needs at least 3 similar dossiers. Bank currently holds",
    statsBankTotal: "dossiers processed",
    statsFromBank: "From case bank, no model call",

    personas: {
      all_in_one: { name: "General review", desc: "Full dual-perspective assessment of both sides" },
      lawyer: { name: "Lawyer", desc: "Focus on mitigating grounds & defense strategy" },
      judge: { name: "Judge", desc: "Objective case summary & judgment drafting" },
      prosecutor: { name: "Prosecutor", desc: "Indictment evidence matrix & charge sheet" },
      corporate: { name: "Legal team", desc: "Contract risk audit & dispute settlement" }
    }
  }
};
