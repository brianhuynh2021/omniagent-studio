import React, { useState } from 'react';
import { FileText, Search, BookOpen, CheckSquare, Sparkles, FileCode } from 'lucide-react';
import { apiUrl } from '../api';

export default function DocIntelView({ onAgentExecute }) {
  const [query, setQuery] = useState("Quy định bảo mật dữ liệu công ty và thủ tục xin nghỉ phép?");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await fetch(apiUrl("/api/v1/doc_intel/qa"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query })
      });
      const data = await res.json();
      setResult(data);
      if (onAgentExecute) onAgentExecute(data);
    } catch (err) {
      console.error(err);
      alert("Đã xảy ra lỗi khi truy vấn API Backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(17, 24, 39, 0.8))', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <FileText size={24} color="#38bdf8" />
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff' }}>
                AI Document Intelligence Platform
              </h2>
              <span className="badge badge-info">SaaS Core</span>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
              Hỏi đáp trên toàn bộ tài liệu nội bộ công ty (SOP, Hợp đồng, Policy), tự động trích xuất nguồn trang & tạo Checklist công việc.
            </p>
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f3f4f6', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Search size={18} color="#38bdf8" /> Tìm Kiếm & Hỏi Đáp Với Kho Tri Thức Công Ty
        </h3>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <input 
            className="glass-input" 
            value={query} 
            onChange={(e) => setQuery(e.target.value)} 
            placeholder="Nhập câu hỏi liên quan đến tài liệu nội bộ..."
            id="input-doc-intel-query"
          />
          <button className="glass-btn" onClick={handleSearch} disabled={loading} style={{ whiteSpace: 'nowrap' }} id="btn-doc-intel-search">
            <Sparkles size={18} /> {loading ? "Đang truy vấn..." : "Hỏi Đáp Tri Thức"}
          </button>
        </div>
      </div>

      {result && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {/* Answer Card */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <BookOpen size={18} /> Câu Trả Lời Được Bảo Chứng Từ RAG:
            </h4>
            <div style={{ fontSize: '0.9rem', color: '#e2e8f0', whiteSpace: 'pre-wrap', lineHeight: '1.7', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
              {result.output_text}
            </div>

            <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f3f4f6', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckSquare size={16} color="#34d399" /> Checklist Tuân Thủ Đề Xuất:
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {result.structured_data?.checklist?.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#cbd5e1', background: 'rgba(16, 185, 129, 0.08)', padding: '0.5rem 0.75rem', borderRadius: '6px' }}>
                  <input type="checkbox" defaultChecked style={{ accentColor: '#10b981' }} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Citations Card */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#a855f7', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <FileCode size={18} /> Danh Sách Nguồn Trích Dẫn Chi Tiết:
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {result.citations?.map((c, i) => (
                <div key={i} style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '8px', padding: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8' }}>{c.document_name}</span>
                    <span className="badge badge-info">{c.page_or_chunk}</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic' }}>
                    "{c.snippet}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
