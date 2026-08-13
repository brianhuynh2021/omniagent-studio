import React, { useEffect, useState } from 'react';
import { ArrowLeft, Copy, Check, Download, Plus } from 'lucide-react';

export default function DraftScreen({ t, result, title, onBack, draft, setDraft }) {
  const [copied, setCopied] = useState(false);
  const data = result.structured_data;

  useEffect(() => {
    if (data?.proposed_prosecution_draft && !draft) {
      setDraft(data.proposed_prosecution_draft);
    }
  }, [data, draft, setDraft]);

  const handleCopy = () => {
    navigator.clipboard.writeText(draft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Legal Document</title></head><body>";
    const footer = "</body></html>";
    const html = `${header}<pre style="font-family:'Times New Roman',serif;font-size:13pt;line-height:1.5;">${draft.replace(/\n/g, '<br/>')}</pre>${footer}`;

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

  const insert = (text) => setDraft(prev => `${prev}\n\n${t.insertedPrefix}: ${text}`);

  return (
    <div className="legal-draft-screen">
      <div className="legal-draft-head">
        <div>
          <button className="legal-back" onClick={onBack}>
            <ArrowLeft size={15} /> {t.backToResults}
          </button>
          <h1 className="legal-casehead__title">{t.draftTitle}</h1>
        </div>
        <div className="legal-draft-head__actions">
          <button className={`legal-act ${copied ? 'legal-act--done' : ''}`} onClick={handleCopy}>
            {copied ? <Check size={15} /> : <Copy size={15} />}
            {copied ? t.actCopied : t.actCopy}
          </button>
          <button className="legal-act legal-act--primary" onClick={handleExport}>
            <Download size={15} /> {t.actExport}
          </button>
        </div>
      </div>

      <div className="legal-draft-body">
        <aside className="legal-draft-rail">
          <span className="legal-label">{t.insertHeading}</span>

          {data?.legal_citations?.map((cite, idx) => (
            <button
              key={`c-${idx}`}
              className="legal-insert"
              onClick={() => insert(`${t.citationBasis} ${cite.code || cite.article}: ${cite.title}`)}
            >
              <div className="legal-insert__code">{cite.code || cite.article}</div>
              <div className="legal-insert__title">{cite.title}</div>
              <span className="legal-insert__add"><Plus size={11} /> {t.insertAction}</span>
            </button>
          ))}

          {data?.charges?.map((charge, idx) => (
            <button
              key={`h-${idx}`}
              className="legal-insert"
              onClick={() => insert(`${t.citationBasis} ${charge}`)}
            >
              <div className="legal-insert__title">{charge}</div>
              <span className="legal-insert__add"><Plus size={11} /> {t.insertAction}</span>
            </button>
          ))}
        </aside>

        <textarea
          className="legal-editor"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          aria-label={t.draftTitle}
        />
      </div>
    </div>
  );
}
