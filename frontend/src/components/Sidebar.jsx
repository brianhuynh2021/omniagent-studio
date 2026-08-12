import React from 'react';
import { Scale, BookOpen, ShieldCheck, Cpu, Globe, PlusCircle, Layers } from 'lucide-react';

export default function Sidebar({ activeView, setActiveView, appMode, setAppMode }) {
  const legalNav = [
    { 
      id: 'legal', 
      name: 'Trợ Lý Kiểm Sát Viên', 
      sub: 'Phân tích án & Lập đề cương', 
      icon: Scale, 
      color: '#818cf8'
    },
    { 
      id: 'rag_search', 
      name: 'Kho Tri Thức & Điều Luật', 
      sub: 'Tra cứu Qdrant RAG Engine', 
      icon: BookOpen, 
      color: '#38bdf8' 
    }
  ];

  const hubNav = [
    { 
      id: 'explorer', 
      name: 'Domain Ecosystem', 
      sub: 'Khám phá tất cả các Domain AI', 
      icon: Globe, 
      color: '#38bdf8' 
    },
    { 
      id: 'studio', 
      name: 'Custom Agent Studio', 
      sub: 'Tự thiết kế Agent tùy chỉnh', 
      icon: PlusCircle, 
      color: '#c084fc',
      highlight: true 
    },
    { 
      id: 'legal', 
      name: 'Trợ Lý Kiểm Sát (Project 1)', 
      sub: 'Main Production Product', 
      icon: Scale, 
      color: '#818cf8' 
    }
  ];

  const currentNav = appMode === 'product' ? legalNav : hubNav;

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-glass)' }}>
        <div style={{ background: appMode === 'product' ? 'linear-gradient(135deg, #6366f1, #818cf8)' : 'linear-gradient(135deg, #a855f7, #c084fc)', padding: '0.65rem', borderRadius: '12px', display: 'flex', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}>
          {appMode === 'product' ? <Scale size={24} color="#ffffff" /> : <Globe size={24} color="#ffffff" />}
        </div>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, background: 'linear-gradient(90deg, #ffffff, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.02em' }}>
            {appMode === 'product' ? 'Prosecutor AI' : 'OmniAgent Hub'}
          </h2>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            {appMode === 'product' ? 'Legal AI Workstation' : 'Aegis Core Platform Admin'}
          </p>
        </div>
      </div>

      <div style={{ marginTop: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem', overflowY: 'auto' }}>
        {/* Navigation Section */}
        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0.5rem 0.5rem 0.25rem' }}>
          {appMode === 'product' ? 'DỰ ÁN 1 - WORKSTATION' : 'ADMIN ECOSYSTEM HUB'}
        </div>

        {currentNav.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                padding: '0.75rem 0.85rem',
                borderRadius: '10px',
                border: isActive ? '1px solid var(--primary-indigo)' : item.highlight ? '1px dashed rgba(168,85,247,0.4)' : '1px solid transparent',
                background: isActive ? 'linear-gradient(90deg, rgba(99,102,241,0.25), rgba(129,140,248,0.12))' : item.highlight ? 'rgba(168,85,247,0.08)' : 'transparent',
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease'
              }}
            >
              <Icon size={19} color={isActive ? item.color : '#9ca3af'} />
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ fontWeight: isActive ? 700 : 600, fontSize: '0.88rem', color: isActive ? '#ffffff' : 'var(--text-primary)' }}>
                  {item.name}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {item.sub}
                </div>
              </div>
            </button>
          );
        })}

        {/* Feature Highlights */}
        {appMode === 'product' && (
          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary-indigo)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={16} /> Legal AI Features
            </div>
            <ul style={{ paddingLeft: '1rem', fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              <li>Tóm tắt hồ sơ án hình sự</li>
              <li>Trích xuất vật chứng & lời khai</li>
              <li>Lập đề cương hỏi tại phiên tòa</li>
              <li>Soạn dự thảo báo cáo án</li>
              <li>Citation trích dẫn Điều luật</li>
            </ul>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-glass)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem', color: 'var(--primary-cyan)' }}>
          <Cpu size={14} /> Aegis Microkernel Engine v2.0
        </div>
        <span>FastAPI + Qdrant + PostgreSQL</span>
      </div>
    </aside>
  );
}
