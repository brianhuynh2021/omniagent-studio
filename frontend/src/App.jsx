import React, { useState, useEffect } from 'react';
import LegalAssistantView from './projects/legal-assistant/LegalAssistantView';
import DocIntelView from './components/DocIntelView';
import MarketingAgentView from './components/MarketingAgentView';
import SupportBookingView from './components/SupportBookingView';
import EngKnowledgeView from './components/EngKnowledgeView';
import AgentStudio from './components/AgentStudio';
import PlatformHubPortal from './components/PlatformHubPortal';
import AgentTraceLogs from './components/AgentTraceLogs';
import AppHeader from './components/AppHeader';

export default function App() {
  const [activeView, setActiveView] = useState('hub');
  const [lang, setLang] = useState('vi');
  const [systemInfo, setSystemInfo] = useState(null);
  const [isTraceOpen, setIsTraceOpen] = useState(false);
  const [lastAgentResponse, setLastAgentResponse] = useState(null);

  useEffect(() => {
    const infoUrl = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
      ? "http://localhost:8001/api/v1/project/info"
      : "/api/v1/project/info";
    fetch(infoUrl)
      .then(res => res.json())
      .then(data => setSystemInfo(data))
      .catch(() => console.log("Backend loading or offline..."));
  }, []);


  const handleAgentExecute = (response) => {
    setLastAgentResponse(response);
  };

  return (
    <div className="clean-app-shell">
      <AppHeader 
        activeView={activeView}
        setActiveView={setActiveView}
        lang={lang}
        setLang={setLang}
        systemInfo={systemInfo}
        traceLogsCount={lastAgentResponse?.trace_logs?.length || 0}
        toggleTraceDrawer={() => setIsTraceOpen(!isTraceOpen)}
      />

      <main className="clean-workspace">
        {activeView === 'hub' && (
          <PlatformHubPortal
            systemInfo={systemInfo}
            onAgentExecute={handleAgentExecute}
            setActiveView={setActiveView}
          />
        )}

        {activeView === 'legal' && (
          <LegalAssistantView 
            onAgentExecute={handleAgentExecute} 
            lang={lang}
            setLang={setLang}
          />
        )}

        {activeView === 'doc_intel' && (
          <div className="clean-view-card">
            <DocIntelView onAgentExecute={handleAgentExecute} />
          </div>
        )}

        {activeView === 'marketing' && (
          <div className="clean-view-card">
            <MarketingAgentView onAgentExecute={handleAgentExecute} />
          </div>
        )}

        {activeView === 'support' && (
          <div className="clean-view-card">
            <SupportBookingView onAgentExecute={handleAgentExecute} />
          </div>
        )}

        {activeView === 'engineering' && (
          <div className="clean-view-card">
            <EngKnowledgeView onAgentExecute={handleAgentExecute} />
          </div>
        )}

        {activeView === 'studio' && (
          <div className="clean-view-card">
            <AgentStudio onAgentExecute={handleAgentExecute} />
          </div>
        )}
      </main>

      <AgentTraceLogs
        isOpen={isTraceOpen}
        onClose={() => setIsTraceOpen(false)}
        lastResponse={lastAgentResponse}
      />
    </div>
  );
}
