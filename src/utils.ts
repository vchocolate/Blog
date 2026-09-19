export const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

export function withBase(path = ''): string {
  const clean = path.replace(/^\//, '');
  return clean ? `${BASE}/${clean}` : `${BASE}/`;
}

const CJK = /[\u3400-\u4dbf\u4e00-\u9fff]/g;

export function readingTime(body: string | undefined): number {
  if (!body) return 1;
  const cjk = (body.match(CJK) ?? []).length;
  const words = (body.replace(CJK, ' ').match(/[A-Za-z0-9]+/g) ?? []).length;
  return Math.max(1, Math.ceil(cjk / 400 + words / 200));
}
