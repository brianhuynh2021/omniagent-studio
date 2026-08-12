import uuid
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from app.domains.registry import DomainAgentMeta, global_domain_registry

class CreateCustomAgentRequest(BaseModel):
    name: str
    description: str
    domain_key: str = "custom"
    icon: str = "🤖"
    system_prompt: str
    default_tools: List[str] = Field(default_factory=list)
    suggested_prompts: List[str] = Field(default_factory=list)

class CustomAgentService:
    def __init__(self):
        self._user_agents: Dict[str, DomainAgentMeta] = {}

    def create_agent(self, req: CreateCustomAgentRequest) -> DomainAgentMeta:
        agent_id = f"custom_agent_{uuid.uuid4().hex[:8]}"
        new_agent = DomainAgentMeta(
            id=agent_id,
            name=req.name,
            domain_key=req.domain_key,
            icon=req.icon or "🤖",
            description=req.description,
            suggested_prompts=req.suggested_prompts or ["Hãy hỗ trợ tôi theo nhiệm vụ của Agent."],
            default_tools=req.default_tools,
            system_prompt=req.system_prompt
        )
        self._user_agents[agent_id] = new_agent
        global_domain_registry.add_custom_agent(new_agent)
        return new_agent

    def list_custom_agents(self) -> List[DomainAgentMeta]:
        return list(self._user_agents.values())

    def get_custom_agent(self, agent_id: str) -> Optional[DomainAgentMeta]:
        return self._user_agents.get(agent_id)

custom_agent_service = CustomAgentService()
