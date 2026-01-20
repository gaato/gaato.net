# gaato.net access counter (Cloudflare Worker)

This Worker serves a classic-style SVG counter at:

- `/counter.svg?page=site` (default: `page=site`)

It increments on each `GET` (set `inc=0` to read without increment).

It also exposes:

- `/stats.svg` (today/yesterday unique visitors, JST)
- `/stats.json` (today/yesterday `{uu,pv}`, JST)

## Deploy (Wrangler)

From this folder:

1. `npm i -g wrangler`
2. `wrangler login`
3. Edit `wrangler.toml` and enable either:
   - same-domain route: `gaato.net/counter.svg*`
   - or a custom domain/subdomain
4. `wrangler deploy`

## Hook it up (site HTML)

The site already references:

- `/counter.svg?page=site`
- `/stats.svg`

So once the Worker route is active, it should “just work” without changing Caddy.

Notes:

- Uses Durable Objects for atomic increments (better than KV for counters).
- Returns `Cache-Control: no-store` to avoid CDN/browser caching.
  - If you have aggressive Cloudflare Cache Rules (e.g. “Cache Everything”), exclude `/counter.svg*`.
  - Also exclude `/stats.svg*` and `/stats.json*`.
- Daily unique visitors are tracked via a first-party cookie (`gaato_vid`, set by `/counter.svg`) and counted in JST (Asia/Tokyo).
