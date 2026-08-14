from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
import time

from app.core.config import settings
from app.api.v1.api import api_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Enable CORS for local React/Vite web application
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response

@app.get("/health")
def health_check():
    # Reports what actually resolved rather than what was configured: after a
    # deploy the useful question is whether the key took effect and whether the
    # case bank is on Postgres, not what the environment claims.
    from app.domains.legal_assistant import case_bank, llm

    return {
        "status": "healthy",
        "system": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "llm": llm.provider_info(),
        "case_bank": "postgres" if case_bank.using_postgres() else "sqlite (ephemeral)",
    }

app.include_router(api_router, prefix=settings.API_V1_STR)

# Serve static frontend build if static directory exists (Hugging Face / Production All-in-One)
import os
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

static_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static")
if os.path.exists(static_dir):
    assets_dir = os.path.join(static_dir, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    index_file = os.path.join(static_dir, "index.html")
    static_root = os.path.realpath(static_dir)

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        # This catch-all runs after the API router, so a path in its namespace
        # reaching here is genuinely unrouted — 404 rather than the SPA shell,
        # which would otherwise answer every mistyped endpoint with HTML.
        if (full_path.startswith(("api", "docs", "redoc")) or full_path == "health"):
            raise HTTPException(status_code=404, detail="Not found")

        # `full_path` is client-controlled: resolve it and confirm it stays
        # inside the static directory before serving. Without this check a
        # traversal such as `../../etc/passwd` would read outside the build.
        target = os.path.realpath(os.path.join(static_dir, full_path))
        if (target == static_root or target.startswith(static_root + os.sep)) \
                and os.path.isfile(target):
            return FileResponse(target)

        # Unknown paths fall through to the SPA so client-side routes resolve.
        return FileResponse(index_file)

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8001))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True)

