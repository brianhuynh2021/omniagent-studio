import React, { useState } from 'react';
import { Scale, Building2, Megaphone, Headset, Code2, Sparkles, Layers, PlusCircle, ArrowRight, ShieldCheck, Cpu, Zap, Network, Wrench, FileCode, CheckCircle2, UserCheck, AlertTriangle, Eye } from 'lucide-react';
import AgentStudio from './AgentStudio';
import EnterpriseArchitectureMap from './EnterpriseArchitectureMap';
import EnterpriseGovernanceBar from './EnterpriseGovernanceBar';
import HumanInTheLoopModal from './HumanInTheLoopModal';

export default function PlatformHubPortal({ systemInfo, onAgentExecute, setActiveView }) {
  const [activeTab, setActiveTab] = useState('ecosystem');
  const [isHITLOpen, setIsHITLOpen] = useState(false);

  const projects = [
    {
      id: 1,
      code: "LEGAL_AI",
      viewId: "legal",
      name: "Legal Assistant AI OS",
      subtitle: "Bilingual VI/EN & Multi-Role Legal Workstation",
      icon: Scale,
      color: "#4f46e5",
      badgeBg: "#e0e7ff",
      badgeColor: "#4338ca",
      status: "FLAGSHIP PRODUCTION",
      description: "Trợ lý AI Pháp lý chuyên sâu dành cho Luật sư, Thẩm phán, Kiểm sát viên & Pháp chế Doanh nghiệp. Tra cứu Án lệ TANDTC 2026 & Ma trận chứng cứ 2 chiều.",
      techStack: ["Bilingual VI/EN", "TANDTC 2026", "Dual Evidence Matrix", "Legal Studio"],
      isPrimary: true
    },
    {
      id: 2,
      code: "DOC_INTEL",
      viewId: "doc_intel",
      name: "Enterprise Document RAG",
      subtitle: "Internal Knowledge Base Engine",
      icon: Building2,
      color: "#0284c7",
      badgeBg: "#e0f2fe",
      badgeColor: "#0369a1",
      status: "CORE MODULE",
      description: "Hệ thống hỏi đáp thông minh trên toàn bộ tài liệu nội bộ công ty (Hợp đồng, quy trình, sổ tay) có trích dẫn trang nguồn và phân quyền Multi-Tenant.",
      techStack: ["Hybrid Search", "Qdrant", "Citation Guardrails", "Multi-Tenant ACL"],
      isPrimary: false
    },
    {
      id: 3,
      code: "LOCAL_MARKETING",
      viewId: "marketing",
      name: "AI Marketing & Commerce",
      subtitle: "Omni-Channel Content Engine",
      icon: Megaphone,
      color: "#e11d48",
      badgeBg: "#ffe4e6",
      badgeColor: "#be123c",
      status: "VERTICAL ENGINE",
      description: "Tự động tạo bài viết chuẩn insight đa kênh (FB/Zalo/TikTok), lên kịch bản video ngắn và quản lý giỏ hàng/lead khách hàng tiềm năng.",
      techStack: ["Prompt Templates", "Scheduled Tasks", "Lead Tracking"],
      isPrimary: false
    },
    {
      id: 4,
      code: "SUPPORT_BOOKING",
      viewId: "support",
      name: "AI Support & Booking Agent",
      subtitle: "24/7 Automated Booking & Escalation",
      icon: Headset,
      color: "#9333ea",
      badgeBg: "#f3e8ff",
      badgeColor: "#7e22ce",
      status: "VERTICAL ENGINE",
      description: "Trực chat trả lời FAQ 24/7, tự động đặt giữ chỗ lịch hẹn và kết nối chuyển giao yêu cầu phức tạp cho nhân viên hỗ trợ.",
      techStack: ["Agent Memory", "Calendar Sync", "Escalation Handler"],
      isPrimary: false
    },
    {
      id: 5,
      code: "ENG_KNOWLEDGE",
      viewId: "engineering",
      name: "Engineering Architecture",
      subtitle: "Codebase & Requirement Reasoner",
      icon: Code2,
      color: "#2563eb",
      badgeBg: "#dbeafe",
      badgeColor: "#1d4ed8",
      status: "DEVELOPER TOOL",
      description: "Phân tích tài liệu kỹ thuật, kiến trúc microservices, kiểm tra file OpenAPI spec và hỗ trợ onboarding lập trình viên mới.",
      techStack: ["Code Parser", "Architecture Auditor", "OpenAPI Validator"],
      isPrimary: false
    }
  ];

  const mcpTools = [
    {
      name: "qdrant_vector_search",
      category: "RAG & Vector Retrieval",
      status: "ACTIVE",
      provider: "Qdrant Hybrid Core",
      desc: "Truy vấn tri thức ngữ nghĩa từ Qdrant Vector Store với Dense Embeddings + Sparse Keyword Matching.",
      schema: "{ query: string, doc_category?: string, top_k?: number }"
    },
    {
      name: "python_code_sandbox",
      category: "Execution Sandbox",
      status: "SECURE",
      provider: "Aegis Docker Sandbox",
      desc: "Thực thi đoạn mã Python tính toán số liệu, phân tích biểu đồ tài chính trong môi trường Isolated Sandbox.",
      schema: "{ code: string, timeout_sec?: number }"
    },
    {
      name: "database_sql_query",
      category: "Data Connectors",
      status: "ACTIVE",
      provider: "PostgreSQL Connector",
      desc: "Truy vấn dữ liệu cấu trúc SQL từ cơ sở dữ liệu doanh nghiệp có tích hợp PII Sanitization.",
      schema: "{ sql_query: string, read_only: boolean }"
    },
    {
      name: "legal_tandtc_search",
      category: "Legal Corpus",
      status: "ACTIVE",
      provider: "TANDTC Database",
      desc: "Tra cứu Án lệ TANDTC 2026, Văn bản Quy phạm Pháp luật và Tiền lệ pháp chính thức.",
      schema: "{ keyword: string, year?: number, legal_field?: string }"
    }
  ];

  const handleLaunch = (p) => {
    if (p.viewId && setActiveView) {
      setActiveView(p.viewId);
    }
  };

  return (
    <div className="hub-portal">
      {/* Top Governance Control Bar */}
      <EnterpriseGovernanceBar 
        onOpenHITL={() => setIsHITLOpen(true)} 
        systemInfo={systemInfo}
      />

      {/* Hero Banner Section */}
      <div className="hub-hero">
        <div className="hub-hero__content">
          <div className="hub-hero__badges">
            <span className="hub-badge hub-badge--primary">ENTERPRISE AGENT OS</span>
            <span className="hub-badge hub-badge--subtle">Aegis Microkernel Architecture v2.0</span>
          </div>

          <h1 className="hub-hero__title">
            OmniAgent Studio & Platform Ecosystem
          </h1>

          <p className="hub-hero__sub">
            Hạ Tầng Lõi AI Agentic Doanh Nghiệp Tập Trung — Vận Hành 5 Giải Pháp Thương Mại Chuyên Biệt Trên Chuẩn Kiến Trúc Microkernel Agent OS.
          </p>

          <div className="hub-hero__stats">
            <div className="hub-stat-item">
              <Cpu size={16} className="hub-stat-icon" />
              <span>Microkernel Architecture</span>
            </div>
            <div className="hub-stat-divider">•</div>
            <div className="hub-stat-item">
              <Zap size={16} className="hub-stat-icon" />
              <span>5 Commercial Apps</span>
            </div>
            <div className="hub-stat-divider">•</div>
            <div className="hub-stat-item">
              <ShieldCheck size={16} className="hub-stat-icon" />
              <span>HITL Governance & PII Guardrails</span>
            </div>
          </div>
        </div>

        {/* Dynamic Tab Navigation */}
        <div className="hub-hero__actions">
          <button 
            className={`hub-tab-btn ${activeTab === 'ecosystem' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('ecosystem')}
          >
            <Layers size={16} /> Ứng Dụng Doanh Nghiệp
          </button>
          <button 
            className={`hub-tab-btn ${activeTab === 'architecture' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('architecture')}
          >
            <Network size={16} /> Kiến Trúc Aegis Core
          </button>
          <button 
            className={`hub-tab-btn ${activeTab === 'mcp_tools' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('mcp_tools')}
          >
            <Wrench size={16} /> Công Cụ MCP & Sandbox
          </button>
          <button 
            className={`hub-tab-btn ${activeTab === 'studio' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('studio')}
          >
            <PlusCircle size={16} /> Agent Studio
          </button>
        </div>
      </div>

      {/* TAB 1: ECOSYSTEM PROJECTS GRID */}
      {activeTab === 'ecosystem' && (
        <div className="hub-grid-section">
          <div className="hub-grid-header">
            <div>
              <h2 className="hub-grid-title">Hệ Sinh Thái Giải Pháp Enterprise</h2>
              <p className="hub-grid-sub">Chọn một ứng dụng chuyên biệt để khởi chạy không gian làm việc</p>
            </div>
            <span className="hub-grid-tag">1 Core Engine ➔ Multi-Tenant Verticals</span>
          </div>

          <div className="hub-grid">
            {projects.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.id} className={`hub-card ${p.isPrimary ? 'hub-card--primary' : ''}`}>
                  <div className="hub-card__top">
                    <div className="hub-card__icon-box" style={{ background: `${p.color}15`, color: p.color }}>
                      <Icon size={24} />
                    </div>
                    <span className="hub-card__status" style={{ background: p.badgeBg, color: p.badgeColor }}>
                      {p.status}
                    </span>
                  </div>

                  <div className="hub-card__body">
                    <h3 className="hub-card__title">{p.name}</h3>
                    <div className="hub-card__subtitle">{p.subtitle}</div>
                    <p className="hub-card__desc">{p.description}</p>

                    <div className="hub-card__tags">
                      {p.techStack.map((t, idx) => (
                        <span key={idx} className="hub-card__tag">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="hub-card__footer">
                    <span className="hub-card__note">
                      {p.isPrimary ? "Sản phẩm Flagship đang vận hành" : "Module chuyên môn khả dụng"}
                    </span>
                    <button 
                      onClick={() => handleLaunch(p)}
                      className={`hub-card__launch-btn ${p.isPrimary ? 'is-primary' : ''}`}
                    >
                      <span>Mở Ứng Dụng</span>
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: SYSTEM ARCHITECTURE VISUALIZER */}
      {activeTab === 'architecture' && (
        <div className="hub-subview">
          <EnterpriseArchitectureMap systemInfo={systemInfo} />
        </div>
      )}

      {/* TAB 3: MCP TOOLS & SANDBOX CATALOG */}
      {activeTab === 'mcp_tools' && (
        <div className="hub-mcp-section">
          <div className="hub-grid-header">
            <div>
              <h2 className="hub-grid-title">Công Cụ MCP & Sandbox Thực Thi</h2>
              <p className="hub-grid-sub">Danh mục Model Context Protocol (MCP) Tools đã đăng ký với Aegis Core Kernel</p>
            </div>
            <span className="hub-grid-tag">Universal Driver Protocol</span>
          </div>

          <div className="mcp-grid">
            {mcpTools.map((t, idx) => (
              <div key={idx} className="mcp-card">
                <div className="mcp-card__header">
                  <span className="mcp-card__cat">{t.category}</span>
                  <span className="mcp-card__status"><CheckCircle2 size={13} /> {t.status}</span>
                </div>
                <h4 className="mcp-card__title">{t.name}</h4>
                <div className="mcp-card__provider">Provider: <strong>{t.provider}</strong></div>
                <p className="mcp-card__desc">{t.desc}</p>
                <div className="mcp-card__schema">
                  <span className="mcp-card__schema-label">Parameter Schema:</span>
                  <code>{t.schema}</code>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: AGENT STUDIO */}
      {activeTab === 'studio' && (
        <div className="hub-subview">
          <AgentStudio onAgentExecute={onAgentExecute} />
        </div>
      )}

      {/* Human-in-the-Loop Governance Modal */}
      <HumanInTheLoopModal 
        isOpen={isHITLOpen} 
        onClose={() => setIsHITLOpen(false)}
        onApprove={() => {
          alert("✓ Tác vụ đã được Enterprise Admin phê duyệt thành công!");
          setIsHITLOpen(false);
        }}
        onReject={() => {
          alert("✕ Tác vụ đã bị từ chối.");
          setIsHITLOpen(false);
        }}
      />
    </div>
  );
}
