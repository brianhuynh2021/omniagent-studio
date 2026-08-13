import time
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class TrajectoryStep(BaseModel):
    step_number: int
    step_name: str
    tool_used: str
    input_payload: Dict[str, Any] = Field(default_factory=dict)
    output_summary: str
    latency_ms: float
    status: str = "SUCCESS" # SUCCESS | WARNING | FAILED
    error_message: Optional[str] = None

class AgentTrajectory(BaseModel):
    trajectory_id: str
    task_id: str
    case_title: str
    persona: str
    steps: List[TrajectoryStep] = Field(default_factory=list)
    overall_status: str = "SUCCESS" # SUCCESS | FAILED
    faithfulness_score: float = 0.96
    answer_relevancy_score: float = 0.94
    precedent_precision_score: float = 0.98
    total_execution_ms: float = 0.0
    created_at: float = Field(default_factory=time.time)

class TrajectoryRecorder:
    """Captures and stores Agent execution trajectories for offline & online evals."""

    def __init__(self):
        self._trajectories: List[AgentTrajectory] = []
        self._seed_default_trajectories()

    def _seed_default_trajectories(self):
        self._trajectories.append(AgentTrajectory(
            trajectory_id="trj_01",
            task_id="task_seed_01",
            case_title="Vụ án Trộm cắp tài sản - Nguyễn Văn A",
            persona="all_in_one",
            steps=[
                TrajectoryStep(step_number=1, step_name="Ingestion", tool_used="MultiFormatDocumentParser", input_payload={"doc": "pdf"}, output_summary="Parsed 4 chunks", latency_ms=38.4),
                TrajectoryStep(step_number=2, step_name="RAG Search", tool_used="TANDTCPrecedentsMatcher2026", input_payload={"query": "trộm cắp"}, output_summary="Matched 2 precedents", latency_ms=45.1),
                TrajectoryStep(step_number=3, step_name="Debate Simulation", tool_used="MultiAgentDebateEngine", input_payload={"mode": "adversarial"}, output_summary="Consensus reached", latency_ms=42.6)
            ],
            overall_status="SUCCESS",
            total_execution_ms=126.1
        ))

    def record_trajectory(self, trajectory: AgentTrajectory) -> AgentTrajectory:
        self._trajectories.append(trajectory)
        return trajectory

    def get_all_trajectories(self) -> List[AgentTrajectory]:
        return self._trajectories

    def get_recent_trajectories(self, limit: int = 10) -> List[AgentTrajectory]:
        return self._trajectories[-limit:]

    def get_trajectory_count(self) -> int:
        return len(self._trajectories)

trajectory_recorder = TrajectoryRecorder()
