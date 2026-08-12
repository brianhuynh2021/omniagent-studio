import React, { useState } from 'react';
import { Scale, FileCheck, HelpCircle, ShieldAlert, Sparkles, BookOpen, Download, Copy, Check } from 'lucide-react';

export default function LegalAssistantView({ onAgentExecute }) {
  const [title, setTitle] = useState("Vụ án Trộm cắp tài sản & Lừa đảo chiếm đoạt tài sản - Nguyễn Văn A");
  const [content, setContent] = useState(`HỒ SƠ VỤ ÁN HÌNH SỰ: NGUYỄN VĂN A
Ngày 15/05/2026, tại phường B, thành phố C, bị cáo Nguyễn Văn A (SN 1992, trú tại X) đã có hành vi lén lút đột nhập vào nhà bà Trần Thị B lấy trộm 1 chiếc xe máy Honda SH trị giá 85.000.000 VNĐ.
Sau khi trộm cắp, A mang xe đi làm giả giấy đăng ký và bán cho ông Lê Văn C với giá 50.000.000 VNĐ.
Vật chứng thu giữ: 01 xe máy Honda SH BKS 29A-12345, 01 giấy đăng ký xe giả, 01 kìm cộng lực.
Lời khai bị cáo: Nguyễn Văn A khai nhận do nợ nần bài bạc nên nảy sinh ý định trộm cắp.
Lời khai người bị hại: Bà B xác nhận thời điểm mất tài sản vào khoảng 02h00 sáng.
Căn cứ pháp lý áp dụng: Điều 173 Bộ luật Hình sự 2015 (Tội trộm cắp tài sản) và Điều 174 Bộ luật Hình sự 2015 (Tội lừa đảo chiếm đoạt tài sản).`);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleProcessCase = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8001/api/v1/legal/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content })
      });
      const data = await res.json();
      setResult(data);
      if (onAgentExecute) onAgentExecute(data);
    } catch (err) {
      console.error(err);
      alert("Đã xảy ra lỗi khi kết nối API Backend. Đảm bảo uvicorn đang chạy tại localhost:8000!");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyReport = () => {
    if (result?.structured_data?.proposed_prosecution_draft) {
      navigator.clipboard.writeText(result.structured_data.proposed_prosecution_draft);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Banner */}
      <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(17, 24, 39, 0.8))', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Scale size={24} color="#818cf8" />
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff' }}>
                Trợ Lý Pháp Luật - Kiểm Sát Viên (Prosecutor AI Workstation)
              </h2>
              <span className="badge badge-primary">MAIN PROJECT</span>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
              Tóm tắt hồ sơ án, trích xuất vật chứng/lời khai, tự động tạo Đề cương hỏi tại phiên tòa & Soạn thảo Báo cáo đề xuất truy tố.
            </p>
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Left Column: Dossier Input */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f3f4f6', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookOpen size={18} color="#818cf8" /> Nhập Hồ Sơ Vụ Án (PDF/DOCX/Text)
            </h3>
            <span className="badge badge-info">Qdrant Vector RAG</span>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem', display: 'block' }}>Tên vụ án / Mã hồ sơ:</label>
            <input 
              className="glass-input" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              id="input-legal-case-title"
            />
          </div>

          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem', display: 'block' }}>Nội dung hồ sơ vụ án & Tài liệu tố tụng:</label>
            <textarea 
              className="glass-input" 
              rows={14} 
              value={content} 
              onChange={(e) => setContent(e.target.value)}
              style={{ resize: 'vertical', fontFamily: 'var(--font-sans)', fontSize: '0.9rem', lineHeight: '1.6' }}
              id="input-legal-case-content"
            />
          </div>

          <button 
            className="glass-btn" 
            onClick={handleProcessCase} 
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}
            id="btn-process-legal-case"
          >
            <Sparkles size={18} />
            {loading ? "Đang phân tích hồ sơ & lập báo cáo..." : "Chạy AI Agent Phân Tích Án & Lập Đề Cương"}
          </button>
        </div>

        {/* Right Column: AI Output & Draft Report */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f3f4f6', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileCheck size={18} color="#34d399" /> Kết Quả Xử Lý Của Trợ Lý Kiểm Sát Viên
            </h3>
            {result && (
              <button className="glass-btn-secondary" onClick={handleCopyReport} style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}>
                {copied ? <Check size={14} color="#34d399" /> : <Copy size={14} />} {copied ? "Đã chép" : "Sao chép Báo cáo"}
              </button>
            )}
          </div>

          {!result ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', padding: '3rem 1rem', textAlign: 'center' }}>
              <Scale size={48} color="rgba(255,255,255,0.1)" style={{ marginBottom: '1rem' }} />
              <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>Chưa có thông tin xử lý.</p>
              <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Bấm nút "Chạy AI Agent Phân Tích Án" bên trái để tạo đề cương hỏi & báo cáo.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', overflowY: 'auto', maxHeight: '560px', paddingRight: '0.5rem' }}>
              {/* Summary Metrics */}
              <div style={{ background: 'rgba(0,0,0,0.25)', borderRadius: '8px', padding: '1rem', border: '1px solid var(--border-glass)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Bị cáo chính:</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#38bdf8' }}>{result.structured_data.defendant}</div>
                <div style={{ marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {result.structured_data.charges?.map((c, i) => (
                    <span key={i} className="badge badge-warning">{c}</span>
                  ))}
                </div>
              </div>

              {/* Evidence Board */}
              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f3f4f6', marginBottom: '0.5rem' }}>
                  📦 Vật Chứng & Chứng Cứ Đã Thu Giữ:
                </h4>
                <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {result.structured_data.key_evidence?.map((item, idx) => (
                    <li key={idx} style={{ marginBottom: '0.25rem' }}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Questioning Outline */}
              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#818cf8', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <HelpCircle size={16} /> Đề Cương Hỏi Cho Kiểm Sát Viên Tại Tòa:
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {result.structured_data.questioning_outline?.map((q, idx) => (
                    <div key={idx} style={{ background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.2)', padding: '0.65rem 0.85rem', borderRadius: '6px', fontSize: '0.85rem', color: '#e0e7ff' }}>
                      {q}
                    </div>
                  ))}
                </div>
              </div>

              {/* Proposed Report Draft */}
              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#34d399', marginBottom: '0.5rem' }}>
                  📄 Dự Thảo Báo Cáo Đề Xuất Giải Quyết Vụ Án:
                </h4>
                <pre style={{ fontFamily: 'var(--font-sans)', fontSize: '0.82rem', background: '#090d16', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-glass)', color: '#cbd5e1', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                  {result.structured_data.proposed_prosecution_draft}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
