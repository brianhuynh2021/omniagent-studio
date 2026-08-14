import React, { useState } from 'react';
import { Lock, User, Mail, Shield, X, Key, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose }) {
  const { login, register } = useAuth();
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  
  // Form fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  
  // UI States
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      if (tab === 'login') {
        await login(username, password);
        setSuccess('Đăng nhập thành công!');
        setTimeout(() => onClose(), 600);
      } else {
        await register(username, email, password, role);
        setSuccess('Tạo tài khoản thành công!');
        setTimeout(() => onClose(), 600);
      }
    } catch (err) {
      setError(err.message || 'Đã có lỗi xảy ra');
    } finally {
      setSubmitting(false);
    }
  };

  const fillQuickAdmin = () => {
    setTab('login');
    setUsername('admin');
    setPassword('admin123');
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close-btn" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="auth-modal-header">
          <div className="auth-modal-badge">
            <Shield size={16} />
            <span>Aegis Security Core</span>
          </div>
          <h2 className="auth-modal-title">
            {tab === 'login' ? 'Xác Thực Tài Khoản' : 'Đăng Ký Tài Khoản Mới'}
          </h2>
          <p className="auth-modal-desc">
            Truy cập hệ thống OmniAgent Studio với phân quyền Role-Based Access Control (RBAC).
          </p>
        </div>

        {/* Tabs */}
        <div className="auth-modal-tabs">
          <button 
            type="button"
            className={`auth-modal-tab ${tab === 'login' ? 'is-active' : ''}`}
            onClick={() => { setTab('login'); setError(null); }}
          >
            Đăng Nhập
          </button>
          <button 
            type="button"
            className={`auth-modal-tab ${tab === 'register' ? 'is-active' : ''}`}
            onClick={() => { setTab('register'); setError(null); }}
          >
            Đăng Ký Mới
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="auth-modal-form">
          {error && (
            <div className="auth-modal-alert is-error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="auth-modal-alert is-success">
              <CheckCircle2 size={16} />
              <span>{success}</span>
            </div>
          )}

          <div className="auth-input-group">
            <label className="auth-input-label">Tên Đăng Nhập (Username)</label>
            <div className="auth-input-wrapper">
              <User size={16} className="auth-input-icon" />
              <input 
                type="text"
                required
                className="auth-input"
                placeholder="Nhập tên đăng nhập..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          {tab === 'register' && (
            <div className="auth-input-group">
              <label className="auth-input-label">Email Doanh Nghiệp</label>
              <div className="auth-input-wrapper">
                <Mail size={16} className="auth-input-icon" />
                <input 
                  type="email"
                  required
                  className="auth-input"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="auth-input-group">
            <label className="auth-input-label">Mật Khẩu</label>
            <div className="auth-input-wrapper">
              <Key size={16} className="auth-input-icon" />
              <input 
                type="password"
                required
                className="auth-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {tab === 'register' && (
            <div className="auth-input-group">
              <label className="auth-input-label">Vai Trò Hệ Thống (Role)</label>
              <select 
                className="auth-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="user">User (Thành viên chuẩn)</option>
                <option value="attorney">Attorney (Luật sư / Chuyên viên Pháp lý)</option>
                <option value="analyst">Analyst (Chuyên viên Phân tích Data)</option>
                <option value="admin">Admin (Quản trị viên Hệ thống)</option>
              </select>
            </div>
          )}

          <button 
            type="submit" 
            className="auth-submit-btn"
            disabled={submitting}
          >
            <span>{tab === 'login' ? 'Đăng Nhập Ngay' : 'Khởi Tạo Tài Khoản'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Quick Seed Helper */}
        <div className="auth-modal-footer">
          <span>Dùng thử tài khoản hệ thống:</span>
          <button 
            type="button"
            className="auth-quick-btn"
            onClick={fillQuickAdmin}
          >
            Admin (admin / admin123)
          </button>
        </div>
      </div>
    </div>
  );
}
