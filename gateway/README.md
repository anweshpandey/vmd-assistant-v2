# VMD Assistant AI — Cloudflare Worker gateway

This Worker is the server-side AI gateway for the GitHub Pages frontend.

## 1. Install and authenticate

```bash
npm install -g wrangler
wrangler login
```

## 2. Deploy

From this directory:

```bash
cd gateway
wrangler deploy
```

## 3. Add provider secrets

Free mode uses server-side provider keys. Do **not** put these in `index.html`, GitHub, or localStorage.

```bash
wrangler secret put OPENROUTER_API_KEY
wrangler secret put GEMINI_API_KEY
wrangler secret put GROQ_API_KEY
```

You can omit a provider secret; the Worker will skip that route and continue through the fallback pool.

## 4. Connect GitHub Pages

After deployment Wrangler prints a URL such as:

`https://vmd-assistant-gateway.<your-subdomain>.workers.dev`

Edit `../assets/gateway-config.js`:

```js
window.VMD_GATEWAY_URL = "https://vmd-assistant-gateway.<your-subdomain>.workers.dev";
```

Commit and push that one public URL change. No secret belongs in the repository.

## 5. Test

```bash
curl https://vmd-assistant-gateway.<your-subdomain>.workers.dev/health
```

The response reports which server-side free-provider keys are configured, without revealing their values.

## Free-only safety

The Worker contains an explicit `FREE_MODELS` allow-list and rejects `paid-*` selections. The browser cannot turn on OpenAI/Claude/paid DeepSeek by changing the UI. Premium routing can be added later as a separate, deliberate phase.
