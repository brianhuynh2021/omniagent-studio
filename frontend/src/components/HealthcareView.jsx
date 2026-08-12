import React, { useState } from 'react';

export default function HealthcareView({ onAgentExecute }) {
  const [patientRecord, setPatientRecord] = useState(
    "Bệnh nhân nam, 58 tuổi. Nhập viện do đau ngực âm ỉ kéo dài 3 giờ, lan ra vai trái. Tiền sử: Tăng huyết áp 5 năm, đái tháo đường type 2. Mạch: 92 l/p, Huyết áp: 155/95 mmHg. Xét nghiệm Troponin I tăng nhẹ."
  );
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = () => {
    setLoading(true);
    fetch("http://localhost:8001/api/v1/agents/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        agent_id: "healthcare_triage_assistant",
        input_query: `Phân tích hồ sơ bệnh nhân: ${patientRecord}`
      })
    })
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        setAnalysisResult(data);
        if (onAgentExecute) onAgentExecute(data);
      })
      .catch(() => setLoading(false));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.1))', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
        <span className="badge badge-emerald" style={{ marginBottom: '0.5rem' }}>🏥 Clinical & Medical AI</span>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: '0.25rem 0' }}>Trợ Lý Y Tế, Phân Loại Triệu Chứng & Mã ICD-10</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Hỗ trợ phân tích dữ liệu bệnh án, gợi ý mã chẩn đoán ICD-10 và tra cứu tương tác y khoa với guardrail bảo vệ quyền riêng tư bệnh nhân (HIPAA Compliance).
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.75rem' }}>📋 Hồ Sơ Bệnh Nhập Khám</h3>
          <textarea 
            rows={8}
            className="form-control"
            value={patientRecord}
            onChange={(e) => setPatientRecord(e.target.value)}
          />
          <button className="btn-primary" onClick={handleAnalyze} disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
            {loading ? "🔄 Đang phân tích Y khoa..." : "🏥 Kích hoạt Trợ Lý Y Tế Phân Tích"}
          </button>
        </div>

        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.75rem', color: 'var(--primary-emerald)' }}>🩺 Chẩn Đoán & Mã ICD-10 Gợi Ý</h3>
          {analysisResult ? (
            <div style={{ whiteSpace: 'pre-line', fontSize: '0.9rem', lineHeight: '1.6' }}>
              {analysisResult.output_text}
              <div style={{ marginTop: '1rem', background: 'rgba(16, 185, 129, 0.1)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.3)', fontSize: '0.8rem' }}>
                ⚠️ <strong>Medical Disclaimer:</strong> Đầu ra được tạo bởi AI trợ lý. Mọi quyết định điều trị và kê đơn phải được xác nhận bởi Bác sĩ chuyên khoa phụ trách.
              </div>
            </div>
          ) : (
            <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '3rem 0' }}>
              Nhập nội dung hồ sơ bệnh án bên trái để nhận tóm tắt lâm sàng và mã ICD-10.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
