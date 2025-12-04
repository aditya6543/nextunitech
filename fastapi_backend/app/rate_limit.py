import time
from fastapi import HTTPException, status, Request
from .config import settings

# { key: [window_start_epoch, count] }
_rate_limit_store: dict[str, tuple[float, int]] = {}

WINDOW_SECONDS = 60


def _current_key(request: Request) -> str:
    # Per-IP limit; optionally add user_id when logged in
    client_ip = request.client.host if request.client else "unknown"
    return client_ip


async def enforce_rate_limit(request: Request):
    key = _current_key(request)
    now = time.time()
    window_start, count = _rate_limit_store.get(key, (now, 0))

    if now - window_start >= WINDOW_SECONDS:
        # reset window
        window_start = now
        count = 0

    count += 1
    _rate_limit_store[key] = (window_start, count)

    if count > settings.RATE_LIMIT_PER_MINUTE:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many requests, thoda dheere chalte hain mitra.",
        )
