import { GITHUB_USERNAME } from '../consts';

export interface GithubProfile {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  company: string | null;
  location: string | null;
  blog: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

export interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

export interface ContributionGrid {
  weeks: (ContributionDay | null)[][];
  total: number;
  from: string;
  to: string;
}

const API = 'https://api.github.com';
const CONTRIBUTIONS_API = 'https://github-contributions-api.jogruber.de/v4';
const TIMEOUT_MS = 10_000;

function apiHeaders(): Record<string, string> {
  const token =
    typeof process !== 'undefined' ? process.env.GITHUB_TOKEN : undefined;
  return {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'vchocolate-blog-build',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function getGithubProfile(): Promise<GithubProfile | null> {
  try {
    const res = await fetch(`${API}/users/${GITHUB_USERNAME}`, {
      headers: apiHeaders(),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) {
      console.warn(`[github] profile request failed: ${res.status}`);
      return null;
    }
    return (await res.json()) as GithubProfile;
  } catch (error) {
    console.warn(`[github] profile request error: ${error}`);
    return null;
  }
}

export async function getGithubContributions(): Promise<ContributionGrid | null> {
  try {
    const res = await fetch(`${CONTRIBUTIONS_API}/${GITHUB_USERNAME}?y=last`, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) {
      console.warn(`[github] contributions request failed: ${res.status}`);
      return null;
    }
    const data = (await res.json()) as {
      total?: { lastYear?: number };
      contributions?: ContributionDay[];
    };
    const days = data.contributions ?? [];
    if (days.length === 0) return null;

    const byDate = new Map(days.map((day) => [day.date, day]));
    const from = days[0].date;
    const to = days[days.length - 1].date;
    const first = new Date(`${from}T00:00:00Z`);
    const last = new Date(`${to}T00:00:00Z`);
    const start = new Date(first);
    start.setUTCDate(start.getUTCDate() - start.getUTCDay());

    const weeks: (ContributionDay | null)[][] = [];
    let week: (ContributionDay | null)[] = [];
    for (
      let cursor = new Date(start);
      cursor <= last;
      cursor.setUTCDate(cursor.getUTCDate() + 1)
    ) {
      const key = cursor.toISOString().slice(0, 10);
      if (cursor < first) {
        week.push(null);
      } else {
        week.push(byDate.get(key) ?? { date: key, count: 0, level: 0 });
      }
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
    }
    if (week.length > 0) {
      while (week.length < 7) week.push(null);
      weeks.push(week);
    }

    return {
      weeks,
      total:
        typeof data.total?.lastYear === 'number'
          ? data.total.lastYear
          : days.reduce((sum, day) => sum + day.count, 0),
      from,
      to,
    };
  } catch (error) {
    console.warn(`[github] contributions request error: ${error}`);
    return null;
  }
}
