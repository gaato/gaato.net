export interface Env {
  COUNTER: DurableObjectNamespace;
}

const TOKYO_TZ = "Asia/Tokyo";

function sanitizePage(raw: string | null): string {
  const fallback = "site";
  const value = (raw ?? fallback).trim().slice(0, 64) || fallback;
  const safe = value.replace(/[^a-zA-Z0-9_-]/g, "_");
  return safe || fallback;
}

function clampInt(value: string | null, min: number, max: number, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

function formatJstDate(date: Date): string {
  // en-CA gives YYYY-MM-DD in most runtimes.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TOKYO_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function jstDateDaysAgo(daysAgo: number): string {
  const date = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
  return formatJstDate(date);
}

function getCookieValue(cookieHeader: string | null, name: string): string | null {
  if (!cookieHeader) return null;
  const parts = cookieHeader.split(";");
  for (const part of parts) {
    const [k, ...rest] = part.trim().split("=");
    if (k === name) return rest.join("=") || "";
  }
  return null;
}

function makeVisitorId(): string {
  return (crypto as Crypto).randomUUID();
}

function makeCounterSvg(count: number, digits: number): string {
  const text = String(count).padStart(digits, "0").slice(-digits);
  const width = 128;
  const height = 24;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="access counter">
  <rect x="0" y="0" width="${width}" height="${height}" fill="#000000"/>
  <rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" fill="none" stroke="#00ff00"/>
  <text x="8" y="17" fill="#00ff00" font-family="Courier New, Courier, monospace" font-size="16" letter-spacing="1">${text}</text>
</svg>`;
}

function makeStatsSvg(today: number, yesterday: number, digits: number): string {
  const t = String(today).padStart(digits, "0").slice(-digits);
  const y = String(yesterday).padStart(digits, "0").slice(-digits);
  const width = 220;
  const height = 24;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="today and yesterday visitors">
  <rect x="0" y="0" width="${width}" height="${height}" fill="#000000"/>
  <rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" fill="none" stroke="#00ff00"/>
  <text x="8" y="17" fill="#00ff00" font-family="Courier New, Courier, monospace" font-size="14">TODAY ${t} / YDAY ${y}</text>
</svg>`;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/healthz") {
      return new Response("ok\n", { status: 200, headers: { "content-type": "text/plain; charset=utf-8" } });
    }

    if (url.pathname !== "/counter.svg" && url.pathname !== "/stats.svg" && url.pathname !== "/stats.json") {
      return new Response("Not Found\n", { status: 404, headers: { "content-type": "text/plain; charset=utf-8" } });
    }

    const page = sanitizePage(url.searchParams.get("page"));
    const digits = clampInt(url.searchParams.get("digits"), 4, 12, 8);

    const forwardedUrl = new URL(request.url);
    forwardedUrl.searchParams.set("page", page);
    forwardedUrl.searchParams.set("digits", String(digits));

    // Single DO for the whole site (keeps daily-unique tracking consistent across pages).
    const id = env.COUNTER.idFromName("site");
    const stub = env.COUNTER.get(id);

    const forwardedRequest = new Request(forwardedUrl.toString(), request);
    return stub.fetch(forwardedRequest);
  },
};

export class CounterDO implements DurableObject {
  private state: DurableObjectState;

  constructor(state: DurableObjectState) {
    this.state = state;
  }

