import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft, ChevronDown, ShieldCheck, AlertTriangle, Gavel,
  PenLine, Download, Copy, Check, MessageSquare, Search, X, Lock
} from 'lucide-react';
import CaseDialogue from './CaseDialogue';

const PERSONA_KEYS = ['all_in_one', 'lawyer', 'judge', 'prosecutor', 'corporate'];

export default function ResultsScreen({
  t, result, title, content, lang, persona, setPersona,
  onBack, onOpenDraft, onExport
}) {
  const data = result.structured_data;
  const [activeSection, setActiveSection] = useState('summary');
  const [copied, setCopied] = useState(false);
  const [refCode, setRefCode] = useState(data.reference_code || '');
  const [refCopied, setRefCopied] = useState(false);
  const [query, setQuery] = useState('');
  const sectionRefs = useRef({});

  useEffect(() => {
    if (data.reference_code) setRefCode(data.reference_code);
  }, [data.reference_code]);

  // Search filters the evidence, citation, and question lists in place, so a
  // long dossier can be narrowed without leaving the page.
  const q = query.trim().toLowerCase();
  const match = (...fields) =>
    !q || fields.some(f => (f || '').toString().toLowerCase().includes(q));

  const evidence = (data.evidence_matrix || []).filter(ev =>
    match(ev.item, ev.prosecution_view, ev.defense_view, ev.description, ev.relevance));
  const citations = (data.legal_citations || []).filter(c =>
    match(c.code, c.article, c.title, c.issued_by, c.status));
  const questions = (data.interrogation_questions || []).filter(qq =>
    match(qq.target, qq.question));
  const charges = (data.charges || []).filter(c => match(c));
  const totalMatches = evidence.length + citations.length + questions.length + charges.length;

  const SECTIONS = [
    { id: 'summary', label: t.secSummary, count: null },
    { id: 'evidence', label: t.secEvidence, count: evidence.length },
    { id: 'citations', label: t.secCitations, count: citations.length },
    { id: 'questions', label: t.secQuestions, count: questions.length },
    { id: 'dialogue', label: t.secDialogue, count: null }
  ];

  // Scroll-spy: highlight whichever section owns the upper viewport.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveSection(visible[0].target.dataset.section);
      },
      { rootMargin: '-80px 0px -55% 0px', threshold: 0 }
    );

    Object.values(sectionRefs.current).forEach(el => el && observer.observe(el));

    // At the bottom of the page the last section may never enter the
    // detection band, so pin it explicitly.
    const onScroll = () => {
      const atBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 4;
      if (atBottom) setActiveSection('dialogue');
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, [result]);

  const scrollTo = (id) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleCopy = () => {
    const lines = [
      title,
      '',
      `${t.partiesLabel}: ${data.defendant}`,
      '',
      `${t.chargesLabel}:`,
      ...(data.charges || []).map(c => `  - ${c}`),
      '',
      `${t.secCitations}:`,
      ...(data.legal_citations || []).map(c => `  - ${c.code || c.article}: ${c.title}`)
    ];
    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const citationCount = data.legal_citations?.length ?? 0;

  return (
    <div className="legal-results">
      <div className="legal-results__main">
        <header className="legal-casehead">
          <button className="legal-back" onClick={onBack}>
            <ArrowLeft size={15} /> {t.backToIntake}
          </button>
          <h1 className="legal-casehead__title">{title}</h1>

          {/* Dossier reference (mã bút lục) — editable to match the agency register */}
          <div className="legal-ref">
            <label className="legal-ref__label" htmlFor="legal-ref-input">{t.refLabel}</label>
            <input
              id="legal-ref-input"
              className="legal-ref__input"
              value={refCode}
              onChange={(e) => setRefCode(e.target.value)}
              spellCheck={false}
            />
            <button
              className="legal-ref__copy"
              onClick={() => {
                navigator.clipboard.writeText(refCode);
                setRefCopied(true);
                setTimeout(() => setRefCopied(false), 1800);
              }}
              title={t.refHint}
            >
              {refCopied ? <Check size={13} /> : <Copy size={13} />}
            </button>
            <span className="legal-ref__hint">{refCopied ? t.refCopied : t.refHint}</span>
          </div>

          <div className="legal-casehead__row">
            <div className="legal-select">
              <select value={persona} onChange={(e) => setPersona(e.target.value)} aria-label={t.roleLabel}>
                {PERSONA_KEYS.map(k => (
                  <option key={k} value={k}>{t.personas[k].name}</option>
                ))}
              </select>
              <ChevronDown size={15} />
            </div>
            <span className="legal-dot">·</span>
            {result.hallucination_check_passed ? (
              <button className="legal-verified" onClick={() => scrollTo('citations')}>
                <ShieldCheck size={14} />
                {t.verifiedPrefix} {citationCount} {t.verifiedUnit}
              </button>
            ) : (
              <span className="legal-verified is-ungrounded">
                <AlertTriangle size={14} /> {t.chatUngrounded}
              </span>
            )}
          </div>
        </header>


        {/* Summary */}
        <section
          className="legal-section"
          data-section="summary"
          ref={el => (sectionRefs.current.summary = el)}
        >
          <div className="legal-section__head">
            <h2 className="legal-section__title">{t.partiesLabel}</h2>
          </div>
          <p className="legal-party">{data.defendant}</p>

          <div className="legal-section__head" style={{ marginTop: 'var(--s5)' }}>
            <h2 className="legal-section__title">{t.chargesLabel}</h2>
          </div>
          <div className="legal-list">
            {charges.map((c, i) => (
              <div key={i} className="legal-list__row">
                <Gavel size={15} /> {c}
              </div>
            ))}
          </div>
        </section>

        {/* Evidence */}
        <section
          className="legal-section"
          data-section="evidence"
          ref={el => (sectionRefs.current.evidence = el)}
        >
          <div className="legal-section__head">
            <h2 className="legal-section__title">{t.secEvidence}</h2>
            <span className="legal-section__count">{evidence.length}</span>
          </div>
          {evidence.length === 0 ? (
            <p className="legal-empty-hint">{t.searchNoResult}</p>
          ) : (
          <table className="legal-evidence">
            <thead>
              <tr>
                <th>{t.colItem}</th>
                <th className="is-pros"><span className="legal-mark-dot legal-mark-dot--pros" />{t.colPros}</th>
                <th className="is-def"><span className="legal-mark-dot legal-mark-dot--def" />{t.colDef}</th>
              </tr>
            </thead>
            <tbody>
              {evidence.map((ev, idx) => (
                <tr key={idx}>
                  <td className="cell-item">
                    {ev.item}
                    {ev.relevance && <span className="legal-relevance">{ev.relevance}</span>}
                  </td>
                  <td>{ev.prosecution_view || ev.description}</td>
                  <td>{ev.defense_view || t.noDefenseView}</td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </section>

        {/* Citations */}
        <section
          className="legal-section"
          data-section="citations"
          ref={el => (sectionRefs.current.citations = el)}
        >
          <div className="legal-section__head">
            <h2 className="legal-section__title">{t.secCitations}</h2>
            <span className="legal-section__count">{citations.length}</span>
          </div>
          {citations.length === 0 && <p className="legal-empty-hint">{t.searchNoResult}</p>}
          {citations.map((cite, idx) => (
            <div key={idx} className="legal-cite">
              <div className="legal-cite__top">
                <span className="legal-cite__code">{cite.code || cite.article}</span>
                <span className="legal-cite__status">{cite.status}</span>
              </div>
              <div className="legal-cite__title">{cite.title}</div>
              <div className="legal-cite__meta">
                {t.issuedByLabel} {cite.issued_by || t.defaultIssuer}
              </div>
            </div>
          ))}

        </section>

        {/* Questions */}
        <section
          className="legal-section"
          data-section="questions"
          ref={el => (sectionRefs.current.questions = el)}
        >
          <div className="legal-section__head">
            <h2 className="legal-section__title">{t.secQuestions}</h2>
            <span className="legal-section__count">{questions.length}</span>
          </div>
          {questions.length === 0 && <p className="legal-empty-hint">{t.searchNoResult}</p>}
          {questions.map((q, idx) => (
            <div key={idx} className="legal-q">
              <div className="legal-q__top">
                <span className="legal-q__target">{t.targetPrefix}: {q.target}</span>
                <span className="legal-q__num">{t.questionPrefix} {idx + 1}</span>
              </div>
              <div className="legal-q__text">{q.question}</div>
            </div>
          ))}
        </section>

        {/* Dialogue: the dossier stays open for questions */}
        <section
          className="legal-section"
          data-section="dialogue"
          ref={el => (sectionRefs.current.dialogue = el)}
        >
          <div className="legal-section__head">
            <h2 className="legal-section__title">
              <MessageSquare size={13} /> {t.chatTitle}
            </h2>
          </div>
          <CaseDialogue
            t={t}
            title={title}
            content={content}
            persona={persona}
            lang={lang}
          />
        </section>
      </div>

      {/* Sticky rail: table of contents + next actions */}
      <aside className="legal-rail">
        <div className="legal-search">
          <Search size={14} />
          <input
            className="legal-search__input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            aria-label={t.searchPlaceholder}
          />
          {query && (
            <button className="legal-search__clear" onClick={() => setQuery('')} aria-label="clear">
              <X size={13} />
            </button>
          )}
        </div>
        {q && (
          <div className="legal-search__meta">
            {totalMatches > 0 ? `${totalMatches} ${t.searchCount}` : t.searchNoResult}
          </div>
        )}

        <nav className="legal-toc">
          {SECTIONS.map(s => (
            <button
              key={s.id}
              className={`legal-toc__link ${activeSection === s.id ? 'active' : ''}`}
              onClick={() => scrollTo(s.id)}
            >
              {s.label}
              {s.count != null && <span className="legal-toc__n">{s.count}</span>}
            </button>
          ))}
        </nav>

        <div className="legal-rail__actions">
          <button className="legal-act legal-act--primary" onClick={onOpenDraft}>
            <PenLine size={15} /> {t.actDraft}
          </button>
          <button className="legal-act" onClick={onExport}>
            <Download size={15} /> {t.actExport}
          </button>
          <button className={`legal-act ${copied ? 'legal-act--done' : ''}`} onClick={handleCopy}>
            {copied ? <Check size={15} /> : <Copy size={15} />}
            {copied ? t.actCopied : t.actCopy}
          </button>
        </div>

      </aside>
    </div>
  );
}
