import React, { useState } from 'react';
import { 
import { apiBase } from '../../api';
  Brain, CheckCircle2, AlertTriangle, RefreshCw, Database, 
  Sparkles, Award, ShieldCheck, ArrowRight, Send, Check, Layers
} from 'lucide-react';

const API_BASE = apiBase("/api/v1/legal");

export default function StanfordAgent2026Debugger({ reflectionData, caseId = "case_01" }) {
  const [selectedStep, setSelectedStep] = useState(null);
  const [rating, setRating] = useState(5);
  const [correctionText, setCorrectionText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedFeedback, setSubmittedFeedback] = useState(null);

  // Fallback demo reflection data if none passed yet
  const reflection = reflectionData || {
    task_understanding: "Prosecution report generation & evidence extraction for Criminal Theft case",
    retrieved_context_summary: "Retrieved 4 legal context passages and precedent benchmarks.",
    plan_steps: [
      "Extract evidence matrix & probative value",
      "Classify crime & matching statutory articles",
      "Evaluate TANDTC 2026 Supreme Court Precedents",
      "Draft legal opinion / prosecution report"
    ],
    actions_taken: ["evidence_matrix_extractor", "legal_vector_search", "prosecution_report_generator"],
    verification_status: "CORRECT",
    citation_grounding_score: 0.94,
    evidence_completeness_score: 1.0,
    reflection_notes: ["Output fully grounded; verified Articles 173 & 174 BLHS 2015 without hallucination."],
    replan_count: 0,
    evaluation_score: 96.4,
    experience_stored: true,
    agent_improved: true,
    trajectory_flow: [
      { step_id: 1, name: "1. UNDERSTAND TASK", status: "completed", description: "Parsed goal for persona 'prosecutor' on case title." },
      { step_id: 2, name: "2. RETRIEVE CONTEXT", status: "completed", description: "Fetched dense RAG chunks & TANDTC Precedents 2026." },
      { step_id: 3, name: "3. PLAN", status: "completed", description: "Generated 4-stage ReAct graph." },
      { step_id: 4, name: "4. CHOOSE ACTION", status: "completed", description: "Selected evidence extractor & RAG vector search tools." },
      { step_id: 5, name: "5. USE TOOL", status: "completed", description: "Executed tool drivers with Qdrant vector DB." },
      { step_id: 6, name: "6. OBSERVE", status: "completed", description: "Observed 3 evidence items and 2 statutory citations." },
      { step_id: 7, name: "7. VERIFY", status: "completed", description: "Passed zero-hallucination citation threshold (Score: 0.94)." },
      { step_id: 10, name: "10. RESULT", status: "completed", description: "Produced verified legal dossier output." },
      { step_id: 11, name: "11. EVAL", status: "completed", description: "Calculated Stanford Quality Score: 96.4/100." },
      { step_id: 12, name: "12. STORE EXPERIENCE", status: "completed", description: "Persisted trajectory into Episodic Memory Store." },
      { step_id: 13, name: "13. IMPROVE AGENT", status: "completed", description: "Updated global agent guidelines & weakness profile." }
    ]
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/self-improve/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          case_id: caseId,
          rating: Number(rating),
          attorney_correction: correctionText
        })
      });
      const data = await res.json();
      setSubmittedFeedback(data);
    } catch (err) {
      console.error(err);
      alert("Error submitting feedback.");
    } finally {
      setSubmitting(false);
    }
  };

  const activeTrajectory = reflection.trajectory_flow || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '10px' }}>
      
      {/* Top Banner: Stanford 2026 Overview */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12), rgba(6, 182, 212, 0.08))',
        borderRadius: '16px',
        border: '1px solid rgba(139, 92, 246, 0.25)',
        padding: '24px',
        backdropFilter: 'blur(16px)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Brain style={{ color: '#a78bfa', width: 28, height: 28 }} />
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#f3f4f6' }}>
                Stanford 2026 Self-Improving Agent Framework
              </h2>
              <span style={{
                background: 'rgba(167, 139, 250, 0.2)',
                color: '#c4b5fd',
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 600,
                border: '1px solid rgba(167, 139, 250, 0.3)'
              }}>
                13-Step Reflexion Loop
              </span>
            </div>
            <p style={{ margin: 0, color: '#9ca3af', fontSize: '14px', maxWidth: '650px' }}>
              Continuous Policy Iteration, Grounding Verification, and Episodic Memory Store based on Stanford 2026 Agentic Research.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{
              background: 'rgba(17, 24, 39, 0.7)',
              borderRadius: '12px',
              padding: '12px 18px',
              border: '1px solid rgba(255,255,255,0.08)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', tracking: '0.05em' }}>Quality Score</div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#10b981', marginTop: '2px' }}>
                {reflection.evaluation_score}<span style={{ fontSize: '13px', color: '#6b7280' }}>/100</span>
              </div>
            </div>

            <div style={{
              background: 'rgba(17, 24, 39, 0.7)',
              borderRadius: '12px',
              padding: '12px 18px',
              border: '1px solid rgba(255,255,255,0.08)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase' }}>Citation Grounding</div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#3b82f6', marginTop: '2px' }}>
                {Math.round((reflection.citation_grounding_score || 0.9) * 100)}%
              </div>
            </div>

            <div style={{
              background: 'rgba(17, 24, 39, 0.7)',
              borderRadius: '12px',
              padding: '12px 18px',
              border: '1px solid rgba(255,255,255,0.08)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase' }}>Status</div>
              <div style={{
                fontSize: '13px',
                fontWeight: 700,
                color: reflection.verification_status === "CORRECT" ? '#10b981' : '#f59e0b',
                marginTop: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                {reflection.verification_status === "CORRECT" ? (
                  <><CheckCircle2 style={{ width: 16, height: 16 }} /> VERIFIED</>
                ) : (
                  <><RefreshCw style={{ width: 16, height: 16 }} /> REFLECTED</>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 13-Step Trajectory Flow Visualizer */}
      <div style={{
        background: 'rgba(17, 24, 39, 0.6)',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.08)',
        padding: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '16px', color: '#f3f4f6', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers style={{ color: '#06b6d4', width: 20, height: 20 }} />
            13-Step Agent Reasoning & Self-Correction Flow
          </h3>
          <span style={{ fontSize: '12px', color: '#6b7280' }}>
            Replan Cycles: <strong style={{ color: '#f59e0b' }}>{reflection.replan_count || 0}</strong>
          </span>
        </div>

        {/* Step Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '12px'
        }}>
          {activeTrajectory.map((step) => {
            const isSelected = selectedStep?.step_id === step.step_id;
            let badgeBg = 'rgba(16, 185, 129, 0.15)';
            let badgeBorder = 'rgba(16, 185, 129, 0.3)';
            let badgeText = '#10b981';

            if (step.status === 'wrong') {
              badgeBg = 'rgba(244, 63, 94, 0.15)';
              badgeBorder = 'rgba(244, 63, 94, 0.3)';
              badgeText = '#f43f5e';
            } else if (step.status === 'reflected') {
              badgeBg = 'rgba(245, 158, 11, 0.15)';
              badgeBorder = 'rgba(245, 158, 11, 0.3)';
              badgeText = '#f59e0b';
            }

            return (
              <div
                key={step.step_id}
                onClick={() => setSelectedStep(step)}
                style={{
                  background: isSelected ? 'rgba(139, 92, 246, 0.15)' : 'rgba(31, 41, 55, 0.5)',
                  border: isSelected ? '1px solid rgba(139, 92, 246, 0.5)' : `1px solid ${badgeBorder}`,
                  borderRadius: '12px',
                  padding: '12px 14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#f3f4f6' }}>
                    {step.name}
                  </span>
                  <span style={{
                    background: badgeBg,
                    color: badgeText,
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: '6px'
                  }}>
                    {step.status.toUpperCase()}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af', lineHeight: '1.4' }}>
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Selected Step Detail Panel */}
        {selectedStep && (
          <div style={{
            marginTop: '16px',
            background: 'rgba(15, 23, 42, 0.8)',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid rgba(139, 92, 246, 0.3)'
          }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#c4b5fd' }}>
              Step Details: {selectedStep.name}
            </h4>
            <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#e2e8f0' }}>
              {selectedStep.description}
            </p>
            <pre style={{
              margin: 0,
              background: 'rgba(0,0,0,0.4)',
              padding: '10px',
              borderRadius: '8px',
              color: '#38bdf8',
              fontSize: '11px',
              overflowX: 'auto'
            }}>
              {JSON.stringify(selectedStep.details || {}, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Reflexion & Human-in-the-Loop Feedback Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '20px'
      }}>
        {/* Left: Reflexion Audit Notes */}
        <div style={{
          background: 'rgba(17, 24, 39, 0.6)',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.08)',
          padding: '20px'
        }}>
          <h3 style={{ margin: '0 0 14px 0', fontSize: '16px', color: '#f3f4f6', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck style={{ color: '#10b981', width: 20, height: 20 }} />
            Zero-Hallucination Grounding Audit
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {(reflection.reflection_notes || []).map((note, idx) => (
              <div key={idx} style={{
                background: 'rgba(31, 41, 55, 0.5)',
                borderRadius: '10px',
                padding: '12px 14px',
                borderLeft: '4px solid #10b981',
                color: '#d1d5db',
                fontSize: '13px'
              }}>
                {note}
              </div>
            ))}
          </div>

          <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '6px' }}>Task Understanding:</div>
            <div style={{ fontSize: '13px', color: '#e5e7eb', fontWeight: 500 }}>
              {reflection.task_understanding}
            </div>
          </div>
        </div>

        {/* Right: Human Attorney Feedback & Experience Store Form */}
        <div style={{
          background: 'rgba(17, 24, 39, 0.6)',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.08)',
          padding: '20px'
        }}>
          <h3 style={{ margin: '0 0 14px 0', fontSize: '16px', color: '#f3f4f6', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database style={{ color: '#a78bfa', width: 20, height: 20 }} />
            Human-in-the-Loop Episodic Memory Store
          </h3>

          {submittedFeedback ? (
            <div style={{
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '12px',
              padding: '16px',
              color: '#6ee7b7'
            }}>
              <div style={{ fontWeight: 700, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 style={{ width: 18, height: 18 }} />
                Feedback Persisted to Memory Store!
              </div>
              <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: '#a7f3d0' }}>
                {submittedFeedback.message}
              </p>
              <div style={{ marginTop: '10px', fontSize: '12px', color: '#d1fae5' }}>
                Updated Guidelines Count: <strong>{submittedFeedback.improved_guidelines_count}</strong>
              </div>
            </div>
          ) : (
            <form onSubmit={handleFeedbackSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#9ca3af', display: 'block', marginBottom: '6px' }}>
                  Attorney Quality Rating (1 to 5 Stars):
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      style={{
                        background: rating >= star ? 'rgba(245, 158, 11, 0.2)' : 'rgba(31, 41, 55, 0.6)',
                        border: rating >= star ? '1px solid rgba(245, 158, 11, 0.5)' : '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '8px',
                        padding: '6px 12px',
                        color: rating >= star ? '#fbbf24' : '#6b7280',
                        cursor: 'pointer',
                        fontWeight: 700
                      }}
                    >
                      ★ {star}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#9ca3af', display: 'block', marginBottom: '6px' }}>
                  Attorney Correction / Precedent Nuance (Optional):
                </label>
                <textarea
                  value={correctionText}
                  onChange={(e) => setCorrectionText(e.target.value)}
                  placeholder="e.g., Thêm tình tiết giảm nhẹ bồi thường thiệt hại theo Điểm b Khoản 1 Điều 51 BLHS 2015..."
                  rows={3}
                  style={{
                    width: '100%',
                    background: 'rgba(15, 23, 42, 0.7)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    padding: '10px',
                    color: '#f3f4f6',
                    fontSize: '13px',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '12px 18px',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {submitting ? (
                  <>Storing Experience...</>
                ) : (
                  <>
                    <Send style={{ width: 16, height: 16 }} />
                    Store Experience & Improve Agent (Step 12 & 13)
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
