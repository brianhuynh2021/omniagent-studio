import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import LegalAssistantView from './components/LegalAssistantView';
import DocIntelView from './components/DocIntelView';
import PlatformHubPortal from './components/PlatformHubPortal';
import AgentTraceLogs from './components/AgentTraceLogs';

export default function App() {
  // Detect if running on Hub port (3000 or 3031) vs Standalone Legal App port (5173)
  const isHubPort = typeof window !== 'undefined' && (window.location.port.startsWith('30') || window.location.port === '');
  
  const [appMode, setAppMode] = useState(isHubPort ? 'hub' : 'product'); // 'product' | 'hub'
  const [activeView, setActiveView] = useState(isHubPort ? 'hub_portal' : 'legal');
  const [systemInfo, setSystemInfo] = useState(null);
  const [isTraceOpen, setIsTraceOpen] = useState(false);
  const [lastAgentResponse, setLastAgentResponse] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8001/api/v1/project/info")
      .then(res => res.json())
      .then(data => setSystemInfo(data))
      .catch(() => console.log("Backend loading or offline..."));
  }, []);

  const handleAgentExecute = (response) => {
    setLastAgentResponse(response);
    setIsTraceOpen(true);
  };

  return (
    <div className="app-container">
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        appMode={appMode}
        setAppMode={setAppMode}
      />
      
      <main className="main-content">
        <Header 
          systemInfo={systemInfo} 
          toggleTraceDrawer={() => setIsTraceOpen(!isTraceOpen)} 
          traceLogsCount={lastAgentResponse?.trace_logs?.length || 0}
          appMode={appMode}
          setAppMode={setAppMode}
        />

        <div className="workspace-area">
          {appMode === 'hub' ? (
            <PlatformHubPortal 
              systemInfo={systemInfo} 
              onAgentExecute={handleAgentExecute} 
            />
          ) : (
            <>
              {activeView === 'legal' && <LegalAssistantView onAgentExecute={handleAgentExecute} />}
              {activeView === 'rag_search' && <DocIntelView onAgentExecute={handleAgentExecute} />}
            </>
          )}
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
