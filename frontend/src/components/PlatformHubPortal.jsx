import React, { useState } from 'react';
import { Scale, Building2, Megaphone, Headset, Code2, Sparkles, Layers, Cpu, ShieldCheck, ExternalLink, PlusCircle, ArrowRight } from 'lucide-react';
import AgentStudio from './AgentStudio';
import DomainExplorer from './DomainExplorer';

export default function PlatformHubPortal({ systemInfo, onAgentExecute }) {
  const [activeTab, setActiveTab] = useState('ecosystem'); // 'ecosystem' | 'explorer' | 'studio'

  const projects = [
    {
      id: 1,
      code: "LEGAL_AI",
      name: "Project 1 — Legal Assistant AI OS (Bilingual & Multi-Role)",
      subtitle: "Legal Workstation for Lawyers, Judges, Prosecutors & Corporate Counsel",
      icon: Scale,
      color: "#818cf8",
      gradient: "linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(129, 140, 248, 0.08))",
      status: "FLAGSHIP PRODUCTION",
      description: "Trợ lý AI Pháp lý chuyên sâu đa vai trò (Luật sư, Thẩm phán, Kiểm sát viên, Pháp chế Doanh nghiệp). Tự động tra cứu Án lệ TANDTC 2026, Ma trận chứng cứ 2 chiều & Interactive Legal Studio.",
      techStack: ["Bilingual VI/EN", "TANDTC Precedents 2026", "Dual Evidence Matrix", "Interactive Legal Studio"],
      appUrl: "http://localhost:5173",
      isPrimary: true
    },
    {
      id: 2,
      code: "DOC_INTEL",
      name: "Project 2 — Enterprise Document Intelligence RAG",
      subtitle: "Internal Knowledge Base Engine",
      icon: Building2,
      color: "#38bdf8",
      gradient: "linear-gradient(135deg, rgba(56, 189, 248, 0.15), rgba(14, 165, 233, 0.05))",
      status: "CORE MODULE",
      description: "Hệ thống hỏi đáp thông minh trên toàn bộ tài liệu nội bộ công ty (Hợp đồng, quy trình, sổ tay nhân sự) có trích dẫn trang nguồn và phân quyền Multi-Tenant.",
      techStack: ["Hybrid Search (Dense + Sparse)", "Qdrant", "Citation Guardrails", "Multi-Tenant ACL"],
      appUrl: "http://localhost:5173",
      isPrimary: false
    },
    {
      id: 3,
      code: "LOCAL_MARKETING",
      name: "Project 3 — AI Marketing & Social Commerce Studio",
      subtitle: "Omni-Channel Content Engine",
      icon: Megaphone,
      color: "#f43f5e",
      gradient: "linear-gradient(135deg, rgba(244, 63, 94, 0.15), rgba(225, 29, 72, 0.05))",
      status: "VERTICAL ENGINE",
      description: "Tự động tạo bài viết chuẩn insight đa kênh (FB/Zalo/TikTok), lên kịch bản video ngắn và quản lý giỏ hàng/lead khách hàng tiềm năng.",
      techStack: ["Prompt Template Engine", "Scheduled Tasks", "PostgreSQL Lead Tracking"],
      appUrl: "http://localhost:5173",
      isPrimary: false
    },
    {
      id: 4,
      code: "SUPPORT_BOOKING",
      name: "Project 4 — AI Customer Support & Booking Agent",
      subtitle: "24/7 Automated Booking & Human Handoff",
      icon: Headset,
      color: "#a855f7",
      gradient: "linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(147, 51, 234, 0.05))",
      status: "VERTICAL ENGINE",
      description: "Trực chat trả lời FAQ 24/7, tự động đặt giữ chỗ lịch hẹn và kết nối chuyển giao yêu cầu phức tạp cho nhân viên hỗ trợ.",
      techStack: ["Stateful Agent Memory", "Calendar Sync", "Escalation Handler"],
      appUrl: "http://localhost:5173",
      isPrimary: false
    },
    {
      id: 5,
      code: "ENG_KNOWLEDGE",
      name: "Project 5 — Engineering Architecture Assistant",
      subtitle: "Codebase & Requirement Reasoner",
      icon: Code2,
      color: "#6366f1",
      gradient: "linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(79, 70, 229, 0.05))",
      status: "DEVELOPER TOOL",
      description: "Phân tích tài liệu kỹ thuật, kiến trúc microservices, kiểm tra file OpenAPI spec và hỗ trợ onboarding lập trình viên mới.",
      techStack: ["Code Parsing Engine", "Architecture Auditor", "OpenAPI Spec Validator"],
      appUrl: "http://localhost:5173",
      isPrimary: false
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', padding: '0.5rem' }}>
      
      {/* Platform Banner */}
      <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(99, 102, 241, 0.15))', borderColor: 'rgba(168, 85, 247, 0.4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <span className="badge badge-purple" style={{ fontSize: '0.75rem' }}>🌐 ENTERPRISE ECOSYSTEM HUB</span>
              <span className="badge badge-cyan" style={{ fontSize: '0.75rem' }}>Core Engine: Aegis Agentic v2.0</span>
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
              OmniAgent Platform Ecosystem
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.4rem' }}>
              Cổng quản trị nền tảng AI Core dùng chung. Kết nối và vận hành 5 sản phẩm chuyên biệt trong hệ sinh thái công ty.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              className={activeTab === 'ecosystem' ? 'btn-primary' : 'btn-secondary'}
              onClick={() => setActiveTab('ecosystem')}
              style={{ fontSize: '0.85rem' }}
            >
              <Layers size={16} /> 5 Dự Án Sản Phẩm
            </button>
            <button 
              className={activeTab === 'studio' ? 'btn-primary' : 'btn-secondary'}
              onClick={() => setActiveTab('studio')}
              style={{ fontSize: '0.85rem' }}
            >
              <PlusCircle size={16} /> Agent Studio
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Areas */}
      {activeTab === 'ecosystem' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#ffffff' }}>
              📦 Hệ Sinh Thái 5 Sản Phẩm Vertical (Company Product Portfolio)
            </h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              1 Core Engine ➔ 5 Commercial Products
            </span>
          </div>

          {/* Grid of Projects */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
            {projects.map((p) => {
              const Icon = p.icon;
              return (
                <div 
                  key={p.id}
                  className="glass-card"
                  style={{ 
                    background: p.gradient, 
                    borderColor: p.isPrimary ? 'var(--primary-indigo)' : 'var(--border-glass)',
                    boxShadow: p.isPrimary ? '0 8px 24px rgba(99, 102, 241, 0.2)' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    justify: 'space-between',
                    gap: '1rem'
                  }}
                >
                  <div>
                    {/* Card Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '0.65rem', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
                        <Icon size={24} color={p.color} />
                      </div>
                      <span className={p.isPrimary ? "badge badge-primary" : "badge badge-info"} style={{ fontSize: '0.68rem' }}>
                        {p.status}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#ffffff', marginBottom: '0.2rem' }}>
                      {p.name}
                    </h4>
                    <span style={{ fontSize: '0.78rem', color: p.color, fontWeight: '600', display: 'block', marginBottom: '0.75rem' }}>
                      {p.subtitle}
                    </span>

                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '1rem' }}>
                      {p.description}
                    </p>

                    {/* Tech Badges */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
                      {p.techStack.map((t, idx) => (
                        <span key={idx} className="badge badge-purple" style={{ fontSize: '0.65rem' }}>
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Launch App Button */}
                  <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {p.isPrimary ? "Khởi chạy ứng dụng sản phẩm thật" : "Dự án trong lộ trình"}
                    </span>
                    <a 
                      href={p.appUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={p.isPrimary ? "btn-primary" : "btn-secondary"}
                      style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                    >
                      <span>Mở Ứng Dụng</span>
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'explorer' && (
        <DomainExplorer onAgentExecute={onAgentExecute} />
      )}

      {activeTab === 'studio' && (
        <AgentStudio onAgentExecute={onAgentExecute} />
      )}
    </div>
  );
}
