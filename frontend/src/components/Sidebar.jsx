import React from 'react';
import { Scale, FileText, Megaphone, MessageSquare, Code, Sparkles, FolderGit2 } from 'lucide-react';

export default function Sidebar({ activeVertical, setActiveVertical }) {
  const menuItems = [
    { id: 1, name: 'Trợ Lý Kiểm Sát Viên', sub: 'Project 1 — Main Legal AI', icon: Scale, badge: 'Main Project', color: '#818cf8' },
    { id: 2, name: 'Document Intelligence', sub: 'Project 2 — Enterprise RAG', icon: FileText, badge: 'SaaS Core', color: '#38bdf8' },
    { id: 3, name: 'Local Marketing Agent', sub: 'Project 3 — Sales & Content', icon: Megaphone, badge: 'Small Biz', color: '#fbbf24' },
    { id: 4, name: 'Customer Support & Booking', sub: 'Project 4 — FAQ & Booking', icon: MessageSquare, badge: 'Automation', color: '#34d399' },
    { id: 5, name: 'Engineering Knowledge', sub: 'Project 5 — System & QA', icon: Code, badge: 'FAANG/Tech', color: '#c084fc' }
  ];

  return (
    <aside className="sidebar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-glass)' }}>
        <div style={{ background: 'linear-gradient(135deg, #6366f1, #06b6d4)', padding: '0.6rem', borderRadius: '10px', display: 'flex' }}>
          <Sparkles size={20} color="#ffffff" />
        </div>
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, background: 'linear-gradient(90deg, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            AI Platform
          </h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>90-Day System Design</p>
        </div>
      </div>

      <div style={{ marginTop: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 0.5rem 0.5rem' }}>
          Vertical Applications
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeVertical === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveVertical(item.id)}
              id={`nav-vertical-${item.id}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                padding: '0.85rem 0.9rem',
                borderRadius: '10px',
                border: isActive ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid transparent',
                background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease'
              }}
            >
              <Icon size={20} color={isActive ? item.color : '#9ca3af'} />
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ fontWeight: isActive ? 700 : 500, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.name}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {item.sub}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-glass)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
          <FolderGit2 size={14} /> FastAPI + Qdrant + Celery
        </div>
        <span>Architecture Roadmap 2026</span>
      </div>
    </aside>
  );
}
