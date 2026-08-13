import React from 'react';
import { Cpu, Terminal, ShieldCheck } from 'lucide-react';

export default function Header({ systemInfo, toggleTraceDrawer, traceLogsCount, appMode, setAppMode, activeView }) {
  const titles = {
    hub_portal: 'Platform Admin Hub',
    legal: 'Legal Assistant AI OS',
    explorer: 'Domain AI Explorer',
    studio: 'Custom Agent Studio'
  };

  return (
    <header className="top-header">
      <div className="header-left-context">
        <span className="header-badge">HỆ THỐNG</span>
        <span className="header-current-page">{titles[activeView] || 'Platform Admin Hub'}</span>
      </div>

      <div className="header-right-actions">
        <div className="header-status-item">
          <ShieldCheck size={15} className="text-success" />
          <span>Guardrails: Active</span>
        </div>

        <div className="header-status-item">
          <Cpu size={15} className="text-primary" />
          <span>Bộ máy: <strong>{systemInfo?.engine || 'Aegis Core'}</strong></span>
        </div>

        <button 
          className="btn-secondary btn-sm" 
          onClick={toggleTraceDrawer}
          id="btn-open-trace-drawer"
        >
          <Terminal size={15} />
          <span>Nhật ký xử lý</span>
          {traceLogsCount > 0 && (
            <span className="trace-count-pill">
              {traceLogsCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}