  private async pruneOldSeenKeys(todayJst: string): Promise<void> {
    const lastPrune = (await this.state.storage.get<string>("meta:lastPruneJst")) ?? "";
    if (lastPrune === todayJst) return;

    // Keep roughly the last 31 days of "seen" keys.
    const minKeep = jstDateDaysAgo(31);

    let start: string | undefined = undefined;
    for (;;) {
      const batch = await this.state.storage.list<number>({ prefix: "seen:", start, limit: 1000 });
      if (batch.size === 0) break;

      let lastKey: string | undefined;
      const toDelete: string[] = [];

      for (const [key] of batch) {
        lastKey = key;
        if (!key.startsWith("seen:")) continue;
        const datePart = key.slice("seen:".length, "seen:".length + 10);
        if (datePart && datePart < minKeep) toDelete.push(key);
      }

      if (toDelete.length > 0) await this.state.storage.delete(toDelete);
      if (!lastKey) break;
      start = `${lastKey}\0`;
      if (batch.size < 1000) break;
    }

    await this.state.storage.put("meta:lastPruneJst", todayJst);
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const method = request.method.toUpperCase();

    const digits = clampInt(url.searchParams.get("digits"), 4, 12, 8);
    const shouldIncrement = method === "GET" && url.pathname === "/counter.svg" && url.searchParams.get("inc") !== "0";
    const page = sanitizePage(url.searchParams.get("page"));

    const todayJst = formatJstDate(new Date());
    const yesterdayJst = jstDateDaysAgo(1);

    // Best-effort pruning; keeps storage growth bounded.
    if (url.pathname === "/counter.svg" && shouldIncrement) {
      await this.pruneOldSeenKeys(todayJst);
    }

    if (url.pathname === "/stats.json") {
      const [uuToday, uuYesterday, pvToday, pvYesterday] = await Promise.all([
        this.state.storage.get<number>(`uu:${todayJst}`),
        this.state.storage.get<number>(`uu:${yesterdayJst}`),
        this.state.storage.get<number>(`pv:${todayJst}`),
        this.state.storage.get<number>(`pv:${yesterdayJst}`),
      ]);

      const body = JSON.stringify(
        {
          tz: TOKYO_TZ,
          today: { date: todayJst, uu: uuToday ?? 0, pv: pvToday ?? 0 },
          yesterday: { date: yesterdayJst, uu: uuYesterday ?? 0, pv: pvYesterday ?? 0 },
        },
        null,
        2,
      );

      const headers = new Headers();
      headers.set("content-type", "application/json; charset=utf-8");
      headers.set("cache-control", "no-store, max-age=0");
      headers.set("pragma", "no-cache");

      return new Response(body, { status: 200, headers });
    }

    if (url.pathname === "/stats.svg") {
      const [uuToday, uuYesterday] = await Promise.all([
        this.state.storage.get<number>(`uu:${todayJst}`),
        this.state.storage.get<number>(`uu:${yesterdayJst}`),
      ]);

      const svg = makeStatsSvg(uuToday ?? 0, uuYesterday ?? 0, clampInt(url.searchParams.get("digits"), 2, 8, 4));

      const headers = new Headers();
      headers.set("content-type", "image/svg+xml; charset=utf-8");
      headers.set("cache-control", "no-store, max-age=0");
      headers.set("pragma", "no-cache");

      if (method === "HEAD") return new Response(null, { status: 200, headers });
      return new Response(svg, { status: 200, headers });
    }

    // /counter.svg
    const cookieHeader = request.headers.get("Cookie");
    let visitorId = getCookieValue(cookieHeader, "gaato_vid");
    const setCookieHeaders: string[] = [];
    if (!visitorId) {
      visitorId = makeVisitorId();
      setCookieHeaders.push(`gaato_vid=${visitorId}; Path=/; Max-Age=31536000; Secure; SameSite=Lax`);
    }

    let count = (await this.state.storage.get<number>(`count:${page}`)) ?? 0;

    if (shouldIncrement) {
      await this.state.storage.transaction(async (txn) => {
        const countKey = `count:${page}`;
        const pvKey = `pv:${todayJst}`;
        const uuKey = `uu:${todayJst}`;
        const seenKey = `seen:${todayJst}:${visitorId}`;

        const [currentCount, currentPv, currentUu, alreadySeen] = await Promise.all([
          txn.get<number>(countKey),
          txn.get<number>(pvKey),
          txn.get<number>(uuKey),
          txn.get<number>(seenKey),
        ]);

        const nextCount = (currentCount ?? 0) + 1;
        const nextPv = (currentPv ?? 0) + 1;

        const puts: Record<string, number> = {
          [countKey]: nextCount,
          [pvKey]: nextPv,
        };

        if (!alreadySeen) {
          puts[seenKey] = 1;
          puts[uuKey] = (currentUu ?? 0) + 1;
        }

        await txn.put(puts);
        count = nextCount;
      });
    }

    const svg = makeCounterSvg(count, digits);

    const headers = new Headers();
    headers.set("content-type", "image/svg+xml; charset=utf-8");
    headers.set("cache-control", "no-store, max-age=0");
    headers.set("pragma", "no-cache");
    headers.set("vary", "cookie");
    for (const sc of setCookieHeaders) headers.append("set-cookie", sc);

    if (method === "HEAD") {
      return new Response(null, { status: 200, headers });
    }

    return new Response(svg, { status: 200, headers });
  }
}
