  const API = `${process.env.REACT_APP_API_URL}/api`;

export async function fetchJSON(url="", options) {
  const res = await fetch(`${API}/${url}`, options);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  if (res.status === 204) return null;
  return res.json();
}
