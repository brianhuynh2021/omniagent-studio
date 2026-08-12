import React, { useState } from 'react';
import { Code, Server, CheckCircle2, FileCheck, Sparkles, Layers } from 'lucide-react';

export default function EngKnowledgeView({ onAgentExecute }) {
  const [sysName, setSysName] = useState("AI Core Platform Enterprise Engine");
  const [techSpec, setTechSpec] = useState("FastAPI backend, PostgreSQL, Qdrant vector database, Celery task queue, Multi-Agent workflow.");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8001/api/v1/eng/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sys_name: sysName, tech_spec_text: techSpec })
      });
      const data = await res.json();
      setResult(data);
      if (onAgentExecute) onAgentExecute(data);
    } catch (err) {
      console.error(err);
      alert("Đã xảy ra lỗi khi phân tích tài liệu kỹ thuật.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(192, 132, 252, 0.15), rgba(17, 24, 39, 0.8))', border: '1px solid rgba(192, 132, 252, 0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Code size={24} color="#c084fc" />
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff' }}>
                Engineering Knowledge & Requirements Assistant
              </h2>
              <span className="badge badge-primary">FAANG / Big Tech</span>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
              Tự động phân tích tài liệu kỹ thuật/README, tổng hợp kiến trúc hệ thống, sinh Kịch bản kiểm thử (Test Cases) & Ma trận Ma trận Traceability Matrix.
            </p>
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f3f4f6', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Server size={18} color="#c084fc" /> Nhập Yêu Cầu & Tài Liệu Mô Tả Kỹ Thuật (Architecture Spec)
        </h3>

        <div>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem', display: 'block' }}>Tên hệ thống / Dự án:</label>
          <input className="glass-input" value={sysName} onChange={(e) => setSysName(e.target.value)} id="input-eng-sys-name" />
        </div>

        <div>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem', display: 'block' }}>Nội dung Requirement & Technical Specifications:</label>
          <textarea 
            className="glass-input" 
            rows={4} 
            value={techSpec} 
            onChange={(e) => setTechSpec(e.target.value)}
            id="input-eng-tech-spec"
          />
        </div>

        <button className="glass-btn" onClick={handleAnalyze} disabled={loading} style={{ justifyContent: 'center' }} id="btn-analyze-eng-spec">
          <Sparkles size={18} /> {loading ? "Đang trích xuất kiến trúc & sinh test cases..." : "Phân Tích Kiến Trúc & Tạo Test Suite"}
        </button>
      </div>

      {result && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {/* Architecture Summary */}
          <div className="glass-card">
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#c084fc', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Layers size={18} /> Tổng Quan Kiến Trúc Hệ Thống:
            </h4>
            <div style={{ fontSize: '0.85rem', color: '#e2e8f0', background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-glass)', lineHeight: '1.7' }}>
              {result.structured_data?.architecture_summary}
            </div>

            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#38bdf8', marginTop: '1.25rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <FileCheck size={18} /> Traceability Matrix (Yêu Cầu → Kiểm Thử):
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {result.structured_data?.traceability_matrix?.map((row, idx) => (
                <div key={idx} style={{ background: 'rgba(0,0,0,0.2)', padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
                  <div>
                    <strong style={{ color: '#c084fc' }}>[{row.req_id}]</strong> {row.description}
                  </div>
                  <span className="badge badge-success">{row.test_id}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Test Cases Suite */}
          <div className="glass-card">
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#34d399', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={18} /> Tự Động Sinh 5 Test Cases Kiểm Thử (Integration & System):
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {result.structured_data?.test_cases?.map((tc, idx) => (
                <div key={idx} style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid var(--border-glass)', borderRadius: '8px', padding: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#fff' }}>[{tc.tc_id}] {tc.name}</span>
                    <span className={`badge ${tc.priority === 'High' ? 'badge-primary' : 'badge-info'}`}>{tc.type}</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    Mong đợi: <span style={{ color: '#93c5fd' }}>{tc.expected}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
