import React, { useState } from 'react';
import { ShieldCheck, UserCheck, Cpu, Database, Activity, Lock, Users, Zap, Layers, RefreshCw } from 'lucide-react';

export default function EnterpriseGovernanceBar({ onOpenHITL, systemInfo }) {
  const [role, setRole] = useState('Enterprise Admin');
  const [tenant, setTenant] = useState('Global Core (Multi-Tenant)');

  return (
    <div className="gov-bar">
      <div className="gov-bar__left">
        {/* Security Role Selector */}
        <div className="gov-item">
          <Lock size={14} className="gov-item__icon" />
          <span className="gov-item__label">Vai Trò (RBAC):</span>
          <select value={role} onChange={(e) => setRole(e.target.value)} className="gov-select">
            <option value="Enterprise Admin">👑 Enterprise Admin</option>
            <option value="Department Manager">👔 Department Manager</option>
            <option value="Legal Auditor">⚖️ Legal Auditor</option>
            <option value="Standard Staff">👤 Standard Employee</option>
          </select>
        </div>

        {/* Tenant Selector */}
        <div className="gov-item">
          <Layers size={14} className="gov-item__icon" />
          <span className="gov-item__label">Tenant:</span>
          <select value={tenant} onChange={(e) => setTenant(e.target.value)} className="gov-select">
            <option value="Global Core (Multi-Tenant)">🏢 Core Platform (Multi-Tenant)</option>
            <option value="Legal Department">⚖️ Phòng Pháp Lý & Tuân thủ</option>
            <option value="Document Intelligence">📄 Khối Quản lý Tài liệu</option>
            <option value="Marketing Division">📢 Khối Marketing & Thương mại</option>
          </select>
        </div>
      </div>

      <div className="gov-bar__right">
        {/* RAG Health Status */}
        <div className="gov-pill">
          <Database size={13} className="gov-pill__icon text-cyan" />
          <span>Vector DB: Qdrant Hybrid RAG</span>
        </div>

        {/* HITL Gate Alert Button */}
        <button className="gov-hitl-btn" onClick={onOpenHITL} title="Mở Cổng Duyệt Tác Vụ HITL">
          <UserCheck size={14} />
          <span>Duyệt HITL</span>
          <span className="gov-hitl-badge">1 Chờ duyệt</span>
        </button>

        {/* Token Budget Metering */}
        <div className="gov-meter">
          <Zap size={13} className="gov-meter__icon" />
          <div className="gov-meter__text">
            <span>Token Meter: <strong>14.2k / 100k</strong></span>
            <div className="gov-meter__bar">
              <div className="gov-meter__fill" style={{ width: '14.2%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
