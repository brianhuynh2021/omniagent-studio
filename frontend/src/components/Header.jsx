import React from 'react';
import { Cpu, ShieldCheck, Activity, Terminal, Layers } from 'lucide-react';

export default function Header({ systemInfo, toggleTraceDrawer, traceLogsCount }) {
  return (
    <header className="top-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(99, 102, 241, 0.15)', padding: '0.4rem 0.8rem', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
          <Layers size={18} color="#818cf8" />
          <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#f3f4f6' }}>AI Core Engine v1.0</span>
        </div>
        <span className="badge badge-success">
          <ShieldCheck size={14} /> Guardrails Active
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <Cpu size={16} color="#06b6d4" />
          <span>LLM Provider: <strong style={{ color: '#fff' }}>{systemInfo?.llm_provider || 'Gemini Core'}</strong></span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <Activity size={16} color="#10b981" />
          <span>Qdrant Vector DB: <strong style={{ color: '#34d399' }}>Connected</strong></span>
        </div>

        <button 
          className="glass-btn-secondary" 
          onClick={toggleTraceDrawer}
          style={{ position: 'relative', fontSize: '0.85rem' }}
          id="btn-open-trace-drawer"
        >
          <Terminal size={16} color="#a855f7" />
          Agent Traces
          {traceLogsCount > 0 && (
            <span style={{ 
              position: 'absolute', top: '-5px', right: '-5px', 
              background: '#ef4444', color: '#fff', 
              borderRadius: '50%', padding: '2px 6px', fontSize: '0.7rem', fontWeight: 800 
            }}>
              {traceLogsCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
