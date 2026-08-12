import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import LegalAssistantView from './components/LegalAssistantView';
import DocIntelView from './components/DocIntelView';
import MarketingAgentView from './components/MarketingAgentView';
import SupportBookingView from './components/SupportBookingView';
import EngKnowledgeView from './components/EngKnowledgeView';
import AgentTraceLogs from './components/AgentTraceLogs';

export default function App() {
  const [activeVertical, setActiveVertical] = useState(1);
  const [systemInfo, setSystemInfo] = useState(null);
  const [isTraceOpen, setIsTraceOpen] = useState(false);
  const [lastAgentResponse, setLastAgentResponse] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8001/api/v1/project/info")
      .then(res => res.json())
      .then(data => setSystemInfo(data))
      .catch(err => console.log("Backend offline or loading..."));
  }, []);

  const handleAgentExecute = (response) => {
    setLastAgentResponse(response);
    // Auto-open trace drawer if execution took place to show transparency
    setIsTraceOpen(true);
  };

  return (
    <div className="app-container">
      <Sidebar activeVertical={activeVertical} setActiveVertical={setActiveVertical} />
      
      <main className="main-content">
        <Header 
          systemInfo={systemInfo} 
          toggleTraceDrawer={() => setIsTraceOpen(!isTraceOpen)} 
          traceLogsCount={lastAgentResponse?.trace_logs?.length || 0}
        />

        <div className="workspace-area">
          {activeVertical === 1 && <LegalAssistantView onAgentExecute={handleAgentExecute} />}
          {activeVertical === 2 && <DocIntelView onAgentExecute={handleAgentExecute} />}
          {activeVertical === 3 && <MarketingAgentView onAgentExecute={handleAgentExecute} />}
          {activeVertical === 4 && <SupportBookingView onAgentExecute={handleAgentExecute} />}
          {activeVertical === 5 && <EngKnowledgeView onAgentExecute={handleAgentExecute} />}
        </div>
      </main>

      <AgentTraceLogs 
        isOpen={isTraceOpen} 
        onClose={() => setIsTraceOpen(false)} 
        lastResponse={lastAgentResponse}
      />
    </div>
  );
}
