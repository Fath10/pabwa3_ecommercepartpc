// ─────────────────────────────────────────────────────────────
// Central HTTP client for the e-BuildPC backend.
// Handles base URL, JSON (de)serialization, JWT auth headers,
// uniform error handling, and asset URL resolution.
// ─────────────────────────────────────────────────────────────

// Trim a trailing slash so we can safely concatenate paths.
export const API_BASE = (
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
).replace(/\/$/, '')

const TOKEN_KEY = 'token'

/** Error thrown for any non-2xx API response. */
export class ApiError extends Error {
  constructor(message, status, data) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

/**
 * Resolve a (possibly relative) asset path returned by the backend
 * — e.g. "/uploads/products/123.png" — into a fully qualified URL.
 * Absolute URLs and frontend public assets are returned unchanged.
 */
export function assetUrl(path) {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) return path
  if (path.startsWith('/uploads')) return `${API_BASE}${path}`
  return path
}

/**
 * Perform an API request.
 * @param {string} path           e.g. "/api/products"
 * @param {object} options
 * @param {string} [options.method='GET']
 * @param {object|FormData} [options.body]
 * @param {boolean} [options.auth=false]   attach the JWT bearer token
 * @param {object} [options.headers]
 */
export async function request(path, options = {}) {
  const { method = 'GET', body, auth = false, headers = {} } = options

  const finalHeaders = { ...headers }
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData

  let payload = body
  if (body !== undefined && body !== null && !isFormData) {
    finalHeaders['Content-Type'] = 'application/json'
    payload = JSON.stringify(body)
  }

  if (auth) {
    const token = getToken()
    if (token) finalHeaders.Authorization = `Bearer ${token}`
  }

  let response
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method,
      headers: finalHeaders,
      body: payload,
    })
  } catch (networkError) {
    throw new ApiError(
      'Tidak dapat terhubung ke server. Pastikan backend e-BuildPC sedang berjalan.',
      0,
      null
    )
  }

  // 204 No Content or empty body
  const text = await response.text()
  let data = null
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = text
    }
  }

  if (!response.ok) {
    const message =
      (data && typeof data === 'object' && (data.message || data.error)) ||
      (typeof data === 'string' && data) ||
      `Terjadi kesalahan (HTTP ${response.status})`

    // Notify the app so it can clear an expired/invalid session.
    if (response.status === 401 || response.status === 403) {
      window.dispatchEvent(new CustomEvent('auth:unauthorized'))
    }

    throw new ApiError(message, response.status, data)
  }

  return data
}

export const http = {
  get: (path, opts) => request(path, { ...opts, method: 'GET' }),
  post: (path, body, opts) => request(path, { ...opts, method: 'POST', body }),
  put: (path, body, opts) => request(path, { ...opts, method: 'PUT', body }),
  patch: (path, body, opts) => request(path, { ...opts, method: 'PATCH', body }),
  delete: (path, opts) => request(path, { ...opts, method: 'DELETE' }),
}
