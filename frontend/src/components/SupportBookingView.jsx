import React, { useState } from 'react';
import { MessageSquare, CalendarCheck, UserCheck, Send, Sparkles, AlertCircle } from 'lucide-react';

export default function SupportBookingView({ onAgentExecute }) {
  const [message, setMessage] = useState("Tôi muốn đặt lịch làm dịch vụ bảo dưỡng xe vào ngày mai lúc 15h");
  const [phone, setPhone] = useState("0912345678");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSendMessage = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8001/api/v1/booking/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, customer_phone: phone })
      });
      const data = await res.json();
      setResult(data);
      if (onAgentExecute) onAgentExecute(data);
    } catch (err) {
      console.error(err);
      alert("Đã xảy ra lỗi khi kết nối Bot hỗ trợ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(17, 24, 39, 0.8))', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <MessageSquare size={24} color="#34d399" />
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff' }}>
                AI Customer Support & Booking Agent
              </h2>
              <span className="badge badge-success">Automation & Booking</span>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
              Tự động trả lời FAQ 24/7, xác nhận khung giờ trống, tự động ghi nhận đặt lịch và hỗ trợ Human Handoff cho tư vấn viên.
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Customer Interaction Chat Simulator */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f3f4f6', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MessageSquare size={18} color="#34d399" /> Giả Lập Hội Thoại Khách Hàng
          </h3>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem', display: 'block' }}>Số điện thoại khách hàng:</label>
            <input className="glass-input" value={phone} onChange={(e) => setPhone(e.target.value)} id="input-booking-phone" />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem', display: 'block' }}>Tin nhắn khách hàng gửi tới Shop/Spa/Phòng khám:</label>
            <textarea 
              className="glass-input" 
              rows={4} 
              value={message} 
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Nhập câu hỏi hoặc yêu cầu đặt lịch..."
              id="input-booking-msg"
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              className="glass-btn-secondary" 
              onClick={() => setMessage("Quán mở cửa từ mấy giờ đến mấy giờ ạ?")} 
              style={{ fontSize: '0.78rem', flex: 1 }}
            >
              Mẫu: Hỏi FAQ
            </button>
            <button 
              className="glass-btn-secondary" 
              onClick={() => setMessage("Tôi cần gặp người thật để phản ánh sự cố khẩn cấp!")} 
              style={{ fontSize: '0.78rem', flex: 1 }}
            >
              Mẫu: Human Handoff
            </button>
          </div>

          <button className="glass-btn" onClick={handleSendMessage} disabled={loading} style={{ justifyContent: 'center' }} id="btn-send-booking-msg">
            <Send size={18} /> {loading ? "AI đang phản hồi..." : "Gửi Tin Nhắn Cho AI Chatbot"}
          </button>

          {result && (
            <div style={{ marginTop: '0.5rem', background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>AI Reply Message:</div>
              <div style={{ fontSize: '0.9rem', color: '#e2e8f0', lineHeight: '1.6' }}>
                {result.output_text}
              </div>
            </div>
          )}
        </div>

        {/* Real-time Booking Dashboard */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f3f4f6', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CalendarCheck size={18} color="#38bdf8" /> Bảng Quản Lý Lịch Hẹn & Handoff
          </h3>

          {result?.structured_data?.conversation_status === "HUMAN_HANDOFF" && (
            <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '8px', padding: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <AlertCircle size={20} color="#ef4444" />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#f87171' }}>CẢNH BÁO HUMAN HANDOFF</div>
                <div style={{ fontSize: '0.78rem', color: '#fca5a5' }}>Hệ thống đã tự động chuyển cuộc gọi cho nhân viên tư vấn trực ca!</div>
              </div>
            </div>
          )}

          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              Khung giờ khả dụng hôm nay:
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {["09:00", "10:30", "14:00", "15:30", "17:00"].map((slot, i) => (
                <span key={i} className="badge badge-info" style={{ fontSize: '0.8rem', padding: '0.35rem 0.65rem' }}>
                  {slot} (Trống)
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              Danh sách lịch hẹn mới cập nhật:
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {(result?.structured_data?.bookings_list || [
                { id: "BK-101", customer_name: "Lê Hoài Nam", phone: "0912345678", service: "Bảo dưỡng xe tay ga", time: "14:00 15/08/2026", status: "CONFIRMED" },
                { id: "BK-102", customer_name: "Đặng Kim Anh", phone: "0987654321", service: "Chăm sóc da mặt chuyên sâu", time: "10:00 16/08/2026", status: "PENDING" }
              ]).map((b, idx) => (
                <div key={idx} style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid var(--border-glass)', padding: '0.75rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#fff' }}>[{b.id}] {b.customer_name} - {b.phone}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{b.service} ({b.time})</div>
                  </div>
                  <span className={`badge ${b.status === 'CONFIRMED' ? 'badge-success' : 'badge-warning'}`}>
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
