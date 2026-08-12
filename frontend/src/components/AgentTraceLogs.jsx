import React from 'react';
import { X, CheckCircle, Clock, FileText, Zap, ShieldAlert } from 'lucide-react';

export default function AgentTraceLogs({ isOpen, onClose, lastResponse }) {
  if (!isOpen) return null;

  const traceLogs = lastResponse?.trace_logs || [];
  const citations = lastResponse?.citations || [];
  const hallucinationPassed = lastResponse?.hallucination_check_passed ?? true;
  const latency = lastResponse?.total_latency_ms || 0;

  return (
    <div className={`trace-drawer ${isOpen ? 'open' : ''}`}>
      <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(15, 23, 42, 0.8)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Zap size={18} color="#a855f7" />
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f3f4f6' }}>Agent Execution Trace Log</h3>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
          <X size={20} />
        </button>
      </div>

      <div style={{ padding: '1.25rem', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Guardrail Status Card */}
        <div style={{ background: hallucinationPassed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', border: `1px solid ${hallucinationPassed ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`, borderRadius: '10px', padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
            {hallucinationPassed ? <CheckCircle size={18} color="#34d399" /> : <ShieldAlert size={18} color="#ef4444" />}
            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: hallucinationPassed ? '#34d399' : '#f87171' }}>
              {hallucinationPassed ? 'Hallucination Check Passed' : 'Guardrail Warning'}
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            {hallucinationPassed 
              ? 'Tất cả câu từ đầu ra đã được đối chiếu và xác minh nguồn từ tài liệu gốc.' 
              : 'Phát hiện câu trả lời chưa có trích dẫn bảo chứng đầy đủ.'}
          </p>
        </div>

        {/* Latency & Agent Info */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <div style={{ flex: 1, background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-glass)', padding: '0.75rem', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Active Agent</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#6366f1', marginTop: '2px' }}>
              {lastResponse?.agent_name || 'System Orchestrator'}
            </div>
          </div>
          <div style={{ flex: 1, background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-glass)', padding: '0.75rem', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Latency</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Clock size={14} /> {latency} ms
            </div>
          </div>
        </div>

        {/* Tools Execution Pipeline */}
        <div>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Tool Calls Execution Sequence ({traceLogs.length})
          </h4>

          {traceLogs.length === 0 ? (
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', italic: 'true' }}>Chưa có trace log nào được ghi nhận. Hãy thực hiện 1 thao tác trên hệ thống.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {traceLogs.map((log, idx) => (
                <div key={idx} style={{ background: 'rgba(30, 41, 59, 0.7)', border: '1px solid var(--border-glass)', borderRadius: '8px', padding: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', fontWeight: 700, color: '#c084fc' }}>
                      #{idx + 1} {log.tool_name}
                    </span>
                    <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                      {log.execution_time_ms} ms
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                    {log.output_summary}
                  </div>
                  <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', background: '#090d16', padding: '0.5rem', borderRadius: '4px', color: '#94a3b8', overflowX: 'auto' }}>
                    {JSON.stringify(log.input_args, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Citations List */}
        {citations.length > 0 && (
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Document Citations ({citations.length})
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {citations.map((c, i) => (
                <div key={i} style={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '8px', padding: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 700, color: '#38bdf8', marginBottom: '0.25rem' }}>
                    <FileText size={14} /> {c.document_name} ({c.page_or_chunk})
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#cbd5e1', fontStyle: 'italic', background: 'rgba(0,0,0,0.3)', padding: '0.4rem', borderRadius: '4px' }}>
                    "{c.snippet}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
