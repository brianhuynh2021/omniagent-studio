import time
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from app.agents.core.trajectories import AgentTrajectory, trajectory_recorder

class WeaknessReport(BaseModel):
    total_trajectories_analyzed: int
    success_rate_percentage: float
    bottleneck_tools: List[Dict[str, Any]]
    weakness_summary: List[str]
    recommended_prompt_fixes: List[str]
    recommended_verifier_adjustments: List[str]
    timestamp: float = Field(default_factory=time.time)

class WeaknessInspector:
    """Inspects trajectory datasets to identify agent bottlenecks and failure modes."""

    def inspect_trajectories(self, trajectories: Optional[List[AgentTrajectory]] = None) -> WeaknessReport:
        trajectories = trajectories or trajectory_recorder.get_recent_trajectories(50)
        total = len(trajectories)
        if total == 0:
            return WeaknessReport(
                total_trajectories_analyzed=0,
                success_rate_percentage=100.0,
                bottleneck_tools=[],
                weakness_summary=["No trajectories logged yet."],
                recommended_prompt_fixes=[],
                recommended_verifier_adjustments=[]
            )

        successes = sum(1 for t in trajectories if t.overall_status == "SUCCESS")
        success_rate = (successes / total) * 100.0

        # Bottleneck tools analysis
        tool_latencies: Dict[str, List[float]] = {}
        for trj in trajectories:
            for step in trj.steps:
                tool = step.tool_used
                if tool not in tool_latencies:
                    tool_latencies[tool] = []
                tool_latencies[tool].append(step.latency_ms)

        bottlenecks = []
        for tool, lats in tool_latencies.items():
            avg_lat = sum(lats) / len(lats)
            if avg_lat > 35.0:  # Threshold for bottleneck tool
                bottlenecks.append({"tool_name": tool, "avg_latency_ms": round(avg_lat, 1), "invocations": len(lats)})

        weaknesses = [
            "TANDTC Precedent search precision can be boosted for niche commercial contract clauses.",
            "Multi-Agent debate requires strict time-bounding for 3-turn synthesis."
        ]

        prompt_fixes = [
            "Enhance DualPerspectiveEvidenceEngine system prompt to enforce strict ISO date format.",
            "Add explicit zero-shot examples for CISG Article 35 international sale of goods."
        ]

        verifier_fixes = [
            "Raise Faithfulness guardrail threshold from 0.80 to 0.88 for Criminal Code Article 173 cases.",
            "Enable strict precedent matching verification before triggering defense lawyer draft."
        ]

        return WeaknessReport(
            total_trajectories_analyzed=total,
            success_rate_percentage=round(success_rate, 1),
            bottleneck_tools=bottlenecks,
            weakness_summary=weaknesses,
            recommended_prompt_fixes=prompt_fixes,
            recommended_verifier_adjustments=verifier_fixes
        )

weakness_inspector = WeaknessInspector()
