const BASE = import.meta.env.VITE_API_BASE_URL || "";

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function request(path) {
  let res;
  try {
    res = await fetch(`${BASE}${path}`);
  } catch (err) {
    throw new ApiError(
      "Can't reach the DepRadius API. Is the backend server running?",
      0
    );
  }

  let body = null;
  try {
    body = await res.json();
  } catch {
    // no JSON body — fall through with res.ok check below
  }

  if (!res.ok) {
    throw new ApiError(
      body?.message || `Request failed with status ${res.status}`,
      res.status
    );
  }
  return body;
}

export const api = {
  overview: () => request("/api/packages/overview"),
  search: (term) => request(`/api/packages/search?q=${encodeURIComponent(term)}`),
  packageDetail: (name) => request(`/api/packages/${encodeURIComponent(name)}`),
  blastRadius: (name, maxHops = 6) =>
    request(`/api/graph/blast-radius?name=${encodeURIComponent(name)}&maxHops=${maxHops}`),
  exposure: (name, maxHops = 6) =>
    request(`/api/graph/exposure?name=${encodeURIComponent(name)}&maxHops=${maxHops}`),
  shortestPath: (from, to) =>
    request(`/api/graph/shortest-path?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`),
  cycles: () => request("/api/graph/cycles"),
  busFactor: (maxHops = 6) => request(`/api/graph/bus-factor?maxHops=${maxHops}`),
};

export { ApiError };
