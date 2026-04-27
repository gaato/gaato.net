## Verification

Use the repo-local toolchain through `mise exec -- ...`.

Codex sandboxing can make mise's default cache and install locations read-only (`~/.cache/mise` and `~/.local/share/mise`). If a tool is already installed, `mise exec -- ...` is usually enough. If mise needs to resolve a new version, install a new tool, run `mise use`, or rebuild bin-path metadata, request sandbox escalation rather than working around it in the repo.

For one-off cache writes during read-only sandboxed checks, prefer a temporary cache directory:

```sh
MISE_CACHE_DIR=/tmp/mise-cache mise exec -- <command>
```

Do not set `MISE_DATA_DIR` to a repo path. Use `/tmp` only for disposable installs, or use escalation when the normal user-level mise install should be updated.

Before handing off changes that affect generated pages, assets, build scripts, or deployment, run:

```sh
mise exec -- bun run check
```

When the change should match the GitHub Actions deploy workflow more closely, also run the CI-only checks locally:

```sh
mise exec -- bun run preview
```

In another shell, after the preview server is listening on `127.0.0.1:4173`, run:

```sh
mise exec -- bun run check:a11y
mise exec -- lychee --no-progress --root-dir "$PWD/dist" --accept 200,204,206,429 dist/index.html dist/ja/index.html README.md dist/sitemap.xml dist/robots.txt dist/site.webmanifest
```

Stop the preview server after the accessibility check finishes.
