from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class ToolDefinition(BaseModel):
    name: str
    description: str
    tool_type: str = "builtin" # "builtin" | "custom_webhook" | "plugin_handler"
    endpoint_url: Optional[str] = None
    parameters_schema: Dict[str, Any] = Field(default_factory=dict)

class VerticalManifest(BaseModel):
    vertical_id: str
    name: str
    icon: str
    category: str
    description: str
    owner_team: str = "core-team"
    version: str = "1.0.0"
    tags: List[str] = Field(default_factory=list)
    system_prompt: str
    suggested_prompts: List[str] = Field(default_factory=list)
    knowledge_collections: List[str] = Field(default_factory=list)
    tools: List[ToolDefinition] = Field(default_factory=list)
    webhooks: Dict[str, str] = Field(default_factory=dict)
    guardrails: List[str] = Field(default_factory=list)

class BaseVerticalPlugin:
    """Base class that every vertical project implements to plug into Aegis Core AI Engine."""
    def __init__(self, manifest: VerticalManifest):
        self.manifest = manifest

    def get_manifest(self) -> VerticalManifest:
        return self.manifest

    def execute_custom_tool(self, tool_name: str, args: Dict[str, Any]) -> Dict[str, Any]:
        """Override this method to provide custom vertical business logic (e.g. POS order check, Salon booking)."""
        return {
            "status": "success",
            "tool_name": tool_name,
            "message": f"Executed custom tool [{tool_name}] for vertical [{self.manifest.vertical_id}]",
            "result": args
        }
