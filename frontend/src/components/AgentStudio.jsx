import React, { useState, useEffect } from 'react';
import { apiUrl } from '../api';

export default function AgentStudio({ onAgentCreated, onAgentExecute }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [domainKey, setDomainKey] = useState('custom');
  const [icon, setIcon] = useState('🤖');
  const [systemPrompt, setSystemPrompt] = useState('Bạn là AI Agent chuyên biệt. Hãy làm theo hướng dẫn...');
  const [selectedTools, setSelectedTools] = useState(['vector_rag_search', 'web_search']);
  const [promptsList, setPromptsList] = useState(['Phân tích tài liệu và đưa ra báo cáo chi tiết.']);
  const [newPromptText, setNewPromptText] = useState('');
  const [createdAgents, setCreatedAgents] = useState([]);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const iconsList = ['🤖', '⚖️', '🏥', '📊', '🏢', '📣', '🎧', '💻', '🧬', '🛡️', '⚙️', '🚀'];

  useEffect(() => {
    fetchCustomAgents();
  }, []);

  const fetchCustomAgents = () => {
    fetch(apiUrl("/api/v1/agents/custom/list"))
      .then(res => res.json())
      .then(data => setCreatedAgents(data))
      .catch(err => console.log("Fetch custom agents error", err));
  };

  const toggleTool = (toolName) => {
    if (selectedTools.includes(toolName)) {
      setSelectedTools(selectedTools.filter(t => t !== toolName));
    } else {
      setSelectedTools([...selectedTools, toolName]);
    }
  };

  const addPrompt = () => {
    if (newPromptText.trim()) {
      setPromptsList([...promptsList, newPromptText.trim()]);
      setNewPromptText('');
    }
  };

  const removePrompt = (index) => {
    setPromptsList(promptsList.filter((_, i) => i !== index));
  };

  const handleSaveAgent = (e) => {
    e.preventDefault();
    if (!name.trim() || !systemPrompt.trim()) {
      setStatusMsg('⚠️ Vui lòng điền đầy đủ Tên Agent và System Prompt.');
      return;
    }

    setSaving(true);
    setStatusMsg('');

    fetch(apiUrl("/api/v1/agents/custom/create"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name,
        description: description || "Custom User Created AI Agent",
        domain_key: domainKey,
        icon: icon,
        system_prompt: systemPrompt,
        default_tools: selectedTools,
        suggested_prompts: promptsList
      })
    })
      .then(res => res.json())
      .then(data => {
        setSaving(false);
        setStatusMsg('✅ Đã khởi tạo Agent thành công!');
        fetchCustomAgents();
        if (onAgentCreated) onAgentCreated(data.agent);
      })
      .catch(err => {
        setSaving(false);
        setStatusMsg('❌ Lỗi khi lưu Agent.');
        console.error(err);
      });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Title */}
      <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(99, 102, 241, 0.1))', borderColor: 'rgba(168, 85, 247, 0.3)' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: '700', marginBottom: '0.4rem', background: 'linear-gradient(90deg, #ffffff, #d8b4fe)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          🎨 Custom AI Agent Builder Studio
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Không bị gò bó bởi các mẫu có sẵn. Tự cấu hình System Prompt, tích hợp công cụ (Web search, Vector RAG, Python sandbox, SQL) và đóng gói Agent cho dự án riêng của bạn.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem' }}>
        {/* Creator Form */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1.25rem', color: 'var(--primary-purple)' }}>
            ⚙️ Cấu Hình Thông Số AI Agent
          </h3>

          <form onSubmit={handleSaveAgent} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>Icon Agent</label>
                <select 
                  className="form-control" 
                  value={icon} 
                  onChange={(e) => setIcon(e.target.value)}
                  style={{ fontSize: '1.3rem', textAlign: 'center' }}
                >
                  {iconsList.map((ic, i) => <option key={i} value={ic}>{ic}</option>)}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>Tên AI Agent (*)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="VD: Trợ Lý Audit Hợp Đồng Xây Dựng"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>Mô Tả Nhiệm Vụ</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Tóm tắt ngắn gọn vai trò chuyên môn của Agent"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>Lĩnh Vực / Category</label>
              <select className="form-control" value={domainKey} onChange={(e) => setDomainKey(e.target.value)}>
                <option value="legal">⚖️ Legal & Judicial</option>
                <option value="healthcare">🏥 Healthcare & Clinical</option>
                <option value="finance">📊 Finance & Risk</option>
                <option value="enterprise">🏢 Enterprise Knowledge</option>
                <option value="marketing">📣 Marketing & Social</option>
                <option value="support">🎧 Customer Support</option>
                <option value="engineering">💻 Engineering</option>
                <option value="custom">🎨 Custom Domain</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>System Prompt Directive (*)</label>
              <textarea 
                rows={4} 
                className="form-control" 
                placeholder="Thiết lập persona, nguyên tắc ứng xử và định dạng đầu ra của Agent..."
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Công Cụ Được Cấp Quyền (Tools Capabilities)</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                {[
                  { id: 'vector_rag_search', name: '📚 Vector RAG Search' },
                  { id: 'web_search', name: '🌐 Live Web Search' },
                  { id: 'code_sandbox', name: '⚡ Python Sandbox' },
                  { id: 'sql_query_engine', name: '🗄️ SQL DB Engine' }
                ].map(tool => (
                  <label key={tool.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(30, 41, 59, 0.5)', padding: '0.5rem 0.75rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
                    <input 
                      type="checkbox" 
                      checked={selectedTools.includes(tool.id)} 
                      onChange={() => toggleTool(tool.id)}
                    />
                    {tool.name}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>Prompt Mẫu Gợi Ý</label>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Thêm prompt câu hỏi mẫu..."
                  value={newPromptText}
                  onChange={(e) => setNewPromptText(e.target.value)}
                />
                <button type="button" className="btn-secondary" onClick={addPrompt}>Thêm</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {promptsList.map((p, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '0.35rem 0.65rem', borderRadius: '6px', fontSize: '0.8rem' }}>
                    <span>💡 {p}</span>
                    <button type="button" onClick={() => removePrompt(idx)} style={{ background: 'none', border: 'none', color: 'var(--primary-rose)', cursor: 'pointer' }}>❌</button>
                  </div>
                ))}
              </div>
            </div>

            {statusMsg && <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>{statusMsg}</div>}

            <button type="submit" className="btn-primary" disabled={saving} style={{ justifyContent: 'center', marginTop: '0.5rem' }}>
              {saving ? "🔄 Đang lưu..." : "✨ Đóng Gói & Xuất Bản Custom Agent"}
            </button>
          </form>
        </div>

        {/* List of Custom User Agents Created */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="glass-card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.75rem' }}>
              📦 Agent Đã Tạo Theo Yêu Cầu ({createdAgents.length})
            </h3>
            {createdAgents.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Chưa có Custom Agent nào. Hãy điền form bên trái để khởi tạo ngay Agent đầu tiên!</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '500px', overflowY: 'auto' }}>
                {createdAgents.map(ca => (
                  <div key={ca.id} style={{ background: 'rgba(30, 41, 59, 0.6)', border: '1px solid var(--border-glass)', borderRadius: '10px', padding: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <span style={{ fontSize: '1.3rem' }}>{ca.icon}</span>
                      <h5 style={{ fontWeight: '700', fontSize: '0.95rem' }}>{ca.name}</h5>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{ca.description}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                      {ca.default_tools.map((t, i) => (
                        <span key={i} className="badge badge-purple" style={{ fontSize: '0.6rem' }}>{t}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
