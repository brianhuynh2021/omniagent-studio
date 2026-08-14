/**
 * Where the API lives, relative to wherever this bundle is being served from.
 *
 * Deployed, FastAPI serves both the API and this bundle from one origin, so a
 * relative path is correct and is also the only thing that works: an absolute
 * localhost URL would resolve against the *visitor's* machine, not the server.
 *
 * In development the Vite dev server (5173) and the API (8001) are separate
 * origins, so that one case needs an absolute URL. It is keyed on the dev
 * server's port rather than on the hostname, because running the production
 * container locally also reports hostname "localhost" while serving the API
 * from its own port.
 */
const DEV_API_ORIGIN = 'http://localhost:8001';
const DEV_PORTS = new Set(['5173', '3000']);

const isViteDevServer =
  typeof window !== 'undefined' && DEV_PORTS.has(window.location.port);

/** Absolute URL for an API path such as `/api/v1/legal/process`. */
export function apiUrl(path) {
  const normalised = path.startsWith('/') ? path : `/${path}`;
  return isViteDevServer ? `${DEV_API_ORIGIN}${normalised}` : normalised;
}

/** Base for a group of endpoints, e.g. `apiBase('/api/v1/legal')`. */
export function apiBase(path) {
  return apiUrl(path);
}
