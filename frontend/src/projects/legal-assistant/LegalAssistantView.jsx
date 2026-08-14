import React, { useCallback, useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { legalTranslations } from './bilingual_dict';
import IntakeScreen from './IntakeScreen';
import ResultsScreen from './ResultsScreen';
import DraftScreen from './DraftScreen';




const API_BASE = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? "http://localhost:8001/api/v1/legal"
  : "/api/v1/legal";


const FALLBACK_TITLE = "Vụ án Trộm cắp tài sản & Lừa đảo chiếm đoạt tài sản - Nguyễn Văn A";
const FALLBACK_CONTENT = `HỒ SƠ VỤ ÁN HÌNH SỰ: NGUYỄN VĂN A
Ngày 15/05/2026, tại phường B, thành phố C, bị cáo Nguyễn Văn A (SN 1992, trú tại X) đã có hành vi lén lút đột nhập vào nhà bà Trần Thị B lấy trộm 1 chiếc xe máy Honda SH trị giá 85.000.000 VNĐ.
Sau khi trộm cắp, A mang xe đi làm giả giấy đăng ký và bán cho ông Lê Văn C với giá 50.000.000 VNĐ.
Vật chứng thu giữ: 01 xe máy Honda SH BKS 29A-12345, 01 giấy đăng ký xe giả, 01 kìm cộng lực.
Lời khai bị cáo: Nguyễn Văn A khai nhận do nợ nần bài bạc nên nảy sinh ý định trộm cắp. Tuy nhiên A giải trình đã bồi thường 30.000.000 VNĐ cho bà B và gia đình có công với cách mạng.
Lời khai người bị hại: Bà B xác nhận thời điểm mất tài sản vào khoảng 02h00 sáng và đã nhận một phần tiền bồi thường.
Căn cứ pháp lý áp dụng: Điều 173 Bộ luật Hình sự 2015 (Tội trộm cắp tài sản) và Điều 174 Bộ luật Hình sự 2015 (Tội lừa đảo chiếm đoạt tài sản).`;

export default function LegalAssistantView({ onAgentExecute, lang: externalLang, setLang: setExternalLang }) {
  const [internalLang, setInternalLang] = useState('vi');
  const lang = externalLang || internalLang;
  const setLang = setExternalLang || setInternalLang;
  const t = legalTranslations[lang] || legalTranslations.vi;

  const [screen, setScreen] = useState('intake'); // 'intake' | 'results' | 'draft'
  const [persona, setPersona] = useState('all_in_one');

  const [title, setTitle] = useState(FALLBACK_TITLE);
  const [content, setContent] = useState(FALLBACK_CONTENT);
  const [fileName, setFileName] = useState('');

  const [sampleCases, setSampleCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [draft, setDraft] = useState('');

  // Augmentations applied to the dossier after the first analysis.
  const [addedDocs, setAddedDocs] = useState([]);
  const [manualClauses, setManualClauses] = useState([]);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE}/sample-cases?lang=${lang}`)
      .then(res => res.json())
      .then(data => {
        if (cancelled || !Array.isArray(data) || data.length === 0) return;
        setSampleCases(data);
        // Preload the first sample so the app is runnable on open.
        if (!fileName) {
          setTitle(data[0].title);
          setContent(data[0].content);
        }
      })
      .catch(() => console.log("Backend loading or offline..."));
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  const runAnalysis = useCallback(async (targetPersona) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/process`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, lang, persona: targetPersona })
      });
      const data = await res.json();
      setResult(data);
      setDraft(data?.structured_data?.proposed_prosecution_draft || '');
      setScreen('results');
      setDirty(false);
      if (onAgentExecute) onAgentExecute(data);
    } catch (err) {
      console.error(err);
      alert("Không kết nối được API Backend. Hãy đảm bảo Backend đang chạy.");
    } finally {
      setLoading(false);
    }
  }, [title, content, lang, onAgentExecute]);

  const handlePersonaChange = (next) => {
    setPersona(next);
    // On the results screen, switching lens re-runs immediately.
    if (screen === 'results' && result) runAnalysis(next);
  };

  const handleSelectSample = (sample) => {
    setTitle(sample.title);
    setContent(sample.content);
    setFileName('');
  };

  // --- Augmenting an open dossier ---------------------------------

  const handleAddDocs = async (files) => {
    if (!files.length) return;
    try {
      const form = new FormData();
      files.forEach(f => form.append('files', f));
      const res = await fetch(`${API_BASE}/extract`, { method: 'POST', body: form });
      const data = await res.json();

      const ok = (data.results || []).filter(r => r.ok && r.text);
      const failed = (data.results || []).filter(r => !r.ok);

      if (ok.length) {
        setAddedDocs(prev => [...prev, ...ok.map(r => r.filename)]);
        setContent(prev => `${prev}\n\n${data.combined_text}`);
        setDirty(true);
      }
      if (failed.length) {
        alert(failed.map(r => `${r.filename}: ${r.error}`).join('\n'));
      }
    } catch (err) {
      console.error(err);
      alert(t.extractFailed);
    }
  };

  const handleRemoveDoc = (idx) => {
    setAddedDocs(prev => prev.filter((_, i) => i !== idx));
    setDirty(true);
  };

  const handleAddClause = (clause) => {
    setManualClauses(prev => [...prev, clause]);
    setContent(prev => `${prev}\n\n[CĂN CỨ BỔ SUNG]: ${clause}`);
    setDirty(true);
  };

  const handleRemoveClause = (idx) => {
    setManualClauses(prev => prev.filter((_, i) => i !== idx));
    setDirty(true);
  };

  const resetDossier = () => {
    setResult(null);
    setDraft('');
    setAddedDocs([]);
    setManualClauses([]);
    setDirty(false);
  };

  const handleLangChange = (next) => {
    setLang(next);
    resetDossier();
    setScreen('intake');
  };

  // Title follows the dossier: first meaningful line of pasted content.
  useEffect(() => {
    if (fileName) { setTitle(fileName.replace(/\.[^.]+$/, '')); return; }
    const firstLine = content.split('\n').map(l => l.trim()).find(Boolean);
    if (firstLine && !sampleCases.some(c => c.content === content)) {
      setTitle(firstLine.slice(0, 120));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, fileName]);

  const exportDraft = () => {
    const body = draft || result?.structured_data?.proposed_prosecution_draft || '';
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Legal Document</title></head><body>";
    const html = `${header}<pre style="font-family:'Times New Roman',serif;font-size:13pt;line-height:1.5;">${body.replace(/\n/g, '<br/>')}</pre></body></html>`;
    const blob = new Blob(['﻿', html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.slice(0, 40).replace(/\s+/g, '_')}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="legal-app">
      {loading && screen === 'intake' ? (
        <div className="legal-loading">
          <Loader2 size={26} className="legal-spin" />
          <div className="legal-loading__title">{t.loadingTitle}</div>
          <div className="legal-loading__sub">{t.loadingSub}</div>
        </div>
      ) : screen === 'intake' ? (
        <IntakeScreen
          t={t}
          title={title}
          content={content}
          setContent={setContent}
          fileName={fileName}
          setFileName={setFileName}
          persona={persona}
          setPersona={setPersona}
          loading={loading}
          onProcess={() => runAnalysis(persona)}
          sampleCases={sampleCases}
          onSelectSample={handleSelectSample}
        />
      ) : screen === 'results' ? (
        <ResultsScreen
          t={t}
          result={result}
          title={title}
          content={content}
          lang={lang}
          persona={persona}
          setPersona={handlePersonaChange}
          onBack={() => { resetDossier(); setScreen('intake'); }}
          onOpenDraft={() => setScreen('draft')}
          onExport={exportDraft}
          addedDocs={addedDocs}
          onAddDocs={handleAddDocs}
          onRemoveDoc={handleRemoveDoc}
          manualClauses={manualClauses}
          onAddClause={handleAddClause}
          onRemoveClause={handleRemoveClause}
          onReanalyze={() => runAnalysis(persona)}
          dirty={dirty}
          busy={loading}
        />
      ) : (
        <DraftScreen
          t={t}
          result={result}
          title={title}
          draft={draft}
          setDraft={setDraft}
          onBack={() => setScreen('results')}
        />
      )}
    </div>
  );
}

