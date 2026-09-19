export const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

export function withBase(path = ''): string {
  const clean = path.replace(/^\//, '');
  return clean ? `${BASE}/${clean}` : `${BASE}/`;
}
