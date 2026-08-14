# ⚖️ Legal Assistant AI OS (Song ngữ VI / EN)

> **Enterprise-Grade Microkernel Legal Agent OS for Prosecutors, Defense Attorneys & In-House Legal Counsels**

`legal-assistant` is the flagship vertical AI plugin for OmniAgent Studio. Designed under modern legal tech guidelines and 2026 Vietnamese & International legal frameworks, it operates as an autonomous ReAct microkernel service for dossier processing, evidence matrix extraction, legal citation verification, and interrogation strategy drafting.

---

## 🏛️ Key Capabilities

1. **Multi-Persona Legal Reasoning**:
   - 🛡️ **Prosecutor Workstation (Viện Kiểm Sát)**: Automated prosecution reports, crime classification (BLHS 2015/2026), aggravating/mitigating factors matrix, interrogation outlines.
   - ⚖️ **Defense Attorney Workstation (Luật Sư Bào Chữa)**: Alibi verification, procedural weakness discovery, defense arguments, precedent matching.
   - 🏢 **In-House Counsel Workstation (Tư Vấn Doanh Nghiệp)**: Cross-border contract risk scoring (CISG/GDPR/Commercial Law 2005), liability cap auditing, regulatory compliance.

2. **Dossier & Evidence Extraction Engine**:
   - Extraction of physical evidence, testimonies, timeline of facts, and financial figures into structured evidence matrices.

3. **Precedent Bank 2026 Integration**:
   - Built-in alignment with TANDTC Precedents (e.g. Án lệ 79/2025/AL, Án lệ 90/2026/AL) with similarity confidence scoring.

4. **Stanford 2026 Self-Improving Agent Framework**:
   - Real-time trajectory reflexion, citation grounding meters, episodic attorney feedback store, and dynamic prompt self-correction.

5. **MIT 2026 Enterprise Execution Framework**:
   - 13-Step Business Workflow (Goal ➔ Workflow Definition ➔ Role Binding ➔ Data Context ➔ Real System Integration ➔ Human Approval Gateway ➔ Business Value ROI Measurement ➔ System Improvement).

---

## 📁 Product Architecture Directory

```
backend/app/domains/legal_assistant/
├── docs/                      # Technical & Legal Documentation
│   ├── README.md              # Product Overview & Capability Architecture
│   ├── LEGAL_COMPLIANCE_2026.md # Legal AI Ethics, PII & Citation Verification Standards
│   ├── MIT_ENTERPRISE_FRAMEWORK_2026.md # MIT 2026 Enterprise Agent Execution Standard
│   └── API_SPECIFICATION.md   # Complete RESTful API & Manifest Reference
├── roadmap/                   # Strategic Product & Technical Roadmap
│   └── ROADMAP_2026.md        # Q1-Q4 2026 Product Milestones & Agentic Levels
├── design_prototype/          # Design System & UI/UX Specifications
│   └── PROTOTYPE_SPEC.md      # Glassmorphism Wireframes & Component Specs
├── mit_enterprise_2026.py     # MIT 2026 Enterprise Workflow & Business ROI Engine
├── stanford_agent_2026.py     # Stanford 2026 Self-Improving Reflection Engine
├── service.py                 # Core Legal Processing Logic
├── case_bank.py               # SQLite Dossier Persistence
├── precedents_2026.py         # Supreme Court Precedent Repository
└── manifest.py                # Microkernel Vertical Plugin Registration
```


---

## 🚀 Quick API Example

```python
from app.domains.legal_assistant.service import LegalAssistantService

service = LegalAssistantService()
response = service.process_case_dossier(
    title="Vụ án Trộm cắp tài sản",
    content="...",
    lang="vi",
    persona="prosecutor"
)

print(response.content)
print(response.metadata["stanford_reflection"])
```
