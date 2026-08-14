import React, { useState } from 'react';
import { Scale, FileText, Megaphone, Headset, Code2, Sparkles, Layers, Activity, ChevronDown, Home, UserCheck, LogOut, LogIn, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const WORKSPACES = [
  { id: 'hub', label: 'Trang Chủ Hub Portal', icon: Home, desc: 'Cổng tổng hợp xem tất cả dự án' },
  { id: 'legal', label: 'Trợ Lý Pháp Lý (Legal AI)', icon: Scale, desc: 'Bilingual VI/EN & Multi-Role Workstation' },
  { id: 'doc_intel', label: 'Enterprise Doc RAG', icon: FileText, desc: 'Hỏi đáp tài liệu nội bộ công ty' },
  { id: 'marketing', label: 'AI Marketing & Commerce', icon: Megaphone, desc: 'Tự động tạo nội dung đa kênh' },
  { id: 'support', label: 'AI Support & Booking', icon: Headset, desc: 'Trực chat 24/7 & Đặt giữ chỗ' },
  { id: 'engineering', label: 'Dev Architecture', icon: Code2, desc: 'Phân tích mã nguồn & OpenAPI' },
  { id: 'studio', label: 'Agent Studio', icon: Sparkles, desc: 'Tùy chỉnh & Khởi tạo AI Agent' }
];

export default function AppHeader({ 
  activeView, 
  setActiveView, 
  lang, 
  setLang, 
  traceLogsCount, 
  toggleTraceDrawer 
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const currentWS = WORKSPACES.find(w => w.id === activeView) || WORKSPACES[0];
  const CurrentIcon = currentWS.icon;

  return (
    <header className="app-header">
      <div className="app-header__left">
        {/* Brand logo / title — Clicking returns to Hub */}
        <div 
          className="app-header__logo-group" 
          onClick={() => setActiveView('hub')} 
          title="Quay về Trang chủ Hub Portal"
        >
          <div className="app-header__logo">
            <Scale size={18} />
          </div>
          <span className="app-header__brand">OmniAgent</span>
        </div>

        {/* Quick Back to Hub Button (visible when inside any project view) */}
        {activeView !== 'hub' && (
          <button 
            className="app-header__back-hub-btn"
            onClick={() => setActiveView('hub')}
            title="Quay về Trang chủ Hub Portal"
          >
            <Home size={14} />
            <span>Về Hub</span>
          </button>
        )}

        <span className="app-header__slash">/</span>

        {/* Clean Breadcrumb Workspace Switcher */}
        <div className="app-header__switcher">
          <button 
            className="app-header__switcher-btn"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-expanded={dropdownOpen}
          >
            <CurrentIcon size={15} className="app-header__switcher-icon" />
            <span className="app-header__switcher-label">{currentWS.label}</span>
            <ChevronDown size={14} className={`app-header__chevron ${dropdownOpen ? 'is-open' : ''}`} />
          </button>

          {dropdownOpen && (
            <div className="app-header__menu" onClick={() => setDropdownOpen(false)}>
              <div className="app-header__menu-title">Chuyển Đổi Workspace</div>
              {WORKSPACES.map((w) => {
                const ItemIcon = w.icon;
                const isActive = w.id === activeView;
                return (
                  <button
                    key={w.id}
                    className={`app-header__menu-item ${isActive ? 'is-active' : ''}`}
                    onClick={() => setActiveView(w.id)}
                  >
                    <div className="app-header__item-icon">
                      <ItemIcon size={16} />
                    </div>
                    <div className="app-header__item-text">
                      <div className="app-header__item-name">{w.label}</div>
                      <div className="app-header__item-desc">{w.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="app-header__right">
        {/* Global Language Toggle */}
        {setLang && (
          <div className="app-header__lang">
            <button
              className={`app-header__lang-btn ${lang === 'vi' ? 'is-active' : ''}`}
              onClick={() => setLang('vi')}
            >VI</button>
            <button
              className={`app-header__lang-btn ${lang === 'en' ? 'is-active' : ''}`}
              onClick={() => setLang('en')}
            >EN</button>
          </div>
        )}

        <div className="app-header__status">
          <span className="app-header__dot"></span>
          <span className="app-header__status-text">Aegis 2026</span>
        </div>

        {traceLogsCount > 0 && (
          <button className="app-header__trace-btn" onClick={toggleTraceDrawer}>
            <Activity size={14} />
            <span>Trace Logs</span>
            <span className="app-header__trace-badge">{traceLogsCount}</span>
          </button>
        )}

        {/* User Auth Section */}
        {useAuthContext()}
      </div>
    </header>
  );
}

function useAuthContext() {
  const { user, isAuthenticated, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  if (isAuthenticated && user) {
    const roleColors = {
      admin: '#ef4444',
      attorney: '#8b5cf6',
      analyst: '#06b6d4',
      user: '#3b82f6'
    };

    return (
      <div className="app-header__user-wrapper">
        <button 
          className="app-header__user-btn"
          onClick={() => setUserMenuOpen(!userMenuOpen)}
        >
          <div className="app-header__user-avatar">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <span className="app-header__user-name">{user.username}</span>
          <span 
            className="app-header__role-badge"
            style={{ backgroundColor: `${roleColors[user.role] || '#3b82f6'}22`, color: roleColors[user.role] || '#3b82f6' }}
          >
            {user.role?.toUpperCase()}
          </span>
          <ChevronDown size={12} />
        </button>

        {userMenuOpen && (
          <div className="app-header__user-dropdown" onClick={() => setUserMenuOpen(false)}>
            <div className="app-header__dropdown-header">
              <div className="app-header__dropdown-name">{user.username}</div>
              <div className="app-header__dropdown-email">{user.email}</div>
            </div>
            <button className="app-header__dropdown-item is-logout" onClick={logout}>
              <LogOut size={14} />
              <span>Đăng Xuất</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <button 
      className="app-header__login-btn"
      onClick={() => window.dispatchEvent(new CustomEvent('open-auth-modal'))}
    >
      <LogIn size={14} />
      <span>Đăng Nhập</span>
    </button>
  );
}
