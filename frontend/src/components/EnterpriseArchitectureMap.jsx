import React, { useState } from 'react';
import { Cpu, ShieldCheck, Database, Layers, Network, Zap, Lock, Activity, CheckCircle2, AlertTriangle, ArrowRight, Eye, RefreshCw } from 'lucide-react';

export default function EnterpriseArchitectureMap({ systemInfo }) {
  const [selectedNode, setSelectedNode] = useState('kernel');

  const nodeDetails = {
    user_space: {
      title: "User Space - Specialized Business Apps",
      badge: "Multi-Tenant Ecosystem",
      desc: "Không gian ứng dụng thương mại được cách ly hoàn toàn khỏi Lõi Kernel. Mỗi ứng dụng định nghĩa quy trình, bộ prompt và quyền truy cập riêng thông via Manifest Protocol.",
      components: [
        "Legal Assistant AI OS (Bilingual VI/EN & Án lệ TANDTC)",
        "Enterprise Document RAG (Multi-Tenant Doc Intel)",
        "AI Marketing & Commerce (Omni-Channel Content)",
        "AI Support & Booking Agent (24/7 Escalation)",
        "Engineering Architecture Reasoner (OpenAPI & Code Audit)"
      ]
    },
    kernel: {
      title: "Kernel Space - Aegis Core Agentic Engine",
      badge: "Microkernel Architecture",
      desc: "Lõi điều hành AI tập trung chịu trách nhiệm định tuyến ý định (Supervisor Router), vòng lặp suy luận ReAct, quản lý bộ nhớ ngắn/dài hạn và kiểm soát an toàn bảo mật.",
      components: [
        "1. LLM Context Gateway & Model Router (OpenAI / Claude / Gemini / Local)",
        "2. Dual Memory Subsystem (Episodic Chat Memory + GraphRAG)",
        "3. Multi-Agent ReAct Engine (Thought ➔ Action ➔ Observation)",
        "4. Multi-Tenant Guardrails & PII Sanitization",
        "5. Token Metering & Cost Billing Engine"
      ]
    },
    mcp_gateway: {
      title: "MCP Universal Driver & Manifest Protocol",
      badge: "Open Protocol Standard",
      desc: "Giao thức tiêu chuẩn kết nối Kernel với các công cụ bên ngoài và ứng dụng người dùng. Cho phép plug-and-play các MCP Server mới mà không cần sửa code lõi.",
      components: [
        "Declarative Manifest Loader (plugin_protocol.py)",
        "Tool Registry & Schema Auto-discovery",
        "Permission Sandboxing & Scope Enforcement",
        "Model Context Protocol (MCP) Standard Client"
      ]
    },
    tools_db: {
      title: "Tools & Infrastructure Layer",
      badge: "Distributed Drivers",
      desc: "Tầng cơ sở hạ tầng lưu trữ và các công cụ thực thi mã an toàn.",
      components: [
        "Qdrant Hybrid Vector Store (Dense + Sparse Retrieval)",
        "Local Tesseract OCR & Cloud Vision Adapters",
        "Python Code Execution Sandbox",
        "SQL Data Query Engine & PostgreSQL DB"
      ]
    }
  };

  const activeDetail = nodeDetails[selectedNode] || nodeDetails.kernel;

  return (
    <div className="arch-map-container">
      {/* Top Banner / Header */}
      <div className="arch-header">
        <div className="arch-header__title-group">
          <div className="arch-header__icon-box">
            <Network size={22} />
          </div>
          <div>
            <h3 className="arch-header__title">Sơ Đồ Kiến Trúc Lõi Aegis Microkernel Agent OS</h3>
            <p className="arch-header__sub">Hệ sinh thái AI Doanh nghiệp phân lớp (Layered Ecosystem Architecture)</p>
          </div>
        </div>
        <div className="arch-header__badges">
          <span className="arch-status-pill arch-status-pill--active">
            <span className="arch-dot"></span> Kernel Status: ONLINE
          </span>
          <span className="arch-status-pill">
            <ShieldCheck size={13} /> Guardrails: ACTIVE
          </span>
        </div>
      </div>

      {/* SVG Diagram Canvas */}
      <div className="arch-diagram-card">
        <div className="arch-svg-wrapper">
          <svg className="arch-svg" viewBox="0 0 960 480" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="userSpaceGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0.08" />
              </linearGradient>
              <linearGradient id="kernelSpaceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#312e81" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0.25" />
              </linearGradient>
              <linearGradient id="toolsSpaceGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#059669" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0.08" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Layer 1: USER SPACE */}
            <g onClick={() => setSelectedNode('user_space')} className="arch-node-group">
              <rect x="30" y="20" width="900" height="90" rx="14" fill="url(#userSpaceGrad)" stroke={selectedNode === 'user_space' ? '#4f46e5' : '#cbd5e1'} strokeWidth={selectedNode === 'user_space' ? '2' : '1'} />
              <text x="50" y="45" fill="#4f46e5" fontSize="11" fontWeight="700" letterSpacing="0.05em">USER SPACE (SPECIALIZED BUSINESS APPS ECOSYSTEM)</text>
              
              {/* App Pills */}
              <g transform="translate(50, 55)">
                <rect x="0" y="0" width="160" height="42" rx="8" fill="#ffffff" stroke="#e2e8f0" />
                <text x="14" y="25" fill="#1e293b" fontSize="12" fontWeight="600">⚖️ Legal AI OS</text>
              </g>
              <g transform="translate(220, 55)">
                <rect x="0" y="0" width="160" height="42" rx="8" fill="#ffffff" stroke="#e2e8f0" />
                <text x="14" y="25" fill="#1e293b" fontSize="12" fontWeight="600">🏢 Doc RAG Intel</text>
              </g>
              <g transform="translate(390, 55)">
                <rect x="0" y="0" width="160" height="42" rx="8" fill="#ffffff" stroke="#e2e8f0" />
                <text x="14" y="25" fill="#1e293b" fontSize="12" fontWeight="600">📢 AI Marketing</text>
              </g>
              <g transform="translate(560, 55)">
                <rect x="0" y="0" width="160" height="42" rx="8" fill="#ffffff" stroke="#e2e8f0" />
                <text x="14" y="25" fill="#1e293b" fontSize="12" fontWeight="600">🎧 Support & Booking</text>
              </g>
              <g transform="translate(730, 55)">
                <rect x="0" y="0" width="160" height="42" rx="8" fill="#ffffff" stroke="#e2e8f0" />
                <text x="14" y="25" fill="#1e293b" fontSize="12" fontWeight="600">💻 Dev Architect</text>
              </g>
            </g>

            {/* Connectors 1 -> 2 */}
            <path d="M 480 110 L 480 140" stroke="#818cf8" strokeWidth="2" strokeDasharray="4 4" />
            <circle cx="480" cy="125" r="4" fill="#4f46e5" filter="url(#glow)" />

            {/* Gateway Box */}
            <g onClick={() => setSelectedNode('mcp_gateway')} className="arch-node-group">
              <rect x="250" y="135" width="460" height="35" rx="8" fill="#ffffff" stroke={selectedNode === 'mcp_gateway' ? '#4f46e5' : '#94a3b8'} strokeWidth="1.5" />
              <text x="480" y="157" fill="#4338ca" fontSize="11" fontWeight="700" textAnchor="middle">
                ⚡ DECLARATIVE MANIFEST & MODEL CONTEXT PROTOCOL (MCP) GATEWAY
              </text>
            </g>

            <path d="M 480 170 L 480 195" stroke="#818cf8" strokeWidth="2" />

            {/* Layer 2: KERNEL SPACE */}
            <g onClick={() => setSelectedNode('kernel')} className="arch-node-group">
              <rect x="30" y="195" width="900" height="175" rx="14" fill="url(#kernelSpaceGrad)" stroke={selectedNode === 'kernel' ? '#6366f1' : '#475569'} strokeWidth={selectedNode === 'kernel' ? '2.5' : '1'} />
              <text x="50" y="222" fill="#818cf8" fontSize="12" fontWeight="700" letterSpacing="0.06em">KERNEL SPACE (AEGIS AGENTIC CORE ENGINE)</text>

              {/* Submodule Cards */}
              <g transform="translate(50, 235)">
                <rect x="0" y="0" width="260" height="55" rx="8" fill="#ffffff" stroke="#e2e8f0" />
                <text x="14" y="24" fill="#0f172a" fontSize="12" fontWeight="700">1. LLM Context Gateway</text>
                <text x="14" y="42" fill="#64748b" fontSize="10">Multi-Model Provider Router</text>
              </g>

              <g transform="translate(350, 235)">
                <rect x="0" y="0" width="260" height="55" rx="8" fill="#ffffff" stroke="#e2e8f0" />
                <text x="14" y="24" fill="#0f172a" fontSize="12" fontWeight="700">2. Dual Memory Subsystem</text>
                <text x="14" y="42" fill="#64748b" fontSize="10">Episodic + GraphRAG Vector</text>
              </g>

              <g transform="translate(650, 235)">
                <rect x="0" y="0" width="240" height="55" rx="8" fill="#ffffff" stroke="#e2e8f0" />
                <text x="14" y="24" fill="#0f172a" fontSize="12" fontWeight="700">3. ReAct Scheduler</text>
                <text x="14" y="42" fill="#64748b" fontSize="10">Thought ➔ Action ➔ Observation</text>
              </g>

              <g transform="translate(50, 300)">
                <rect x="0" y="0" width="260" height="55" rx="8" fill="#ffffff" stroke="#e2e8f0" />
                <text x="14" y="24" fill="#0f172a" fontSize="12" fontWeight="700">4. Universal Tool Driver</text>
                <text x="14" y="42" fill="#64748b" fontSize="10">MCP Standard Adapter Protocol</text>
              </g>

              <g transform="translate(350, 300)">
                <rect x="0" y="0" width="260" height="55" rx="8" fill="#ffffff" stroke="#e2e8f0" />
                <text x="14" y="24" fill="#0f172a" fontSize="12" fontWeight="700">5. Multi-Tenant Security</text>
                <text x="14" y="42" fill="#64748b" fontSize="10">PII Sanitizer & Groundness Check</text>
              </g>

              <g transform="translate(650, 300)">
                <rect x="0" y="0" width="240" height="55" rx="8" fill="#ffffff" stroke="#e2e8f0" />
                <text x="14" y="24" fill="#0f172a" fontSize="12" fontWeight="700">6. Metering & Billing</text>
                <text x="14" y="42" fill="#64748b" fontSize="10">Token Cost Governance & Quota</text>
              </g>
            </g>

            {/* Connectors 2 -> 3 */}
            <path d="M 480 370 L 480 395" stroke="#10b981" strokeWidth="2" strokeDasharray="4 4" />

            {/* Layer 3: TOOLS & INFRASTRUCTURE */}
            <g onClick={() => setSelectedNode('tools_db')} className="arch-node-group">
              <rect x="30" y="395" width="900" height="70" rx="14" fill="url(#toolsSpaceGrad)" stroke={selectedNode === 'tools_db' ? '#059669' : '#cbd5e1'} strokeWidth={selectedNode === 'tools_db' ? '2' : '1'} />
              <text x="50" y="415" fill="#047857" fontSize="11" fontWeight="700" letterSpacing="0.05em">TOOLS & INFRASTRUCTURE DRIVERS</text>

              <g transform="translate(50, 423)">
                <rect x="0" y="0" width="200" height="32" rx="6" fill="#ffffff" stroke="#e2e8f0" />
                <text x="12" y="20" fill="#0f172a" fontSize="11" fontWeight="600">📊 Qdrant Hybrid RAG</text>
              </g>
              <g transform="translate(270, 423)">
                <rect x="0" y="0" width="200" height="32" rx="6" fill="#ffffff" stroke="#e2e8f0" />
                <text x="12" y="20" fill="#0f172a" fontSize="11" fontWeight="600">🌐 Web & Search Engine</text>
              </g>
              <g transform="translate(490, 423)">
                <rect x="0" y="0" width="200" height="32" rx="6" fill="#ffffff" stroke="#e2e8f0" />
                <text x="12" y="20" fill="#0f172a" fontSize="11" fontWeight="600">🐍 Python Execution Sandbox</text>
              </g>
              <g transform="translate(710, 423)">
                <rect x="0" y="0" width="180" height="32" rx="6" fill="#ffffff" stroke="#e2e8f0" />
                <text x="12" y="20" fill="#0f172a" fontSize="11" fontWeight="600">🗄️ SQL & Enterprise DB</text>
              </g>
            </g>
          </svg>
        </div>
      </div>

      {/* Interactive Detail Drawer / Box */}
      <div className="arch-detail-box">
        <div className="arch-detail-box__header">
          <div className="arch-detail-box__title-wrap">
            <h4 className="arch-detail-box__title">{activeDetail.title}</h4>
            <span className="arch-detail-box__badge">{activeDetail.badge}</span>
          </div>
          <span className="arch-detail-box__hint">Nhấn vào phân vùng trên sơ đồ để xem thông tin chi tiết</span>
        </div>
        <p className="arch-detail-box__desc">{activeDetail.desc}</p>

        <div className="arch-detail-box__components">
          <div className="arch-detail-box__subhead">Thành phần cốt lõi:</div>
          <div className="arch-detail-box__grid">
            {activeDetail.components.map((c, i) => (
              <div key={i} className="arch-detail-item">
                <CheckCircle2 size={15} className="arch-detail-icon" />
                <span>{c}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
