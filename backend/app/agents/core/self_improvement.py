import time
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class OperatorFeedback(BaseModel):
    feedback_id: str
    case_title: str
    rating: int  # 1 to 5 stars
    user_edits_applied: bool = False
    preferred_persona: str
    timestamp: float = Field(default_factory=time.time)

class SelfImprovementState(BaseModel):
    total_feedbacks_received: int = 0
    average_operator_rating: float = 4.85
    prompt_weight_multiplier: float = 1.05
    dpo_preference_checkpoint: str = "dpo_checkpoint_2026_v2"
    last_updated: float = Field(default_factory=time.time)

class SelfRAGFeedbackEngine:
    """RL / Self-Improvement & DPO Preference Feedback Engine for Level 11 AI Maturity."""

    def __init__(self):
        self._feedbacks: List[OperatorFeedback] = []
        self._state = SelfImprovementState()

    def record_feedback(self, title: str, rating: int, persona: str, edits: bool = False) -> SelfImprovementState:
        feedback_id = f"fb_{int(time.time())}"
        fb = OperatorFeedback(
            feedback_id=feedback_id,
            case_title=title,
            rating=rating,
            user_edits_applied=edits,
            preferred_persona=persona
        )
        self._feedbacks.append(fb)
        
        # Recalculate average rating & prompt weight
        total = len(self._feedbacks)
        avg_rating = sum(f.rating for f in self._feedbacks) / total if total > 0 else 4.85
        
        self._state.total_feedbacks_received = total
        self._state.average_operator_rating = round(avg_rating, 2)
        self._state.prompt_weight_multiplier = round(1.0 + (avg_rating - 3.0) * 0.05, 2)
        self._state.last_updated = time.time()
        
        return self._state

    def get_state(self) -> SelfImprovementState:
        return self._state

self_improvement_engine = SelfRAGFeedbackEngine()
