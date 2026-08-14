# Deploy

The deployed unit is the root `Dockerfile`: it builds the Vite frontend, copies
the bundle into `app/static`, and serves both the API and the SPA from one
FastAPI process on port 7860. `docker-compose.yml` is for local development
only — it runs the backend and frontend as separate containers.

The target below is free at every layer: Hugging Face Spaces for the app, Neon
for Postgres, Google AI Studio for the model.

## 1. Postgres (Neon) — free

Without this the case bank falls back to a SQLite file inside the container.
Deployed filesystems are ephemeral, so that file is erased on every restart,
redeploy, and wake-from-sleep, taking the accumulated statistics with it.

1. Create a project at <https://neon.tech> (no card required).
2. Copy the connection string:
   `postgresql://user:pass@ep-xxx.aws.neon.tech/neondb?sslmode=require`

Keep `?sslmode=require` — Neon rejects unencrypted connections.

The `cases` table is created on first use; there is no migration step.

## 2. Model key (Gemini) — free tier

<https://aistudio.google.com/apikey> → **Create API key**.

One key is enough. The provider is resolved by whichever key is present, in the
order Anthropic → Gemini → OpenAI, so `GEMINI_API_KEY` alone selects Gemini.
With no key at all the app still runs: answers come from dossier retrieval and
matched precedents, without model narration.

## 3. Hugging Face Spaces — free

1. <https://huggingface.co/new-space> → SDK **Docker**, hardware **CPU basic**.
2. Push this repository to the Space remote.
3. **Settings → Variables and secrets**, add as *secrets*:

   | Secret | Value |
   | --- | --- |
   | `DATABASE_URL` | the Neon string from step 1 |
   | `GEMINI_API_KEY` | the key from step 2 |

Spaces reads the YAML block at the top of `README.md` for `sdk` and `app_port`;
both are already set. The first build takes roughly 5–10 minutes.

### Verify

`GET /health` reports what actually resolved, not what was configured:

```json
{
  "status": "healthy",
  "llm": {"available": true, "provider": "gemini", "model": "gemini-2.5-flash"},
  "case_bank": "postgres"
}
```

`"case_bank": "sqlite (ephemeral)"` means `DATABASE_URL` did not reach the
process — data will be lost on restart. `"available": false` means no key was
found and the assistant is running retrieval-only.

## Environment variables

| Variable | Default | Notes |
| --- | --- | --- |
| `DATABASE_URL` | *(empty)* | Postgres for the case bank. Empty → ephemeral SQLite. |
| `ANTHROPIC_API_KEY` / `GEMINI_API_KEY` / `OPENAI_API_KEY` | *(empty)* | Any one enables the LLM path. |
| `LLM_PROVIDER` | *(empty)* | Pins a provider: `claude`, `gemini`, or `openai`. Leave empty to auto-detect. |
| `CLAUDE_MODEL` / `GEMINI_MODEL` / `OPENAI_MODEL` | see `llm.py` | Per-provider model override. |
| `JWT_SECRET_KEY` | default fallback | Secret key for signing JWT tokens. Set a random 32-byte string in staging/prod. |
| `DEFAULT_ADMIN_PASSWORD` | generated random | Password for the initial seeded `admin` account. Set explicitly for staging/prod. |
| `LEGAL_CASE_BANK_SALT` | generated | Dedupe-hash salt. Set explicitly when `DATABASE_URL` is set, see below. |
| `VECTOR_STORE_PROVIDER` | `memory` | `qdrant` requires installing `qdrant-client`. |
| `EMBEDDING_PROVIDER` | `hash` | `local_sentence_transformers` requires installing that package. |

### Set `LEGAL_CASE_BANK_SALT` in production

The salt defaults to a random value written next to the database file. On an
ephemeral filesystem that file does not survive a restart, so a new salt is
generated and previously-recorded dossiers stop matching — the same dossier is
then counted twice. Set it explicitly to any long random string and keep it
stable for the life of the deployment.

## Cost and limits

Free tier constraints worth knowing before sharing the link:

- **Spaces sleeps after 48h idle.** The next visitor waits ~10–30s while the
  container restarts; no data is lost once `DATABASE_URL` is set.
- **Neon free is 0.5 GB** and scales to zero, adding ~1s to the first query.
- **Gemini free tier is rate-limited per minute and per day.** Exceeding it does
  not break the app — it falls back to retrieval-only until the quota resets.

To remove the sleep, the cheapest path is Fly.io (~$3–5/month) for the app while
keeping Neon and Gemini on their free tiers.

## Optional heavy dependencies

`requirements.txt` deliberately omits `sentence-transformers`, `qdrant-client`,
`google-cloud-vision`, and `boto3`. They are lazy-loaded, none of the defaults
touch them, and `sentence-transformers` alone pulls ~2 GB of torch. Uncomment
the ones a given deployment actually enables — the image is roughly 700 MB
without them and several gigabytes with.
