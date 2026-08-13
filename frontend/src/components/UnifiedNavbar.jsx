import React, { useState } from 'react';
import { Scale, FileText, Megaphone, Headset, Code2, Sparkles, Layers, Activity, ChevronDown } from 'lucide-react';

const PROJECTS = [
  { id: 'legal', label: 'Trợ Lý Pháp Lý (Legal AI)', icon: Scale, tag: 'FLAGSHIP' },
  { id: 'doc_intel', label: 'Enterprise Doc RAG', icon: FileText, tag: 'RAG' },
  { id: 'marketing', label: 'AI Marketing & Commerce', icon: Megaphone, tag: 'MARKETING' },
  { id: 'support', label: 'AI Support & Booking', icon: Headset, tag: 'SUPPORT' },
  { id: 'engineering', label: 'Dev Architecture', icon: Code2, tag: 'DEV' },
  { id: 'studio', label: 'Agent Studio', icon: Sparkles, tag: 'BUILDER' },
  { id: 'hub', label: 'Ecosystem Hub', icon: Layers, tag: 'HUB' }
];

export default function UnifiedNavbar({ activeView, setActiveView, systemInfo, traceLogsCount, toggleTraceDrawer }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const currentProject = PROJECTS.find(p => p.id === activeView) || PROJECTS[0];
  const IconComponent = currentProject.icon;

  return (
    <header className="unified-nav">
      <div className="unified-nav__left">
        <div className="unified-nav__brand" onClick={() => setActiveView('legal')} role="button" tabIndex={0}>
          <div className="unified-nav__logo">
            <Scale size={18} />
          </div>
          <span className="unified-nav__title">Legal AI Assistant</span>
          <span className="unified-nav__badge">2026 OS</span>
        </div>

        {/* Project Selector Dropdown */}
        <div className="unified-dropdown-container">
          <button 
            className="unified-dropdown-trigger" 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-expanded={dropdownOpen}
          >
            <IconComponent size={16} className="unified-dropdown__icon" />
            <span className="unified-dropdown__label">{currentProject.label}</span>
            <ChevronDown size={14} className={`unified-dropdown__chevron ${dropdownOpen ? 'is-open' : ''}`} />
          </button>

          {dropdownOpen && (
            <div className="unified-dropdown-menu">
              <div className="unified-dropdown-header">Chuyển Đổi Dự Án / Workspace</div>
              {PROJECTS.map((p) => {
                const ItemIcon = p.icon;
                const isActive = p.id === activeView;
                return (
                  <button
                    key={p.id}
                    className={`unified-dropdown-item ${isActive ? 'is-active' : ''}`}
                    onClick={() => {
                      setActiveView(p.id);
                      setDropdownOpen(false);
                    }}
                  >
                    <ItemIcon size={16} />
                    <span className="unified-dropdown-item__name">{p.label}</span>
                    <span className="unified-dropdown-item__tag">{p.tag}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="unified-nav__right">
        <div className="unified-nav__status">
          <span className="unified-nav__dot"></span>
          <span>Aegis Engine Active</span>
        </div>

        {traceLogsCount > 0 && (
          <button className="unified-nav__trace-btn" onClick={toggleTraceDrawer}>
            <Activity size={14} />
            <span>Trace Logs</span>
            <span className="unified-nav__trace-badge">{traceLogsCount}</span>
          </button>
        )}
      </div>
    </header>
  );
}
