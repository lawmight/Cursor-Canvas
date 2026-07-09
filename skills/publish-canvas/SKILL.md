---
name: publish-canvas
description: >-
  Publish a Cursor Canvas (.canvas.tsx) to a live public URL. Use when the
  user asks to publish, deploy, share, or "put online" a canvas the agent
  generated, or wants a browser link for a canvas outside the Cursor IDE.
  Builds the canvas with an open-source cursor/canvas shim and deploys it to
  Cloudflare Workers — using `wrangler deploy --temporary` when no Cloudflare
  credentials are available, which requires no account or API key.
  Open Plugin skill: cursor-canvas:publish-canvas
---

# Publish Canvas

Turn a local `.canvas.tsx` file into a live web page.

Cursor canvases import only from `cursor/canvas`, a module the IDE provides at
compile time, so they cannot render outside Cursor by default. This skill
builds the canvas against [`@thisismydesign/cursor-canvas-web`](https://github.com/thisismydesign/cursor-canvas-web)
(an MIT-licensed Mantine-backed shim of the same API) and deploys the static
result to Cloudflare Workers.

## Locating the canvas

Canvas files live outside the repo, in Cursor's managed folder:

```
~/.cursor/projects/<workspace>/canvases/<name>.canvas.tsx
```

If the user names a canvas but not a path, look there first:

```bash
ls ~/.cursor/projects/*/canvases/*.canvas.tsx
```

## Publishing

Run the script in this skill's directory:

```bash
bash <skill-dir>/publish.sh <path-to>.canvas.tsx [worker-name]
```

What it does:

1. Copies the Vite template from `template/` into a temp dir.
2. Copies the canvas to `src/canvas.canvas.tsx` (the template imports that path).
3. `npm install` + `vite build` — the Vite alias resolves `cursor/canvas` to the shim.
4. Deploys `dist/` as a static-assets Worker:
   - **With Cloudflare credentials** (`CLOUDFLARE_API_TOKEN` env var or a
     `wrangler login` session): a normal, permanent deploy on the account.
   - **Without credentials**: `wrangler deploy --temporary` (Wrangler >= 4.102).
     Cloudflare provisions a temporary preview account, deploys to a live
     `workers.dev` URL, and prints a **claim URL**.

## Reporting back to the user

Always relay both URLs from the wrangler output:

- The live `https://<name>.<subdomain>.workers.dev` URL — the published canvas.
- For temporary deploys, the **claim URL** — warn the user that the deployment
  is deleted after **60 minutes** unless they open the claim URL and attach it
  to a (new or existing) Cloudflare account. Treat the claim URL as sensitive;
  it grants ownership of the temporary account.

## Constraints and caveats

- Temporary preview accounts: up to 1,000 static files, 5 MiB per file —
  far above what a canvas build produces.
- `--temporary` errors out if wrangler is already authenticated; the script
  handles this by checking for credentials first.
- Cloudflare rate-limits temporary account creation; on failure, wait and
  retry, or set `CLOUDFLARE_API_TOKEN` for a permanent deploy.
- Shim fidelity: `DiffView` renders without Shiki syntax highlighting,
  `useCanvasAction` is a no-op on the web, and styling approximates (not
  pixel-matches) the Cursor theme.
- The canvas must import only from `cursor/canvas` (all standard canvases do).
- The published page is public to anyone with the URL. Don't publish canvases
  containing secrets or private data without confirming with the user.
- Temporary preview deployments sit behind a Cloudflare bot challenge, so
  `curl` gets a "Just a moment..." interstitial; verify in a real browser
  instead. Claimed/permanent deploys serve directly.
