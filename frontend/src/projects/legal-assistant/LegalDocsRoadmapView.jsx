import React, { useEffect, useState } from 'react';
import { BookOpen, Map, Layout, ShieldCheck, FileText, Layers, Building2 } from 'lucide-react';

const API_BASE = "http://localhost:8001/api/v1/legal";

export default function LegalDocsRoadmapView() {
  const [activeTab, setActiveTab] = useState('docs'); // 'docs' | 'mit' | 'roadmap' | 'prototype'
  const [docsData, setDocsData] = useState({ readme: '', compliance: '' });
  const [mitFramework, setMitFramework] = useState('');
  const [roadmapData, setRoadmapData] = useState('');
  const [prototypeSpec, setPrototypeSpec] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchAll = async () => {
      try {
        const [dRes, mRes, rRes, pRes] = await Promise.all([
          fetch(`${API_BASE}/docs`).then(r => r.json()),
          fetch(`${API_BASE}/mit-framework`).then(r => r.json()),
          fetch(`${API_BASE}/roadmap`).then(r => r.json()),
          fetch(`${API_BASE}/prototype-spec`).then(r => r.json())
        ]);
        if (!active) return;
        setDocsData(dRes);
        setMitFramework(mRes.framework || '');
        setRoadmapData(rRes.roadmap || '');
        setPrototypeSpec(pRes.spec || '');
      } catch (err) {
        console.error("Failed to fetch product docs/roadmap", err);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchAll();
    return () => { active = false; };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '10px' }}>
      
      {/* Tab Switcher Header */}
      <div style={{
        display: 'flex',
        gap: '12px',
        background: 'rgba(17, 24, 39, 0.7)',
        padding: '8px',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.08)'
      }}>
        <button
          onClick={() => setActiveTab('docs')}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '10px 16px',
            borderRadius: '8px',
            border: 'none',
            background: activeTab === 'docs' ? 'rgba(139, 92, 246, 0.25)' : 'transparent',
            color: activeTab === 'docs' ? '#c4b5fd' : '#9ca3af',
            fontWeight: activeTab === 'docs' ? 700 : 500,
            cursor: 'pointer'
          }}
        >
          <BookOpen style={{ width: 18, height: 18 }} />
          Product Docs & Compliance 2026
        </button>

        <button
          onClick={() => setActiveTab('mit')}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '10px 16px',
            borderRadius: '8px',
            border: 'none',
            background: activeTab === 'mit' ? 'rgba(56, 189, 248, 0.25)' : 'transparent',
            color: activeTab === 'mit' ? '#7dd3fc' : '#9ca3af',
            fontWeight: activeTab === 'mit' ? 700 : 500,
            cursor: 'pointer'
          }}
        >
          <Building2 style={{ width: 18, height: 18 }} />
          MIT 2026 Enterprise Framework
        </button>

        <button
          onClick={() => setActiveTab('roadmap')}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '10px 16px',
            borderRadius: '8px',
            border: 'none',
            background: activeTab === 'roadmap' ? 'rgba(6, 182, 212, 0.25)' : 'transparent',
            color: activeTab === 'roadmap' ? '#67e8f9' : '#9ca3af',
            fontWeight: activeTab === 'roadmap' ? 700 : 500,
            cursor: 'pointer'
          }}
        >
          <Map style={{ width: 18, height: 18 }} />
          2026 Product Roadmap
        </button>

        <button
          onClick={() => setActiveTab('prototype')}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '10px 16px',
            borderRadius: '8px',
            border: 'none',
            background: activeTab === 'prototype' ? 'rgba(16, 185, 129, 0.25)' : 'transparent',
            color: activeTab === 'prototype' ? '#6ee7b7' : '#9ca3af',
            fontWeight: activeTab === 'prototype' ? 700 : 500,
            cursor: 'pointer'
          }}
        >
          <Layout style={{ width: 18, height: 18 }} />
          Design Prototype Specs
        </button>
      </div>


      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>Loading specs...</div>
      ) : (
        <div>
          {/* Docs Tab */}
          {activeTab === 'docs' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
              <div style={{
                background: 'rgba(17, 24, 39, 0.6)',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.08)',
                padding: '20px'
              }}>
                <h3 style={{ color: '#f3f4f6', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText style={{ color: '#a78bfa' }} /> Product Technical Overview
                </h3>
                <pre style={{
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  color: '#d1d5db',
                  background: 'rgba(15, 23, 42, 0.6)',
                  padding: '16px',
                  borderRadius: '10px',
                  maxHeight: '500px',
                  overflowY: 'auto'
                }}>
                  {docsData.readme || "Product README loaded."}
                </pre>
              </div>

              <div style={{
                background: 'rgba(17, 24, 39, 0.6)',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.08)',
                padding: '20px'
              }}>
                <h3 style={{ color: '#f3f4f6', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck style={{ color: '#10b981' }} /> 2026 Legal AI Compliance Standard
                </h3>
                <pre style={{
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  color: '#d1d5db',
                  background: 'rgba(15, 23, 42, 0.6)',
                  padding: '16px',
                  borderRadius: '10px',
                  maxHeight: '500px',
                  overflowY: 'auto'
                }}>
                  {docsData.compliance || "Compliance specification loaded."}
                </pre>
              </div>
            </div>
          )}

          {/* MIT Enterprise Framework Tab */}
          {activeTab === 'mit' && (
            <div style={{
              background: 'rgba(17, 24, 39, 0.6)',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.08)',
              padding: '24px'
            }}>
              <h3 style={{ color: '#f3f4f6', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building2 style={{ color: '#38bdf8' }} /> MIT 2026 Enterprise Agent Execution Specification
              </h3>
              <pre style={{
                whiteSpace: 'pre-wrap',
                fontFamily: 'monospace',
                fontSize: '13px',
                color: '#e2e8f0',
                background: 'rgba(15, 23, 42, 0.7)',
                padding: '20px',
                borderRadius: '12px',
                lineHeight: '1.6'
              }}>
                {mitFramework || "MIT Enterprise Framework Specification loaded."}
              </pre>
            </div>
          )}

          {/* Roadmap Tab */}
          {activeTab === 'roadmap' && (

            <div style={{
              background: 'rgba(17, 24, 39, 0.6)',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.08)',
              padding: '24px'
            }}>
              <h3 style={{ color: '#f3f4f6', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Map style={{ color: '#06b6d4' }} /> Legal AI OS 2026 Strategic Roadmap
              </h3>
              <pre style={{
                whiteSpace: 'pre-wrap',
                fontFamily: 'monospace',
                fontSize: '13px',
                color: '#e2e8f0',
                background: 'rgba(15, 23, 42, 0.7)',
                padding: '20px',
                borderRadius: '12px',
                lineHeight: '1.6'
              }}>
                {roadmapData || "Roadmap loaded."}
              </pre>
            </div>
          )}

          {/* Prototype Specs Tab */}
          {activeTab === 'prototype' && (
            <div style={{
              background: 'rgba(17, 24, 39, 0.6)',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.08)',
              padding: '24px'
            }}>
              <h3 style={{ color: '#f3f4f6', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layout style={{ color: '#10b981' }} /> Glassmorphism UI & Prototype Specs
              </h3>
              <pre style={{
                whiteSpace: 'pre-wrap',
                fontFamily: 'monospace',
                fontSize: '13px',
                color: '#e2e8f0',
                background: 'rgba(15, 23, 42, 0.7)',
                padding: '20px',
                borderRadius: '12px',
                lineHeight: '1.6'
              }}>
                {prototypeSpec || "Prototype Spec loaded."}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
