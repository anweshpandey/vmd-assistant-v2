# VMD Assistant AI
available at: https://anweshpandey.github.io/vmd-assistant

Standalone scientific AI assistant for **Visual Molecular Dynamics (VMD)**, Tcl scripting, atom selections, trajectory analysis, and molecular visualization.

## Features

- Domain-specific VMD AI chat
- Built-in VMD command cheat sheet and examples
- Saved Tcl snippets
- Responsive dark scientific-software interface
- Free-only AI provider selector with automatic fallback
- No provider API keys stored in the browser or repository

## Free AI provider selector

The top-right **AI Provider / LLM Route** control currently exposes:

- **Auto · Free** — automatic free-provider fallback
- **OpenRouter Free** — automatic routing among currently available free models
- **Gemini Free** — Google Gemini API free tier
- **Groq Free** — Groq free-plan inference

Phase 1 intentionally does not expose paid providers. Exact model selection is controlled by the secure gateway because free-model availability can change over time.

## Security

The public frontend does **not** contain provider API keys. AI requests are sent to the secure gateway configured in `assets/gateway.js`. Provider secrets belong on the server/gateway side only.

Do **not** put Gemini, OpenRouter, Groq, or any other provider API key into this repository, `localStorage`, or client-side JavaScript.

## GitHub Pages

The application entry point is `index.html`. When GitHub Pages is configured to publish from `main` / `/(root)`, pushes to the selected publishing source are automatically published to the project site.

## Configuration

Edit `assets/gateway.js` and set `SCI_AI_GATEWAY` to your deployed secure AI gateway endpoint. The gateway should enforce free-only routing for Phase 1 and return the provider actually used so the UI can display the current provider/fallback status.

MIT License

Copyright (c) 2026 Anwesh Pandey
