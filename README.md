# VMD Assistant AI v2
available at: https://anweshpandey.github.io/vmd-assistant-v2

A clean GitHub Pages + Cloudflare Worker architecture for a scientific VMD assistant.

## Features

- VMD/Tcl-focused AI chat
- Free model selector with **Auto · Free**
- OpenRouter free router
- DeepSeek V4 Flash 0731, V4 Flash 0423, V3, V3.1, R1, R1 0528 and R1 Distill free endpoints through OpenRouter
- Gemini free API route
- Groq free API route
- Automatic free fallback
- Provider/model shown in the UI
- No browser API keys
- No localStorage API keys
- Local-only saved Tcl snippets
- VMD command cheat sheet
- Responsive scientific-software UI
- Paid OpenAI/GPT, Anthropic/Claude, paid DeepSeek and paid Gemini reserved for a later phase

## Repository layout

```text
vmd-assistant-v2/
├── index.html
├── README.md
├── assets/
│   ├── free-mode.js
│   ├── gateway-config.js
│   └── gateway.js
└── gateway/
    ├── README.md
    ├── wrangler.toml
    └── src/index.js
```

## GitHub Pages

A GitHub Actions workflow is included. It deploys the root directory to GitHub Pages automatically on every push to `main`. After creating the repository, the site will be at `https://anweshpandey.github.io/vmd-assistant-v2/`.

You can publish from the prepared directory with:

```bash
./scripts/publish-github.sh
```

## Gateway

The Worker instructions are in `gateway/README.md`. Provider secrets belong only in Cloudflare Worker secrets.

### Important

Free provider/model availability and rate limits can change. The frontend therefore keeps the free model registry in one file and the Worker keeps a server-side allow-list. Update both when a provider changes a free model slug.
