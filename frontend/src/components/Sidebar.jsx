import React from 'react';
import { LayoutGrid, Scale, Globe, PlusCircle, Sparkles, Cpu } from 'lucide-react';

export default function Sidebar({ activeView, setActiveView, appMode, setAppMode }) {
  const hubNav = [
    { 
      id: 'hub_portal', 
      name: 'Trang chủ Platform Hub', 
      sub: 'Hệ sinh thái 5 sản phẩm AI', 
      icon: LayoutGrid, 
    },
    { 
      id: 'legal', 
      name: 'Legal Assistant AI OS', 
      sub: 'Trợ lý Pháp lý đa vai trò', 
      icon: Scale,
      highlight: true
    },
    { 
      id: 'explorer', 
      name: 'Domain AI Explorer', 
      sub: 'Khám phá các mô hình AI', 
      icon: Globe, 
    },
    { 
      id: 'studio', 
      name: 'Custom Agent Studio', 
      sub: 'Tự khởi tạo Agent mới', 
      icon: PlusCircle, 
    }
  ];

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div className="brand-mark">
          <Sparkles size={20} />
        </div>
        <div>
          <h2 className="brand-title">OmniAgent Studio</h2>
          <p className="brand-subtitle">Platform AI Core Enterprise</p>
        </div>
      </div>

      <div className="sidebar-nav">
        <div className="nav-section-header">KHU VỰC QUẢN TRỊ</div>

        {hubNav.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveView(item.id)}
            >
              <Icon size={18} className="nav-icon" />
              <div className="nav-text">
                <div className="nav-title">{item.name}</div>
                <div className="nav-sub">{item.sub}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="sidebar-footer">
        <div className="sidebar-engine">
          <Cpu size={14} /> Aegis Core v2.0
        </div>
        <span className="sidebar-tech">FastAPI · Qdrant · PostgreSQL</span>
      </div>
    </aside>
  );
}

