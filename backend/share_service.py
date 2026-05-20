# backend/share_service.py
"""In-memory store for shareable trip links (resets when server restarts)."""

import uuid
from typing import Dict, Optional

from schemas import ShareTripPayload

_store: Dict[str, ShareTripPayload] = {}


def create_share(payload: ShareTripPayload) -> str:
    share_id = uuid.uuid4().hex[:12]
    _store[share_id] = payload
    return share_id


def get_share(share_id: str) -> Optional[ShareTripPayload]:
    return _store.get(share_id)
