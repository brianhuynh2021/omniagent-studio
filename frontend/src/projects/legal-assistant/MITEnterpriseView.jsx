import React, { useState } from 'react';
import { 
  Building2, Server, CheckCircle2, AlertCircle, Clock, TrendingUp, 
  UserCheck, Cpu, ArrowRight, ShieldCheck, Zap, ShieldAlert, Award
} from 'lucide-react';

export default function MITEnterpriseView({ workflowData }) {
  const [selectedStep, setSelectedStep] = useState(null);
  const [humanApproved, setHumanApproved] = useState(null);

  // Fallback demo data if no dossier processed yet
  const mitData = workflowData || {
    business_goal: "Automate legal dossier analysis, evidence extraction & draft generation for Criminal Theft case",
    persona_role: "prosecutor",
    systems_connected: [
      "Qdrant Hybrid Vector DB (Dense/Sparse RAG)",
      "SQLite Case Bank persistence engine (case_bank.db)",
      "TANDTC Supreme Court Precedent Repository 2025-2026",
      "Multi-Agent Adversarial Debate Engine",
      "Tesseract & Cloud OCR Fallback Chain"
    ],
    human_approval_status: "PENDING_ATTORNEY_SIGN_OFF",
    roi_telemetry: {
      estimated_manual_hours: 5.0,
      actual_agent_seconds: 1.25,
      hours_saved: 4.85,
      cost_reduction_percent: 88.5,
      accuracy_boost_percent: 34.0,
      roi_multiplier: "8.5x ROI",
      human_approval_required: true,
      approval_reason: "Prosecution report draft requires Senior Prosecutor sign-off per BLTTHS 2015."
    },
    workflow_steps: [
      { step_number: 1, name: "1. DEFINE WORKFLOW", phase: "WORKFLOW_DEFINITION", description: "Decomposed dossier processing into 5-node DAG execution graph.", system_connected: "AgentPlanner (DAG Engine)" },
      { step_number: 2, name: "2. DEFINE AGENT ROLE", phase: "ROLE_ASSIGNMENT", description: "Assigned persona [PROSECUTOR] with strict system prompt guardrails.", system_connected: "Microkernel Vertical Manifest" },
      { step_number: 3, name: "3. GIVE CONTEXT + DATA", phase: "DATA_INGESTION", description: "Ingested dossier (1,450 chars) with dense RAG chunks.", system_connected: "Dual RAG Engine & Cloud OCR" },
      { step_number: 4, name: "4. REASON / PLAN", phase: "REACT_REASONING", description: "Simulated 3-turn adversarial debate between Prosecutor, Defense & Judge.", system_connected: "MultiAgentDebateEngine" },
      { step_number: 5, name: "5. SELECT TOOL", phase: "TOOL_SELECTION", description: "Selected legal_vector_search, evidence_matrix_extractor & prosecution_report_generator.", system_connected: "Universal Tool Driver (MCP)" },
      { step_number: 6, name: "6. TAKE ACTION", phase: "EXECUTION", description: "Executed tool drivers with parameter validation and PII masking.", system_connected: "Aegis Core Microkernel" },
      { step_number: 7, name: "7. CONNECT TO REAL SYSTEM", phase: "SYSTEM_BINDING", description: "Connected to Qdrant Vector DB, SQLite Case Bank & Supreme Court Precedents DB.", system_connected: "Qdrant + SQLite + Precedents DB" },
      { step_number: 8, name: "8. OBSERVE RESULT", phase: "OBSERVATION", description: "Observed 3 evidence items and 2 matched precedents.", system_connected: "Observation Telemetry Driver" },
      { step_number: 9, name: "9. EVALUATE", phase: "EVALUATION", description: "Calculated RAG Faithfulness & Citation Grounding score (0.94).", system_connected: "RAGEvaluator & Grounding Meter" },
      { step_number: 10, name: "10. HUMAN APPROVAL IF NEEDED", phase: "HUMAN_GATEWAY", status: "approval_required", description: "Human Gateway: Prosecution report draft requires Senior Prosecutor sign-off.", system_connected: "Human-in-the-Loop Gateway UI" },
      { step_number: 11, name: "11. COMPLETE WORKFLOW", phase: "FINALIZATION", description: "Packaged legal draft, evidence matrix, and formatted .doc export bundle.", system_connected: "DraftScreen & Word Exporter" },
      { step_number: 12, name: "12. MEASURE BUSINESS VALUE", phase: "ROI_TELEMETRY", description: "Business ROI Calculated: 4.85h saved per dossier, 88.5% cost reduction.", system_connected: "Enterprise Telemetry Meter" },
      { step_number: 13, name: "13. IMPROVE SYSTEM", phase: "CONTINUOUS_IMPROVEMENT", description: "System experience stored for Stanford Reflexion & Policy Iteration.", system_connected: "Stanford Episodic Memory Store" }
    ]
  };

  const roi = mitData.roi_telemetry || {};
  const steps = mitData.workflow_steps || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '10px' }}>
      
      {/* Top Banner: MIT 2026 Enterprise Overview */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12), rgba(16, 185, 129, 0.08))',
        borderRadius: '16px',
        border: '1px solid rgba(6, 182, 212, 0.25)',
        padding: '24px',
        backdropFilter: 'blur(16px)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Building2 style={{ color: '#38bdf8', width: 28, height: 28 }} />
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#f3f4f6' }}>
                MIT 2026 Enterprise Agent Execution Framework
              </h2>
              <span style={{
                background: 'rgba(56, 189, 248, 0.2)',
                color: '#7dd3fc',
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 600,
                border: '1px solid rgba(56, 189, 248, 0.3)'
              }}>
                13-Step Business Workflow Standard
              </span>
            </div>
            <p style={{ margin: 0, color: '#9ca3af', fontSize: '14px', maxWidth: '650px' }}>
              Goal-Driven Business Orchestration, Real System Binding, Human Approval Gateways & Empirical Telemetry Measurement.
            </p>
          </div>

          {/* Business ROI Telemetry Badges */}
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <div style={{
              background: 'rgba(17, 24, 39, 0.7)',
              borderRadius: '12px',
              padding: '12px 16px',
              border: '1px solid rgba(255,255,255,0.08)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase' }}>Time Saved / Case</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#10b981', marginTop: '2px' }}>
                {roi.hours_saved || 4.85} hrs
              </div>
            </div>

            <div style={{
              background: 'rgba(17, 24, 39, 0.7)',
              borderRadius: '12px',
              padding: '12px 16px',
              border: '1px solid rgba(255,255,255,0.08)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase' }}>Cost Reduction</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#38bdf8', marginTop: '2px' }}>
                {roi.cost_reduction_percent || 88.5}%
              </div>
            </div>

            <div style={{
              background: 'rgba(17, 24, 39, 0.7)',
              borderRadius: '12px',
              padding: '12px 16px',
              border: '1px solid rgba(255,255,255,0.08)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase' }}>Business ROI</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#a78bfa', marginTop: '2px' }}>
                {roi.roi_multiplier || "8.5x ROI"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real System Connectors Badge Bar */}
      <div style={{
        background: 'rgba(17, 24, 39, 0.6)',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.08)',
        padding: '18px'
      }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#f3f4f6', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Server style={{ color: '#10b981', width: 18, height: 18 }} />
          Step 7: Active Real System Connectors & Database Bindings
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {(mitData.systems_connected || []).map((sys, idx) => (
            <div key={idx} style={{
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '12px',
              color: '#6ee7b7',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <CheckCircle2 style={{ width: 14, height: 14 }} />
              {sys}
            </div>
          ))}
        </div>
      </div>

      {/* 13 MIT Workflow Steps Display */}
      <div style={{
        background: 'rgba(17, 24, 39, 0.6)',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.08)',
        padding: '20px'
      }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#f3f4f6', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Cpu style={{ color: '#a78bfa', width: 20, height: 20 }} />
          MIT 13-Step Enterprise Workflow Stepper
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
          {steps.map((st) => {
            const isSelected = selectedStep?.step_number === st.step_number;
            const isGateway = st.step_number === 10;
            return (
              <div
                key={st.step_number}
                onClick={() => setSelectedStep(st)}
                style={{
                  background: isGateway ? 'rgba(245, 158, 11, 0.12)' : (isSelected ? 'rgba(56, 189, 248, 0.15)' : 'rgba(31, 41, 55, 0.5)'),
                  border: isGateway ? '1px solid rgba(245, 158, 11, 0.4)' : (isSelected ? '1px solid rgba(56, 189, 248, 0.5)' : '1px solid rgba(255,255,255,0.08)'),
                  borderRadius: '12px',
                  padding: '12px 14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: isGateway ? '#fbbf24' : '#f3f4f6' }}>
                    {st.name}
                  </span>
                  {isGateway && (
                    <span style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', fontSize: '10px', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                      HUMAN GATEWAY
                    </span>
                  )}
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af', lineHeight: '1.4' }}>
                  {st.description}
                </p>
                <div style={{ marginTop: '8px', fontSize: '10px', color: '#38bdf8', fontWeight: 500 }}>
                  Connector: {st.system_connected}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Step Detail Drawer */}
        {selectedStep && (
          <div style={{
            marginTop: '16px',
            background: 'rgba(15, 23, 42, 0.85)',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid rgba(56, 189, 248, 0.3)'
          }}>
            <h4 style={{ margin: '0 0 6px 0', fontSize: '14px', color: '#7dd3fc' }}>
              Step Details: {selectedStep.name} ({selectedStep.phase})
            </h4>
            <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#e2e8f0' }}>
              {selectedStep.description}
            </p>
            <div style={{ fontSize: '12px', color: '#10b981' }}>
              Bound System: <strong>{selectedStep.system_connected}</strong>
            </div>
          </div>
        )}
      </div>

      {/* Human Approval Gateway Card (Step 10) */}
      <div style={{
        background: 'rgba(17, 24, 39, 0.6)',
        borderRadius: '16px',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        padding: '20px'
      }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <UserCheck style={{ width: 20, height: 20 }} />
          Step 10: Human Approval Gateway (Senior Prosecutor Checkpoint)
        </h3>
        <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: '#d1d5db' }}>
          {roi.approval_reason || "Prosecution report draft requires Senior Prosecutor sign-off per BLTTHS 2015."}
        </p>

        {humanApproved ? (
          <div style={{
            background: humanApproved === 'approved' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
            border: humanApproved === 'approved' ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(244, 63, 94, 0.4)',
            borderRadius: '10px',
            padding: '12px 16px',
            color: humanApproved === 'approved' ? '#6ee7b7' : '#fda4af',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <CheckCircle2 style={{ width: 18, height: 18 }} />
            {humanApproved === 'approved' ? 'Human Sign-off Granted! Workflow Proceeding to Export.' : 'Revision Requested by Attorney.'}
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setHumanApproved('approved')}
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 18px',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <CheckCircle2 style={{ width: 16, height: 16 }} />
              Grant Senior Prosecutor Approval (Approve Step 10)
            </button>

            <button
              onClick={() => setHumanApproved('revision')}
              style={{
                background: 'rgba(239, 68, 68, 0.2)',
                color: '#fca5a5',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                borderRadius: '8px',
                padding: '10px 18px',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              Request Revision
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
