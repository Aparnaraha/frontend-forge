// Stubbed API layer. Throws so UI surfaces error banners until backend is wired.
// Replace with real fetch calls when the backend is available.

const NOT_IMPLEMENTED =
  "API not connected yet. Wire src/app/lib/api.js to your backend.";

/**
 * Generic OData-style fetcher.
 * @param {string} _path   e.g. "/Pricing?$filter=..."
 * @param {RequestInit} [_opts]
 * @returns {Promise<any>}
 */
export async function apiFetch(_path, _opts) {
  throw new Error(NOT_IMPLEMENTED);
}

/**
 * Bound action invocation (submit / approve / reject ...).
 * @param {string} _name
 * @param {Record<string, unknown>} [_payload]
 * @returns {Promise<{ value: string }>}
 */
export async function apiAction(_name, _payload) {
  throw new Error(NOT_IMPLEMENTED);
}
