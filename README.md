# gaato.net

- `site/`: Cloudflare Pages (static site)
- `worker/`: Cloudflare Worker (counter + stats)

## Deploy

### Pages

Connect this repository to Cloudflare Pages.

- Project root: repository root
- Build command: (none)
- Output directory: `site`

### Worker

This repo includes a GitHub Action which deploys the Worker on pushes to `main`.

Set these GitHub Secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

The Worker uses routes in `worker/wrangler.toml` (`/counter.svg`, `/stats.svg`, `/stats.json`).
