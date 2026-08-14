# 📜 Legal Assistant API Specification

> **REST API & Microkernel Plugin Protocol Reference**

---

## Base Path: `/api/v1/domains/legal-assistant`

### 1. Dossier Ingestion & Processing
`POST /process`

Processes a case dossier (Vietnamese or English), extracts evidence matrices, performs precedent matching, and executes the Stanford 2026 13-step verification loop.

**Request Payload:**
```json
{
  "title": "Vụ án Trộm cắp tài sản & Lừa đảo chiếm đoạt tài sản",
  "content": "HỒ SƠ VỤ ÁN HÌNH SỰ: NGUYỄN VĂN A...",
  "lang": "vi",
  "persona": "prosecutor",
  "classification": "hình_sự"
}
```

**Response Payload:**
```json
{
  "status": "success",
  "persona": "prosecutor",
  "dossier_summary": "...",
  "evidence_matrix": [
    {
      "item": "Xe máy Honda SH",
      "type": "Vật chứng",
      "probative_value": "Cao",
      "note": "Thu giữ tại nhà bị cáo"
    }
  ],
  "applicable_articles": ["Điều 173 BLHS 2015", "Điều 174 BLHS 2015"],
  "matched_precedents": [
    {
      "id": "AL-79-2025",
      "title": "Án lệ số 79/2025/AL",
      "similarity_score": 0.89
    }
  ],
  "stanford_reflection": {
    "13_step_loop": {
      "task_understanding": "Prosecution report generation for criminal theft",
      "context_retrieved_count": 4,
      "verification_status": "CORRECT",
      "citation_score": 0.94,
      "reflection_cycles": 1,
      "experience_stored": true
    }
  }
}
```

---

### 2. Sample Cases & Benchmarks
`GET /cases?lang=vi`

Returns pre-seeded legal benchmark dossiers for testing.

---

### 3. Case Question & Answer
`POST /ask`

Queries a processed case dossier with specific legal questions (e.g. "Lập đề cương xét hỏi bị cáo").

---

### 4. Stanford 2026 Feedback & Agent Improvement
`POST /self-improve/feedback`

Submits human attorney feedback to update episodic memory and execute Step 12 & Step 13 (Store Experience & Improve Agent).

**Request Payload:**
```json
{
  "case_id": "case_01",
  "rating": 5,
  "attorney_correction": "Thêm tình tiết giảm nhẹ bồi thường cho bị hại theo Điểm b Khoản 1 Điều 51 BLHS 2015.",
  "flagged_issues": []
}
```

---

### 5. Product Specs, Roadmap & Documentation
- `GET /docs`: Returns Product README and Legal Compliance Standards.
- `GET /roadmap`: Returns 2026 Product Roadmap milestones.
- `GET /prototype-spec`: Returns Design System & UI Prototype specifications.
