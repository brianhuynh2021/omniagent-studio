import time
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class ToolExecutionLog(BaseModel):
    tool_name: str
    input_args: Dict[str, Any]
    output_summary: str
    status: str = "SUCCESS"
    execution_time_ms: float

class Citation(BaseModel):
    document_id: str
    document_name: str
    page_or_chunk: str
    snippet: str
    relevance_score: float = 0.95

class AgentResponse(BaseModel):
    agent_name: str
    output_text: str
    structured_data: Dict[str, Any] = Field(default_factory=dict)
    citations: List[Citation] = Field(default_factory=list)
    trace_logs: List[ToolExecutionLog] = Field(default_factory=list)
    hallucination_check_passed: bool = True
    total_latency_ms: float = 0.0

class BaseTool:
    def __init__(self, name: str, description: str):
        self.name = name
        self.description = description

    def execute(self, **kwargs) -> Any:
        raise NotImplementedError

class BaseAgent:
    def __init__(self, name: str, role_description: str, tools: Optional[List[BaseTool]] = None):
        self.name = name
        self.role_description = role_description
        self.tools = tools or []

    def run(self, input_query: str, context: Optional[Dict[str, Any]] = None) -> AgentResponse:
        raise NotImplementedError
