import React from 'react';
import { Scale, Cpu, Globe, PlusCircle } from 'lucide-react';

export default function Sidebar({ activeView, setActiveView, appMode, setAppMode }) {
  const hubNav = [
    { 
      id: 'explorer', 
      name: 'Domain Ecosystem', 
      sub: 'Khám phá tất cả các Domain AI', 
      icon: Globe, 
      color: 'var(--primary-sapphire)'
    },
    { 
      id: 'studio', 
      name: 'Custom Agent Studio', 
      sub: 'Tự thiết kế Agent tùy chỉnh', 
      icon: PlusCircle, 
      color: 'var(--primary-sapphire)',
      highlight: true 
    },
    { 
      id: 'legal', 
      name: 'Legal Assistant AI OS', 
      sub: 'Song ngữ VI/EN & Multi-Role', 
      icon: Scale, 
      color: 'var(--primary-sapphire)'
    }
  ];

  const currentNav = hubNav;

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-glass)' }}>
        <div className="brand-mark" style={{ padding: '0.65rem', borderRadius: '8px', display: 'flex' }}>
          {appMode === 'product' ? <Scale size={22} /> : <Globe size={22} />}
        </div>
        <div>
          <h2 className="brand-title">
            {appMode === 'product' ? 'Trợ lý pháp lý' : 'OmniAgent'}
          </h2>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            {appMode === 'product' ? 'Không gian làm việc' : 'Quản trị nền tảng'}
          </p>
        </div>
      </div>

      <div style={{ marginTop: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem', overflowY: 'auto' }}>
        {/* Navigation Section */}
        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0.5rem 0.5rem 0.25rem' }}>
          {appMode === 'product' ? 'DANH MỤC' : 'KHU VỰC QUẢN TRỊ'}
        </div>

        {currentNav.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveView(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                padding: '0.75rem 0.85rem',
                borderRadius: '8px',
                border: isActive ? '1px solid #c3d5e7' : item.highlight ? '1px dashed #cbd9e4' : '1px solid transparent',
                background: isActive ? '#eef4fa' : item.highlight ? '#f8fafc' : 'transparent',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease'
              }}
            >
              <Icon size={19} color={isActive ? item.color : 'var(--text-muted)'} />
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ fontWeight: isActive ? 700 : 600, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
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

      {/* Footer Info */}
      {appMode === 'hub' && (
        <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-glass)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <div className="sidebar-engine">
            <Cpu size={14} /> Aegis Microkernel Engine v2.0
          </div>
          <span>FastAPI + Qdrant + PostgreSQL</span>
        </div>
      )}
    </aside>
  );
}
