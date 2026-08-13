import React, { useRef, useState } from 'react';
import { UploadCloud, ChevronDown, ArrowRight, FileText, X, Loader2, AlertTriangle } from 'lucide-react';

const API_BASE = "http://localhost:8001/api/v1/legal";

const PERSONA_KEYS = ['all_in_one', 'lawyer', 'judge', 'prosecutor', 'corporate'];

// Sample categories carry a qualifier after a dash or in parentheses
// ("Hình sự - Trộm cắp & Lừa đảo"); the distinctive half is enough here.
const shortLabel = (category) =>
  category.split(/\s[-–]\s/).pop().replace(/\s*\(.*\)$/, '').trim();

export default function IntakeScreen({
  t,
  title,
  content,
  setContent,
  fileName,
  setFileName,
  persona,
  setPersona,
  loading,
  onProcess,
  sampleCases,
  onSelectSample
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [pasteOpen, setPasteOpen] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [extractErrors, setExtractErrors] = useState([]);
  const fileInputRef = useRef(null);

  const hasContent = content.trim().length > 0;

  const ingestFiles = async (files) => {
    if (!files.length) return;
    setExtracting(true);
    setExtractErrors([]);

    try {
      const form = new FormData();
      files.forEach(f => form.append('files', f));
      const res = await fetch(`${API_BASE}/extract`, { method: 'POST', body: form });
      const data = await res.json();

      const failed = (data.results || []).filter(r => !r.ok);
      setExtractErrors(failed.map(r => `${r.filename}: ${r.error}`));

      const ok = (data.results || []).filter(r => r.ok && r.text);
      if (ok.length) {
        setFileName(ok.map(r => r.filename).join(', '));
        setContent(prev =>
          prev.trim() ? `${prev}\n\n${data.combined_text}` : data.combined_text
        );
      }
    } catch (err) {
      console.error(err);
      setExtractErrors([t.extractFailed]);
    } finally {
      setExtracting(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    ingestFiles(Array.from(e.dataTransfer.files));
  };

  const clearDossier = () => {
    setFileName('');
    setContent('');
    setPasteOpen(false);
  };

  return (
    <div className="legal-intake">
      <div className="legal-intake__lede">
        <h1 className="legal-intake__title">{t.intakeTitle}</h1>
        <p className="legal-intake__sub">{t.intakeSub}</p>
      </div>

      <div
        className={`legal-drop ${isDragOver ? 'is-over' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        role="button"
        tabIndex={0}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.txt,.png,.jpg,.jpeg"
          onChange={(e) => ingestFiles(Array.from(e.target.files))}
          style={{ display: 'none' }}
        />
        <div className="legal-drop__icon">
          {extracting ? <Loader2 size={26} className="legal-spin" /> : <UploadCloud size={26} />}
        </div>
        <div className="legal-drop__title">{extracting ? t.extracting : t.dropTitle}</div>
        <div className="legal-drop__hint">{extracting ? t.extractingHint : t.dropHint}</div>
        {!extracting && <div className="legal-drop__formats">{t.dropFormats}</div>}

        {extractErrors.length > 0 && (
          <div className="legal-drop__errors" onClick={(e) => e.stopPropagation()}>
            {extractErrors.map((msg, i) => (
              <div key={i} className="legal-drop__error">
                <AlertTriangle size={13} /> <span>{msg}</span>
              </div>
            ))}
          </div>
        )}

        {hasContent && (
          <div className="legal-drop__loaded" onClick={(e) => e.stopPropagation()}>
            <FileText size={15} color="#059669" />
            <span className="legal-drop__loaded-name">{fileName || title}</span>
            <button
              className="legal-drop__loaded-clear"
              onClick={clearDossier}
              aria-label={t.clearFile}
              title={t.clearFile}
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      <div className="legal-or">{t.orPaste}</div>
      <button
        className="legal-paste-toggle"
        onClick={() => setPasteOpen(v => !v)}
        aria-expanded={pasteOpen}
        aria-controls="legal-paste-area"
      >
        {t.pasteToggle} <ChevronDown size={14} />
      </button>

      {pasteOpen && (
        <textarea
          id="legal-paste-area"
          className="legal-paste-area"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={t.pastePlaceholder}
          aria-label={t.pasteToggle}
          autoFocus
        />
      )}

      <div className="legal-actions">
        <div className="legal-role">
          <label className="legal-label" htmlFor="legal-role-select">{t.roleLabel}</label>
          <div className="legal-select">
            <select
              id="legal-role-select"
              value={persona}
              onChange={(e) => setPersona(e.target.value)}
            >
              {PERSONA_KEYS.map(k => (
                <option key={k} value={k}>{t.personas[k].name}</option>
              ))}
            </select>
            <ChevronDown size={15} />
          </div>
          <p className="legal-role__desc">{t.personas[persona].desc}</p>
        </div>

        <button
          className="legal-run"
          onClick={onProcess}
          disabled={loading || !hasContent}
        >
          {loading
            ? <><Loader2 size={17} className="legal-spin" /> {t.btnProcessing}</>
            : <>{t.btnProcess} <ArrowRight size={17} /></>}
        </button>
      </div>

      {sampleCases.length > 0 && (
        <div className="legal-samples">
          <span>{t.samplesLabel}</span>
          {sampleCases.map((c, i) => (
            <React.Fragment key={c.id}>
              {i > 0 && <span className="legal-samples__sep">·</span>}
              <button
                className="legal-samples__btn"
                onClick={() => onSelectSample(c)}
                title={c.category}
              >
                {shortLabel(c.category)}
              </button>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
