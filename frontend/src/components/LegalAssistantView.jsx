import React, { useState, useEffect } from 'react';
import { Scale, FileCheck, HelpCircle, ShieldAlert, Sparkles, BookOpen, Download, Copy, Check, FileText, Search, UserCheck } from 'lucide-react';

export default function LegalAssistantView({ onAgentExecute }) {
  const [sampleCases, setSampleCases] = useState([]);
  const [selectedCaseId, setSelectedCaseId] = useState("case_01");

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
  const [activeTab, setActiveTab] = useState("synopsis"); // 'synopsis' | 'evidence' | 'outline' | 'report'

  useEffect(() => {
    fetch("http://localhost:8001/api/v1/legal/sample-cases")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setSampleCases(data);
        }
      })
      .catch(() => console.log("Backend loading or using fallback sample cases..."));
  }, []);

  const handleSelectSampleCase = (caseId) => {
    setSelectedCaseId(caseId);
    const found = sampleCases.find(c => c.id === caseId);
    if (found) {
      setTitle(found.title);
      setContent(found.content);
    }
  };

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
      alert("Đã xảy ra lỗi khi kết nối API Backend. Đảm bảo Backend đang chạy!");
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

  const handleExportText = () => {
    if (!result?.structured_data?.proposed_prosecution_draft) return;
    const element = document.createElement("a");
    const file = new Blob([result.structured_data.proposed_prosecution_draft], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `Bao_Cao_De_Xuat_VKS_${title.slice(0, 20)}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header Banner */}
      <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.18), rgba(17, 24, 39, 0.85))', border: '1px solid rgba(99, 102, 241, 0.35)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Scale size={26} color="#818cf8" />
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>
                Trợ Lý Pháp Luật - Kiểm Sát Viên (Prosecutor AI Workstation)
              </h2>
              <span className="badge badge-indigo">MAIN FLAGSHIP PROJECT</span>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
              Trích xuất chứng cứ/vật chứng, tra cứu điều luật BLHS/BLTTHS, tự động tạo Đề cương hỏi tại phiên tòa & Soạn Báo cáo đề xuất truy tố.
            </p>
          </div>

          {/* Sample Select */}
          {sampleCases.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.3)', padding: '0.5rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Mẫu án:</span>
              <select 
                value={selectedCaseId} 
                onChange={(e) => handleSelectSampleCase(e.target.value)}
                style={{ background: 'transparent', color: '#818cf8', border: 'none', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', outline: 'none' }}
              >
                {sampleCases.map(c => (
                  <option key={c.id} value={c.id} style={{ background: '#111827', color: '#fff' }}>
                    {c.category}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Main Workspace Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        {/* Left Column: Input Dossier */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f3f4f6', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookOpen size={18} color="#818cf8" /> Nhập Hồ Sơ Vụ Án (Text / PDF)
            </h3>
            <span className="badge badge-cyan">Qdrant Hybrid RAG</span>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem', display: 'block' }}>Tên vụ án / Mã hồ sơ:</label>
            <input 
              className="form-control" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              id="input-legal-case-title"
            />
          </div>

          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem', display: 'block' }}>Nội dung chi tiết hồ sơ án & Chứng cứ tố tụng:</label>
            <textarea 
              className="form-control" 
              rows={13} 
              value={content} 
              onChange={(e) => setContent(e.target.value)}
              style={{ resize: 'vertical', fontFamily: 'var(--font-sans)', fontSize: '0.88rem', lineHeight: '1.6' }}
              id="input-legal-case-content"
            />
          </div>

          <button 
            className="btn-primary" 
            onClick={handleProcessCase} 
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', fontSize: '0.95rem' }}
            id="btn-process-legal-case"
          >
            <Sparkles size={18} />
            {loading ? "Đang phân tích chứng cứ & lập báo cáo..." : "Chạy AI Agent Phân Tích Án & Lập Đề Cương"}
          </button>
        </div>

        {/* Right Column: AI Processed Results */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f3f4f6', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileCheck size={18} color="#34d399" /> Trợ Lý Kiểm Sát Viên Analysis Output
            </h3>

            {result && (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn-secondary" onClick={handleCopyReport} style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}>
                  {copied ? <Check size={14} color="#34d399" /> : <Copy size={14} />} {copied ? "Đã sao chép" : "Sao chép"}
                </button>
                <button className="btn-secondary" onClick={handleExportText} style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}>
                  <Download size={14} /> Tải (.txt)
                </button>
              </div>
            )}
          </div>

          {!result ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', padding: '3.5rem 1rem', textAlign: 'center' }}>
              <Scale size={52} color="rgba(255,255,255,0.08)" style={{ marginBottom: '1rem' }} />
              <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Sẵn sàng phân tích hồ sơ án</p>
              <p style={{ fontSize: '0.82rem', marginTop: '0.25rem', maxWidth: '340px' }}>
                Nhấn nút "Chạy AI Agent Phân Tích Án" bên trái để tự động tạo Ma trận chứng cứ, Đề cương hỏi & Báo cáo truy tố.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, overflow: 'hidden' }}>
              {/* Output Tabs Navigation */}
              <div style={{ display: 'flex', borderBottom: '1px solid var(--border-glass)', gap: '0.5rem', paddingBottom: '0.5rem' }}>
                <button 
                  className={`btn-secondary ${activeTab === 'synopsis' ? 'active' : ''}`}
                  onClick={() => setActiveTab('synopsis')}
                  style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem', borderRadius: '8px', background: activeTab === 'synopsis' ? 'rgba(99, 102, 241, 0.25)' : 'transparent', borderColor: activeTab === 'synopsis' ? 'var(--primary-indigo)' : 'transparent' }}
                >
                  📋 Tóm tắt Vụ án
                </button>
                <button 
                  className={`btn-secondary ${activeTab === 'evidence' ? 'active' : ''}`}
                  onClick={() => setActiveTab('evidence')}
                  style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem', borderRadius: '8px', background: activeTab === 'evidence' ? 'rgba(6, 182, 212, 0.25)' : 'transparent', borderColor: activeTab === 'evidence' ? 'var(--primary-cyan)' : 'transparent' }}
                >
                  🔍 Ma trận Chứng cứ
                </button>
                <button 
                  className={`btn-secondary ${activeTab === 'outline' ? 'active' : ''}`}
                  onClick={() => setActiveTab('outline')}
                  style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem', borderRadius: '8px', background: activeTab === 'outline' ? 'rgba(168, 85, 247, 0.25)' : 'transparent', borderColor: activeTab === 'outline' ? 'var(--primary-purple)' : 'transparent' }}
                >
                  ⚖️ Đề cương Xét hỏi
                </button>
                <button 
                  className={`btn-secondary ${activeTab === 'report' ? 'active' : ''}`}
                  onClick={() => setActiveTab('report')}
                  style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem', borderRadius: '8px', background: activeTab === 'report' ? 'rgba(16, 185, 129, 0.25)' : 'transparent', borderColor: activeTab === 'report' ? 'var(--primary-emerald)' : 'transparent' }}
                >
                  📜 Báo cáo Truy tố
                </button>
              </div>

              {/* Tab 1: Synopsis */}
              {activeTab === 'synopsis' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', maxHeight: '480px', paddingRight: '0.4rem' }}>
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Bị cáo chính:</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#38bdf8' }}>{result.structured_data.defendant}</div>
                    
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>Tội danh đề nghị truy tố:</div>
                    <div style={{ marginTop: '0.35rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      {result.structured_data.charges?.map((c, i) => (
                        <div key={i} className="badge badge-purple" style={{ justifyContent: 'flex-start', fontSize: '0.82rem' }}>
                          ⚖️ {c}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f3f4f6', marginBottom: '0.5rem' }}>
                      📜 Căn Cứ Pháp Lý Áp Dụng (Verified Laws):
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {result.structured_data.legal_citations?.map((cite, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.83rem' }}>
                          <span style={{ fontWeight: 600, color: '#e0e7ff' }}>{cite.article}: {cite.title}</span>
                          <span className="badge badge-emerald">{cite.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Evidence Matrix */}
              {activeTab === 'evidence' && (
                <div style={{ overflowY: 'auto', maxHeight: '480px', paddingRight: '0.4rem' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-muted)', textAlign: 'left' }}>
                        <th style={{ padding: '0.6rem 0.5rem' }}>Loại chứng cứ</th>
                        <th style={{ padding: '0.6rem 0.5rem' }}>Mô tả chi tiết</th>
                        <th style={{ padding: '0.6rem 0.5rem' }}>Mức độ quan trọng</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.structured_data.evidence_matrix?.map((ev, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <td style={{ padding: '0.6rem 0.5rem', fontWeight: 600, color: '#38bdf8' }}>{ev.item}</td>
                          <td style={{ padding: '0.6rem 0.5rem', color: '#d1d5db' }}>{ev.description}</td>
                          <td style={{ padding: '0.6rem 0.5rem' }}>
                            <span className="badge badge-cyan">{ev.relevance}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Tab 3: Interrogation Outline */}
              {activeTab === 'outline' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', overflowY: 'auto', maxHeight: '480px', paddingRight: '0.4rem' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#818cf8', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <HelpCircle size={16} /> Đề Cương Câu Hỏi Tại Phiên Tòa (Dành cho Kiểm Sát Viên):
                  </h4>
                  {result.structured_data.interrogation_questions?.map((qItem, idx) => (
                    <div key={idx} style={{ background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.2)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                        <span className="badge badge-indigo">Đối tượng: {qItem.target}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Câu hỏi #{idx + 1}</span>
                      </div>
                      <div style={{ color: '#e0e7ff', fontWeight: 500, lineHeight: '1.5' }}>{qItem.question}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 4: Proposed Report Draft */}
              {activeTab === 'report' && (
                <div style={{ overflowY: 'auto', maxHeight: '480px', paddingRight: '0.4rem' }}>
                  <pre style={{ fontFamily: 'var(--font-sans)', fontSize: '0.82rem', background: '#090d16', padding: '1.1rem', borderRadius: '8px', border: '1px solid var(--border-glass)', color: '#cbd5e1', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                    {result.structured_data.proposed_prosecution_draft}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
