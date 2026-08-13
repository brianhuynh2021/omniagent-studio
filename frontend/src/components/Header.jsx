import React from 'react';
import { Cpu, Terminal } from 'lucide-react';

export default function Header({ systemInfo, toggleTraceDrawer, traceLogsCount, appMode, setAppMode }) {
  return (
    <header className="top-header">
      <div className="header-left-context">
        <span className="header-current-page">Platform Admin Hub</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {appMode === 'hub' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            <Cpu size={15} color="var(--primary-sapphire)" />
            <span>Bộ máy: <strong>{systemInfo?.engine || 'Aegis Core'}</strong></span>
          </div>
        )}

        {appMode === 'hub' && (
          <button 
            className="btn-secondary" 
            onClick={toggleTraceDrawer}
            style={{ position: 'relative', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            id="btn-open-trace-drawer"
          >
            <Terminal size={16} color="var(--primary-sapphire)" />
            Nhật ký xử lý
            {traceLogsCount > 0 && (
              <span style={{ 
                position: 'absolute', top: '-6px', right: '-6px', 
                background: 'var(--primary-rose)', color: '#fff', 
                borderRadius: '50%', padding: '2px 7px', fontSize: '0.7rem', fontWeight: 800 
              }}>
                {traceLogsCount}
              </span>
            )}
          </button>
        )}
      </div>
    </header>
  );
}
