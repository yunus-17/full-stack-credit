export function apiFetch(path, { method = 'GET', token, body, headers } = {}) {
  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  }
  return fetch(path.startsWith('/api') ? path : `/api${path}`, opts).then(async (res) => {
    const data = await res.json().catch(() => null)
    if (!res.ok) throw new Error(data?.error || 'Request failed')
    return data
  })
}
