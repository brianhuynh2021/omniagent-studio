# 🛡️ 2026 Legal Compliance & Ethical AI Standard

> **Standard for Zero-Hallucination Legal Citation, Data Privacy (Decree 13/2023) and 2026 Vietnamese & International Statutory Verification**

---

## 1. Statutory Framework Alignment

The Legal Assistant AI OS is engineered to comply with active Vietnamese legislation as of 2026:

| Code / Law | Reference Code | Mandatory Verification Rule |
| :--- | :--- | :--- |
| **Penal Code 2015 (Amended 2017/2026)** | BLHS 2015 | Double-check elements of crime (Chủ thể, Khách thể, Mặt khách quan, Mặt chủ quan) before proposing charges under Articles 173, 174, 175. |
| **Criminal Procedure Code 2015** | BLTTHS 2015 | Ensure procedural timelines, arrest warrants, and evidence chain-of-custody rules comply with legal rights of suspects. |
| **Civil Code 2015 & Land Law 2024** | BLDS 2015 / Luật Đất đai 2024 | Deposit agreement validity (Art 328 BLDS), land use certificate transfers (Art 203 Land Law 2024). |
| **Decree 13/2023/ND-CP** | Personal Data Protection | Mandatory PII masking (Citizen ID, phone numbers, exact addresses) before cloud embedding vectorization. |
| **CISG & International Trade** | UN CISG 1980 | Conformity of Goods (Art 35), Breach Notification (Art 39), Force Majeure (Art 79). |

---

## 2. Stanford 2026 Zero-Hallucination Protocol

To prevent hallucinated statutory articles or fake legal precedents, the system executes a 3-tier Grounding & Verification pipeline:

```
┌────────────────────────┐      ┌────────────────────────┐      ┌────────────────────────┐
│  1. RAG Vector Search  │ ───► │ 2. Statutory Matcher   │ ───► │ 3. Reflexion Audit     │
│  Extract Raw Articles  │      │ Verify Clause Existence│      │ Calculate Citation Score│
└────────────────────────┘      └────────────────────────┘      └────────────────────────┘
```

1. **Exact Article Binding**: No legal citation is presented without an verified source law title and explicit article number.
2. **Precedent Similarity Cutoff**: TANDTC Precedents require a cosine vector similarity score of \(\ge 0.72\) to be quoted as binding authority.
3. **Reflexion Citation Metric**: The Stanford 2026 Engine computes a `citation_grounding_score` (\(0.0 - 1.0\)). Any response scoring below \(0.85\) is flagged with a warning badge in the UI.

---

## 3. Security & Multi-Tenant Guardrails

- **Local Processing Priority**: Highly classified case dossiers are constrained to local sentence transformer embeddings and local Tesseract OCR.
- **Audit Logging**: Every prompt, intermediate ReAct reasoning trace, and generated output is immutably logged into `case_bank.db` with cryptographic hash verification.
