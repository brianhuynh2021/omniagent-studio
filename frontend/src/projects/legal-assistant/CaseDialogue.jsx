import React, { useEffect, useRef, useState } from 'react';
import { Send, Loader2, MessageSquare, AlertTriangle, ShieldCheck, Lock, Globe } from 'lucide-react';

const API_BASE = "http://localhost:8001/api/v1/legal";

export default function CaseDialogue({ t, title, content, persona, lang }) {
  const [turns, setTurns] = useState([]);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [engine, setEngine] = useState(null);      // what the server has configured
  const [allowLLM, setAllowLLM] = useState(false); // per-dossier consent, off by default
  const [askConsent, setAskConsent] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    fetch(`${API_BASE}/engine`).then(r => r.json()).then(setEngine).catch(() => {});
  }, []);

  // Consent never survives a dossier or language change — a fresh dossier
  // may be classified even if the previous one was not.
  useEffect(() => { setAllowLLM(false); }, [title, lang]);

  // Switching dossier or language invalidates the thread.
  useEffect(() => { setTurns([]); }, [title, lang]);

  useEffect(() => {
    if (turns.length) endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [turns, busy]);

  const ask = async (question) => {
    const q = question.trim();
    if (!q || busy) return;

    setTurns(prev => [...prev, { role: 'user', text: q }]);
    setDraft('');
    setBusy(true);

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          content,
          title,
          lang,
          persona,
          history: turns.map(x => ({ role: x.role, text: x.text })),
          allow_external_llm: allowLLM
        })
      });
      const data = await res.json();
      setTurns(prev => [...prev, {
        role: 'assistant',
        text: data.output_text,
        grounded: data.hallucination_check_passed,
        precedents: data.structured_data?.matched_precedents || [],
        engine: data.structured_data?.engine || 'retrieval'
      }]);
    } catch (err) {
      console.error(err);
      setTurns(prev => [...prev, {
        role: 'assistant',
        text: t.chatUngrounded,
        grounded: false,
        precedents: []
      }]);
    } finally {
      setBusy(false);
    }
  };

  const suggestions = [t.chatSuggest1, t.chatSuggest2, t.chatSuggest3];

  return (
    <div className="legal-chat">
      {/* Privacy control. Local processing is the default and is stated
          plainly; sending the dossier outside requires explicit consent. */}
      <div className="legal-privacy">
        {allowLLM ? (
          <button className="legal-privacy__state is-external" onClick={() => setAllowLLM(false)}>
            <Globe size={13} /> {t.llmOnLabel}
          </button>
        ) : (
          <span className="legal-privacy__state">
            <Lock size={13} /> {t.privacyLocal}
          </span>
        )}

        {!allowLLM && (
          engine?.available ? (
            <button className="legal-privacy__enable" onClick={() => setAskConsent(true)}>
              {t.llmOnLabel} →
            </button>
          ) : (
            <span className="legal-privacy__off">{t.llmNotConfigured}</span>
          )
        )}
      </div>

      {askConsent && (
        <div className="legal-consent" role="alertdialog" aria-labelledby="legal-consent-title">
          <div className="legal-consent__head" id="legal-consent-title">
            <AlertTriangle size={15} /> {t.llmWarnTitle}
          </div>
          <p className="legal-consent__body">{t.llmWarnBody}</p>
          {engine?.provider && (
            <p className="legal-consent__provider">→ {engine.provider} · {engine.model}</p>
          )}
          <div className="legal-consent__actions">
            <button className="legal-consent__cancel" onClick={() => setAskConsent(false)}>
              {t.llmWarnCancel}
            </button>
            <button
              className="legal-consent__confirm"
              onClick={() => { setAllowLLM(true); setAskConsent(false); }}
            >
              {t.llmWarnConfirm}
            </button>
          </div>
        </div>
      )}

      {turns.length === 0 && !busy ? (
        <div className="legal-chat__empty">
          <MessageSquare size={18} />
          <p>{t.chatEmpty}</p>
          <div className="legal-chat__suggests">
            {suggestions.map((s, i) => (
              <button key={i} className="legal-chat__suggest" onClick={() => ask(s)}>
                {s}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="legal-chat__thread">
          {turns.map((turn, i) => (
            <div key={i} className={`legal-turn legal-turn--${turn.role}`}>
              {turn.role === 'assistant' && (
                <div className={`legal-turn__badge ${turn.grounded ? '' : 'is-ungrounded'}`}>
                  {turn.grounded
                    ? <><ShieldCheck size={12} /> {turn.precedents.length > 0
                        ? `${t.verifiedPrefix} ${turn.precedents.length} ${t.verifiedUnit}`
                        : t.verifiedPrefix}</>
                    : <><AlertTriangle size={12} /> {t.chatUngrounded}</>}
                  <span className="legal-turn__engine">
                    · {turn.engine === 'retrieval' ? t.engineRetrieval : turn.engine}
                  </span>
                </div>
              )}
              <div className="legal-turn__text">{turn.text}</div>
            </div>
          ))}
          {busy && (
            <div className="legal-turn legal-turn--assistant">
              <div className="legal-turn__thinking">
                <Loader2 size={14} className="legal-spin" /> {t.chatThinking}
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>
      )}

      <form
        className="legal-chat__composer"
        onSubmit={(e) => { e.preventDefault(); ask(draft); }}
      >
        <input
          className="legal-chat__input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={t.chatPlaceholder}
          aria-label={t.chatTitle}
          disabled={busy}
        />
        <button
          type="submit"
          className="legal-chat__send"
          disabled={busy || !draft.trim()}
          aria-label={t.chatSend}
        >
          {busy ? <Loader2 size={16} className="legal-spin" /> : <Send size={16} />}
        </button>
      </form>
    </div>
  );
}
