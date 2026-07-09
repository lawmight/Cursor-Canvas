# Cursor-Canvas

Publish Cursor Canvas files (`.canvas.tsx`) to a live public URL — no Cloudflare account or API key required.

Cursor canvases import only from `cursor/canvas`, a module the Cursor IDE provides at compile time, so they cannot build or render outside the IDE on their own. This repo packages a **`publish-canvas` skill** that any Cursor agent (including cloud agents) can call to put a canvas online:

1. Builds the canvas with [`@thisismydesign/cursor-canvas-web`](https://github.com/thisismydesign/cursor-canvas-web), an MIT-licensed shim of the `cursor/canvas` SDK (a Vite alias swaps the module at build time — the canvas source never changes).
2. Deploys the static build to Cloudflare Workers:
   - **No credentials?** Uses [`wrangler deploy --temporary`](https://developers.cloudflare.com/workers/platform/claim-deployments/): Cloudflare provisions a temporary preview account, the canvas goes live on a `workers.dev` URL for **60 minutes**, and you get a **claim URL** to keep it permanently on your own (new or existing) Cloudflare account.
   - **`CLOUDFLARE_API_TOKEN` set or `wrangler login` done?** Normal permanent deploy.

## Usage

Ask the agent that generated your canvas:

> Publish my canvas with the publish-canvas skill

Or run the script directly:

```bash
bash .cursor/skills/publish-canvas/publish.sh ~/.cursor/projects/<workspace>/canvases/<name>.canvas.tsx
```

Example output:

```
Temporary account ready:
    Claim within: 60 minutes
    Claim URL: https://dash.cloudflare.com/claim-preview?claimToken=...
✨ Success! Uploaded 3 files
  https://canvas-<name>.<random-name>.workers.dev
```

Open the `workers.dev` URL in a browser to view the canvas. Open the claim URL within 60 minutes to keep the deployment.

## Layout

| Path | Role |
| --- | --- |
| `.cursor/skills/publish-canvas/SKILL.md` | The skill definition agents follow. |
| `.cursor/skills/publish-canvas/publish.sh` | Build + deploy script. |
| `.cursor/skills/publish-canvas/template/` | Vite app template with the `cursor/canvas` → shim alias. |
| `examples/bags-tshirt-jewelry.canvas.tsx` | Example canvas used for testing. |

## Caveats

- Temporary deployments are deleted after 60 minutes unless claimed; the claim URL grants ownership, treat it as sensitive.
- Temporary preview URLs sit behind a Cloudflare bot challenge (fine in a browser, blocks `curl`).
- Shim fidelity gaps: `DiffView` has no syntax highlighting, `useCanvasAction` is a no-op on the web, and styling approximates the Cursor theme.
- The published page is public to anyone with the URL — don't publish canvases containing private data.
