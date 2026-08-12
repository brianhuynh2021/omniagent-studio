import React, { useState } from 'react';

export default function FinanceView({ onAgentExecute }) {
  const [financialData, setFinancialData] = useState(
    "Báo cáo tài chính Công ty Cổ phần Thương mại X - Quý 3/2024:\n- Doanh thu thuần: 450 tỷ đồng (+12% YoY)\n- Lợi nhuận sau thuế: 38 tỷ đồng\n- Nợ ngắn hạn: 210 tỷ đồng\n- Phải thu khách hàng ngắn hạn: 180 tỷ đồng (Tăng đột biến 45% so với cùng kỳ)\n- Giao dịch tiền mặt đáng chú ý: 5 giao dịch rút tiền mặt liên tiếp giá trị 45 tỷ đồng."
  );
  const [reportResult, setReportResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = () => {
    setLoading(true);
    fetch("http://localhost:8001/api/v1/agents/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        agent_id: "finance_audit_agent",
        input_query: `Phân tích báo cáo tài chính và kiểm tra anomaly giao dịch: ${financialData}`
      })
    })
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        setReportResult(data);
        if (onAgentExecute) onAgentExecute(data);
      })
      .catch(() => setLoading(false));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(99, 102, 241, 0.1))', borderColor: 'rgba(245, 158, 11, 0.3)' }}>
        <span className="badge badge-indigo" style={{ marginBottom: '0.5rem' }}>📊 Finance & Audit Risk AI</span>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: '0.25rem 0' }}>Trợ Lý Phân Tích Báo Cáo Tài Chính & Audit Rủi Ro</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Tự động tính toán các chỉ số sức khỏe tài chính, phát hiện bất thường dòng tiền và hỗ trợ thẩm định rủi ro doanh nghiệp.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.75rem' }}>📉 Dữ Liệu Báo Cáo Tài Chính</h3>
          <textarea 
            rows={8}
            className="form-control"
            value={financialData}
            onChange={(e) => setFinancialData(e.target.value)}
          />
          <button className="btn-primary" onClick={handleAnalyze} disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: '1rem', background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
            {loading ? "🔄 Đang Audit Tài chính..." : "📈 Phân Tích Chỉ Số & Audit Anomaly"}
          </button>
        </div>

        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.75rem', color: 'var(--primary-amber)' }}>📑 Báo Cáo Thẩm Định & Cảnh Báo Rủi Ro</h3>
          {reportResult ? (
            <div style={{ whiteSpace: 'pre-line', fontSize: '0.9rem', lineHeight: '1.6' }}>
              {reportResult.output_text}
              <div style={{ marginTop: '1rem', background: 'rgba(245, 158, 11, 0.1)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.3)', fontSize: '0.8rem' }}>
                💡 <strong>Audit Flag Detected:</strong> Tỷ lệ Phải thu / Doanh thu tăng bất thường + Giao dịch rút tiền mặt lớn cần chuyển bộ phận Compliance soát xét.
              </div>
            </div>
          ) : (
            <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '3rem 0' }}>
              Nhập báo cáo tài chính bên trái để chạy thuật toán phân tích chỉ số và cảnh báo rủi ro.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
