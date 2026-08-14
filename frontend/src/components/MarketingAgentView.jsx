import React, { useState } from 'react';
import { Megaphone, Calendar, Users, Sparkles, Share2, MessageCircle, Video } from 'lucide-react';
import { apiUrl } from '../api';

export default function MarketingAgentView({ onAgentExecute }) {
  const [bizName, setBizName] = useState("Aroma Cafe & Bistro");
  const [bizType, setBizType] = useState("Quán Cafe & Ăn sáng");
  const [promotionGoal, setPromotionGoal] = useState("Khai trương món mới Combo Bữa Sáng giảm 20%");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch(apiUrl("/api/v1/marketing/campaign"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ biz_name: bizName, biz_type: bizType, promotion_goal: promotionGoal })
      });
      const data = await res.json();
      setResult(data);
      if (onAgentExecute) onAgentExecute(data);
    } catch (err) {
      console.error(err);
      alert("Đã xảy ra lỗi khi tạo chiến dịch Marketing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(17, 24, 39, 0.8))', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Megaphone size={24} color="#fbbf24" />
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff' }}>
                Local Business AI Marketing & Sales Agent
              </h2>
              <span className="badge badge-warning">Small Business</span>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
              Tự động viết bài Facebook/Zalo/TikTok, lên lịch đăng 7 ngày & quản lý Lead khách hàng cho quán cafe, spa, shop nhỏ.
            </p>
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr button', gap: '1rem', alignItems: 'end' }}>
        <div>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem', display: 'block' }}>Tên Quán / Cửa hàng:</label>
          <input className="glass-input" value={bizName} onChange={(e) => setBizName(e.target.value)} id="input-mkt-biz-name" />
        </div>
        <div>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem', display: 'block' }}>Loại hình kinh doanh:</label>
          <input className="glass-input" value={bizType} onChange={(e) => setBizType(e.target.value)} id="input-mkt-biz-type" />
        </div>
        <div>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem', display: 'block' }}>Mục tiêu khuyến mãi / Bài đăng:</label>
          <input className="glass-input" value={promotionGoal} onChange={(e) => setPromotionGoal(e.target.value)} id="input-mkt-goal" />
        </div>
        <button className="glass-btn" onClick={handleGenerate} disabled={loading} style={{ height: '42px' }} id="btn-generate-mkt">
          <Sparkles size={18} /> {loading ? "Đang tạo..." : "Tạo Chiến Dịch"}
        </button>
      </div>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Social Posts Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem' }}>
            <div className="glass-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#60a5fa', fontWeight: 700 }}>
                <Share2 size={18} /> Facebook Post
              </div>
              <pre style={{ fontFamily: 'var(--font-sans)', fontSize: '0.82rem', color: '#e2e8f0', whiteSpace: 'pre-wrap', lineHeight: '1.6', background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '8px' }}>
                {result.structured_data?.posts?.facebook}
              </pre>
            </div>

            <div className="glass-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#38bdf8', fontWeight: 700 }}>
                <MessageCircle size={18} /> Zalo OA Broadcast
              </div>
              <pre style={{ fontFamily: 'var(--font-sans)', fontSize: '0.82rem', color: '#e2e8f0', whiteSpace: 'pre-wrap', lineHeight: '1.6', background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '8px' }}>
                {result.structured_data?.posts?.zalo}
              </pre>
            </div>

            <div className="glass-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#f43f5e', fontWeight: 700 }}>
                <Video size={18} /> TikTok Video Script
              </div>
              <pre style={{ fontFamily: 'var(--font-sans)', fontSize: '0.82rem', color: '#e2e8f0', whiteSpace: 'pre-wrap', lineHeight: '1.6', background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '8px' }}>
                {result.structured_data?.posts?.tiktok_script}
              </pre>
            </div>
          </div>

          {/* Calendar & CRM Section */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
            <div className="glass-card">
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fbbf24', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Calendar size={18} /> Lịch Đăng Bài 7 Ngày Đã Lên Kế Hoạch:
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {result.structured_data?.calendar?.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid var(--border-glass)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span className="badge badge-warning" style={{ width: '85px', justifyContent: 'center' }}>{item.day} - {item.time}</span>
                      <span style={{ fontSize: '0.85rem', color: '#e2e8f0' }}>{item.topic}</span>
                    </div>
                    <span className="badge badge-info">{item.channel}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card">
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#34d399', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Users size={18} /> CRM Mini - Lead Khách Hàng:
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {result.structured_data?.crm_leads?.map((lead, idx) => (
                  <div key={idx} style={{ background: 'rgba(0,0,0,0.3)', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--border-glass)' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#fff' }}>{lead.name} ({lead.phone})</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Nhu cầu: {lead.interest}</div>
                    <span className="badge badge-success" style={{ marginTop: '0.25rem' }}>{lead.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
