---
title: OmniAgent Studio
emoji: ⚡
colorFrom: indigo
colorTo: blue
sdk: docker
app_port: 7860
pinned: false
---

# ⚡ OmniAgent Studio (Aegis Agentic Core Platform)

> **Enterprise-Grade Microkernel Agent Operating System & Multi-Tenant Core AI Engine**

OmniAgent Studio is an enterprise AI platform core designed following **MIT-grade Microkernel Agent OS Architecture**. It decouples the core AI engine (routing, ReAct reasoning, memory, tool orchestration, security guardrails, and token metering) from specialized business projects.

---

## 🏛️ System Architecture

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                               USER SPACE (SPECIALIZED PROJECTS ECOSYSTEM)                        │
│   Project 1 (Team A)   │   Project 2 (Team B)   │   Project 3 (Team C)   │   1000+ Future Apps   │
└────────────────────────────────────────────────┬─────────────────────────────────────────────────┘
                                                 │ Declarative Manifests / MCP Standard / SDK
                                                 ▼
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                               KERNEL SPACE (AEGIS CORE AI ENGINE)                                │
│                                                                                                  │
│  ┌─────────────────────────────┐  ┌─────────────────────────────┐  ┌──────────────────────────┐  │
│  │ 1. LLM Context Gateway      │  │ 2. Dual Memory Subsystem    │  │ 3. Multi-Agent Scheduler │  │
│  │    & Model Providers        │  │    (Episodic + GraphRAG)    │  │    & Event Bus           │  │
│  ├─────────────────────────────┼─────────────────────────────┼──────────────────────────┤  │
│  │ 4. Universal Tool Driver    │  │ 5. Multi-Tenant Guardrails  │  │ 6. Observability &       │  │
│  │    (MCP Standard)           │  │    & Security Sandbox      │  │    Token Billing Metering│  │
│  └─────────────────────────────┘  └─────────────────────────────┘  └──────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🌟 Core Engine Capabilities

1. **Microkernel Architecture**: Strict separation between Core Kernel and business project applications.
2. **Supervisor Intent Router**: Automatically classifies query intent and dispatches tasks to specialized sub-agents or tools.
3. **ReAct Reasoning Engine**: Autonomous step-by-step reasoning (Thought -> Action -> Observation -> Final Output).
4. **Universal Tool & MCP Drivers**: Built-in support for Qdrant Hybrid RAG, Web Search, Python Sandbox Execution, and SQL Engines.
5. **Declarative Manifest Protocol**: Zero-code onboarding for new projects via JSON/YAML manifests (`plugin_protocol.py`).
6. **Multi-Tenant Security & Guardrails**: Data isolation, PII sanitization, hallucination checks, and token consumption metering.

---

## 🌐 Vertical Projects Ecosystem & Roadmap

For a comprehensive breakdown of all active sub-projects, ready-to-deploy verticals (HR & Talent, Procurement & Invoice Matching, E-Commerce, Real Estate, Compliance), and technical reusability matrix, see:
👉 **[PROJECTS_ECOSYSTEM.md](PROJECTS_ECOSYSTEM.md)**

---

## 🚀 Quickstart Guide

### 1. Run Backend Server
```bash
cd backend
source .venv/bin/activate
PYTHONPATH=. python app/main.py
```
*API Gateway running at:* `http://localhost:8000` (or `http://localhost:8001`)

### 2. Run Frontend Workspace
```bash
cd frontend
npm install
npm run dev
```

### Vector DB & OCR readiness

The repository now contains the real ingestion/search path, but it does not
include a Vietnamese legal corpus. Use `POST /api/v1/rag/ingest` to load a
licensed/source-controlled dataset and `POST /api/v1/rag/search` to query it.
The payload schema stores `doc_id`, title, text, page, category, and optional
metadata in Qdrant. `docker compose up` starts Qdrant with a persistent local
volume; if it is unavailable, the backend uses the local in-memory fallback and
reports that state from `GET /api/v1/rag/status`.

Embedding modes are explicit:

- `hash`: deterministic, dependency-free test/demo fallback; it is not a
  semantic model.
- `local_sentence_transformers`: local-only semantic embeddings after the
  configured model has been downloaded and cached once.
- `openai`: external API embedding, guarded by dossier classification and not
  suitable for secret material.

Image OCR tries local Tesseract first. Google Vision and AWS Textract adapters
are implemented and mock-tested, but a real cloud call is not verified in this
environment because no credentials are present. They are only added to the
fallback chain when the request explicitly sends `allow_external_ocr=true`;
classified dossiers remain local-only.
*Web Application running at:* `http://localhost:5173`

---

## 🛠️ Tech Stack
- **Backend**: Python 3.11+, FastAPI, Pydantic v2, Qdrant Vector DB, PostgreSQL
- **AI Engine**: Aegis Agentic Core (Multi-Agent ReAct Engine, Supervisor Router, Model Context Protocol)
- **Frontend**: React 18, Vite, Vanilla CSS Glassmorphism Design System, Lucide Icons
