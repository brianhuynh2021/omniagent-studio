import React from 'react';
import { Cpu, ShieldCheck, Terminal, Scale, Globe, Layers } from 'lucide-react';

export default function Header({ systemInfo, toggleTraceDrawer, traceLogsCount, appMode, setAppMode }) {
  return (
    <header className="top-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Mode Switcher Buttons */}
        <div style={{ display: 'flex', background: 'rgba(15, 23, 42, 0.8)', padding: '0.25rem', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
          <button
            onClick={() => setAppMode('product')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.4rem 0.85rem',
              borderRadius: '7px',
              border: 'none',
              background: appMode === 'product' ? 'linear-gradient(135deg, #6366f1, #818cf8)' : 'transparent',
              color: appMode === 'product' ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: appMode === 'product' ? 700 : 500,
              fontSize: '0.82rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <Scale size={16} /> ⚖️ Dự Án 1: Trợ Lý Kiểm Sát Viên
          </button>

          <button
            onClick={() => setAppMode('hub')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.4rem 0.85rem',
              borderRadius: '7px',
              border: 'none',
              background: appMode === 'hub' ? 'linear-gradient(135deg, #a855f7, #c084fc)' : 'transparent',
              color: appMode === 'hub' ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: appMode === 'hub' ? 700 : 500,
              fontSize: '0.82rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <Globe size={16} /> 🌐 Platform Admin Hub
          </button>
        </div>

        <span className="badge badge-emerald">
          <ShieldCheck size={14} /> Groundedness Guardrails Active
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          <Cpu size={15} color="#06b6d4" />
          <span>AI Engine: <strong style={{ color: '#fff' }}>{systemInfo?.engine || 'Aegis Core'}</strong></span>
        </div>

        <button 
          className="btn-secondary" 
          onClick={toggleTraceDrawer}
          style={{ position: 'relative', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          id="btn-open-trace-drawer"
        >
          <Terminal size={16} color="#a855f7" />
          Agent Execution Trace
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
      </div>
    </header>
  );
}
