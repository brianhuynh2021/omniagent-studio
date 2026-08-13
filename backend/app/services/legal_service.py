# Forwarding module for backward compatibility
from app.domains.legal_assistant.service import legal_assistant_service as legal_service

__all__ = ["legal_service"]
