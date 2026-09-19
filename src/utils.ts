export const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

export function withBase(path = ''): string {
  const clean = path.replace(/^\//, '');
  return clean ? `${BASE}/${clean}` : `${BASE}/`;
}

const CJK = /[\u3400-\u4dbf\u4e00-\u9fff]/g;

function countText(body: string | undefined): { cjk: number; words: number } {
  if (!body) return { cjk: 0, words: 0 };
  const cjk = (body.match(CJK) ?? []).length;
  const words = (body.replace(CJK, ' ').match(/[A-Za-z0-9]+/g) ?? []).length;
  return { cjk, words };
}

export function wordCount(body: string | undefined): number {
  const { cjk, words } = countText(body);
  return cjk + words;
}

export function readingTime(body: string | undefined): number {
  const { cjk, words } = countText(body);
  return Math.max(1, Math.ceil(cjk / 400 + words / 200));
}
