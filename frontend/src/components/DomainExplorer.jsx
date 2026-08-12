import React, { useState, useEffect } from 'react';

export default function DomainExplorer({ onSelectDomain, activeDomainKey, onAgentExecute }) {
  const [domains, setDomains] = useState([]);
  const [agents, setAgents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [testInput, setTestInput] = useState('');
  const [executing, setExecuting] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8001/api/v1/domains/list")
      .then(res => res.json())
      .then(data => {
        setDomains(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    fetch("http://localhost:8001/api/v1/agents/list")
      .then(res => res.json())
      .then(data => setAgents(data))
      .catch(err => console.log("Agents list err", err));
  }, []);

  const filteredDomains = domains.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const activeDomainAgents = agents.filter(a => activeDomainKey ? a.domain_key === activeDomainKey : true);

  const handleRunAgentTest = (agent) => {
    setSelectedAgent(agent);
    setTestInput(agent.suggested_prompts[0] || '');
  };

  const submitAgentExecution = () => {
    if (!selectedAgent || !testInput.trim()) return;
    setExecuting(true);

    fetch("http://localhost:8001/api/v1/agents/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        agent_id: selectedAgent.id,
        input_query: testInput
      })
    })
      .then(res => res.json())
      .then(data => {
        setExecuting(false);
        if (onAgentExecute) onAgentExecute(data);
      })
      .catch(err => {
        setExecuting(false);
        console.error("Execution error", err);
      });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header Banner */}
      <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(6, 182, 212, 0.1))', borderColor: 'rgba(99, 102, 241, 0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: '700', marginBottom: '0.4rem', background: 'linear-gradient(90deg, #ffffff, #93c5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              🌐 Multi-Domain AI Ecosystem Explorer
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Khám phá và kích hoạt các AI Agent chuyên biệt cho từng ngành nghề (Pháp luật, Y tế, Tài chính, Enterprise RAG, Marketing, Dev, Customer Support).
            </p>
          </div>
          <input 
            type="text" 
            placeholder="🔍 Tìm theo ngành, từ khóa..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-control"
            style={{ width: '280px' }}
          />
        </div>
      </div>

      {/* Domain Cards Grid */}
      <div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
          Lĩnh Vực & Ngành Nghề ({filteredDomains.length})
        </h3>

        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Đang tải danh mục Domain...</div>
        ) : (
          <div className="domain-grid">
            {filteredDomains.map(dom => {
              const isActive = activeDomainKey === dom.key;
              return (
                <div 
                  key={dom.key} 
                  className={`domain-card ${isActive ? 'active' : ''}`}
                  onClick={() => onSelectDomain(dom.key)}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span className="domain-icon">{dom.icon}</span>
                      <span className="badge badge-indigo">{dom.tags[0] || 'AI Agent'}</span>
                    </div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: '700', margin: '0.5rem 0 0.25rem 0' }}>{dom.name}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4', marginBottom: '1rem' }}>
                      {dom.description}
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {dom.tags.slice(0, 3).map((t, idx) => (
                      <span key={idx} className="badge badge-purple" style={{ fontSize: '0.65rem' }}>#{t}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Active Domain Agents & Quick Sandbox */}
      <div className="glass-card">
        <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1rem' }}>
          🤖 AI Agents khả dụng {activeDomainKey ? `[Lĩnh vực: ${activeDomainKey.toUpperCase()}]` : 'toàn hệ thống'} ({activeDomainAgents.length})
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {/* Agent list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {activeDomainAgents.map(ag => (
              <div 
                key={ag.id} 
                style={{ 
                  background: selectedAgent?.id === ag.id ? 'rgba(99, 102, 241, 0.2)' : 'rgba(30, 41, 59, 0.5)',
                  border: selectedAgent?.id === ag.id ? '1px solid var(--primary-indigo)' : '1px solid var(--border-glass)',
                  borderRadius: '12px',
                  padding: '1rem',
                  cursor: 'pointer'
                }}
                onClick={() => handleRunAgentTest(ag)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>{ag.icon}</span>
                  <div>
                    <h5 style={{ fontWeight: '700', fontSize: '1rem' }}>{ag.name}</h5>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {ag.id}</span>
                  </div>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>{ag.description}</p>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  {ag.default_tools.map((t, idx) => (
                    <span key={idx} className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>🛠️ {t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Execution Sandbox */}
          <div style={{ background: 'rgba(15, 23, 42, 0.8)', borderRadius: '12px', padding: '1.25rem', border: '1px solid var(--border-glass)' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.75rem', color: 'var(--primary-cyan)' }}>
              ⚡ ReAct Agent Sandbox Console
            </h4>
            {selectedAgent ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                    Agent đang chọn: <strong>{selectedAgent.name}</strong>
                  </label>
                  <textarea 
                    rows={4}
                    className="form-control"
                    placeholder="Nhập câu lệnh/yêu cầu cho Agent..."
                    value={testInput}
                    onChange={(e) => setTestInput(e.target.value)}
                  />
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Gợi ý prompt mẫu:</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {selectedAgent.suggested_prompts.map((p, i) => (
                      <button 
                        key={i} 
                        className="btn-secondary" 
                        style={{ fontSize: '0.75rem', textAlign: 'left', padding: '0.4rem 0.65rem' }}
                        onClick={() => setTestInput(p)}
                      >
                        💡 {p}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  className="btn-primary" 
                  onClick={submitAgentExecution}
                  disabled={executing}
                  style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
                >
                  {executing ? "🔄 Đang chạy Multi-Agent..." : "🚀 Kích hoạt Agent suy luận"}
                </button>
              </div>
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                👈 Chọn một Agent bên trái để test và xem trace log suy luận thực tế.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
