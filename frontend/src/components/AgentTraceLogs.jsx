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
      <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#ffffff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Zap size={18} color="var(--primary-sapphire)" />
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Nhật ký xử lý</h3>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <X size={20} />
        </button>
      </div>

      <div style={{ padding: '1.25rem', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Guardrail Status Card */}
        <div style={{ background: hallucinationPassed ? '#eaf7f2' : '#fff1f2', border: `1px solid ${hallucinationPassed ? '#bfe4d5' : '#fecdd3'}`, borderRadius: '8px', padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
            {hallucinationPassed ? <CheckCircle size={18} color="var(--primary-emerald)" /> : <ShieldAlert size={18} color="var(--primary-rose)" />}
            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: hallucinationPassed ? 'var(--primary-emerald)' : 'var(--primary-rose)' }}>
              {hallucinationPassed ? 'Đã kiểm tra nguồn' : 'Cần rà soát nguồn'}
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
          <div style={{ flex: 1, background: '#f8fbfd', border: '1px solid var(--border-glass)', padding: '0.75rem', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Active Agent</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-sapphire)', marginTop: '2px' }}>
              {lastResponse?.agent_name || 'System Orchestrator'}
            </div>
          </div>
          <div style={{ flex: 1, background: '#f8fbfd', border: '1px solid var(--border-glass)', padding: '0.75rem', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Latency</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-sapphire)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
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
                <div key={idx} style={{ background: '#ffffff', border: '1px solid var(--border-glass)', borderRadius: '8px', padding: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary-sapphire)' }}>
                      #{idx + 1} {log.tool_name}
                    </span>
                    <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                      {log.execution_time_ms} ms
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                    {log.output_summary}
                  </div>
                  <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', background: '#f8fbfd', padding: '0.5rem', borderRadius: '4px', color: 'var(--text-secondary)', overflowX: 'auto' }}>
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
                <div key={i} style={{ background: '#ffffff', border: '1px solid var(--border-glass)', borderRadius: '8px', padding: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary-sapphire)', marginBottom: '0.25rem' }}>
                    <FileText size={14} /> {c.document_name} ({c.page_or_chunk})
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontStyle: 'italic', background: '#f8fbfd', padding: '0.4rem', borderRadius: '4px' }}>
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
