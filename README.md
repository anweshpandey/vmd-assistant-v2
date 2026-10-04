<img width="1914" height="882" alt="image" src="https://github.com/user-attachments/assets/087b9306-9d0d-4e99-bea9-f68a4c46ca68" /># VMD Assistant AI
available at: https://anweshpandey.github.io/vmd-assistant

Standalone scientific AI assistant for **Molecular dynamics visualization**.

## Features

- Domain-specific AI chat
- Built-in scientific cheatsheets and command/input examples
- Saved snippets where supported by the original application
- Responsive GitHub Pages-ready interface
- Shared Scientific AI Assistants design language

## Security

The public frontend does **not** contain a Gemini API key. AI requests are sent to the configured secure gateway in `assets/gateway.js`, where the provider secret must be stored server-side.

## GitHub Pages

Set the repository's Pages source to **GitHub Actions** or the repository root as appropriate. The application entry point is `index.html`.

## Configuration

Edit `assets/gateway.js` and set `SCI_AI_GATEWAY` to your deployed secure AI gateway endpoint. Do not add provider API keys to this repository.
