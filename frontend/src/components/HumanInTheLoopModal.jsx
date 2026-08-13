import React, { useState } from 'react';
import { ShieldAlert, CheckCircle, XCircle, FileCode, AlertTriangle, UserCheck, ArrowRight, Play, Eye } from 'lucide-react';

export default function HumanInTheLoopModal({ isOpen, onClose, pendingAction, onApprove, onReject }) {
  if (!isOpen) return null;

  const action = pendingAction || {
    id: "ACT-88492",
    agentName: "Legal Assistant AI OS",
    toolName: "database_sql_mutation",
    riskLevel: "HIGH",
    targetSystem: "Enterprise Legal DB",
    description: "Yêu cầu thực thi lệnh SQL cập nhật trạng thái Hợp đồng #HD-2026-883 từ DRAFT ➔ APPROVED",
    payload: {
      table: "contracts",
      action: "UPDATE",
      query: "UPDATE contracts SET status = 'APPROVED', approved_by = 'Legal AI Agent' WHERE contract_id = 'HD-2026-883';",
      parameters: { contract_id: "HD-2026-883", status: "APPROVED" }
    },
    guardrailCheck: "PASSED (No PII Leakage Detected)"
  };

  return (
    <div className="hitl-overlay" onClick={onClose}>
      <div className="hitl-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="hitl-header">
          <div className="hitl-header__title-group">
            <div className="hitl-header__icon">
              <UserCheck size={20} />
            </div>
            <div>
              <h3 className="hitl-header__title">Cổng Duyệt Phê Duyệt Tác Vụ (Human-in-the-Loop Gate)</h3>
              <p className="hitl-header__sub">Kiểm soát an toàn trước khi Agent thực thi hành động nhạy cảm</p>
            </div>
          </div>
          <button className="hitl-close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Modal Body */}
        <div className="hitl-body">
          {/* Risk Alert Pill */}
          <div className={`hitl-risk-banner hitl-risk-banner--${action.riskLevel.toLowerCase()}`}>
            <AlertTriangle size={18} />
            <div>
              <strong>Mức độ rủi ro tác vụ: {action.riskLevel} RISK</strong>
              <div>{action.description}</div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="hitl-grid">
            <div className="hitl-field">
              <span className="hitl-field__label">Agent yêu cầu:</span>
              <span className="hitl-field__value">{action.agentName}</span>
            </div>
            <div className="hitl-field">
              <span className="hitl-field__label">Công cụ gọi (Tool Call):</span>
              <span className="hitl-field__value code">{action.toolName}</span>
            </div>
            <div className="hitl-field">
              <span className="hitl-field__label">Hệ thống đích:</span>
              <span className="hitl-field__value">{action.targetSystem}</span>
            </div>
            <div className="hitl-field">
              <span className="hitl-field__label">Guardrail Compliance:</span>
              <span className="hitl-field__value success">✓ {action.guardrailCheck}</span>
            </div>
          </div>

          {/* Payload Inspection */}
          <div className="hitl-payload-box">
            <div className="hitl-payload-header">
              <FileCode size={15} />
              <span>Nội dung Payload & Lệnh đề xuất thực thi:</span>
            </div>
            <pre className="hitl-payload-code">
              {JSON.stringify(action.payload, null, 2)}
            </pre>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="hitl-footer">
          <button className="hitl-btn hitl-btn--reject" onClick={onReject}>
            <XCircle size={16} />
            <span>Từ Chối (Reject)</span>
          </button>
          <div className="hitl-footer__right">
            <button className="hitl-btn hitl-btn--approve" onClick={onApprove}>
              <CheckCircle size={16} />
              <span>Phê Duyệt & Cho Phép Thực Thi</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
