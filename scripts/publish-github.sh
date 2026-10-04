#!/usr/bin/env bash
set -euo pipefail
OWNER="anweshpandey"
REPO="vmd-assistant-v2"
cd "$(dirname "$0")/.."
if ! command -v gh >/dev/null 2>&1; then echo "GitHub CLI (gh) is required."; exit 1; fi
if ! gh auth status >/dev/null 2>&1; then echo "Run: gh auth login"; exit 1; fi
if [ ! -d .git ]; then git init; fi
git branch -M main
git add .
git commit -m "Initial VMD Assistant v2" || true
if ! git remote get-url origin >/dev/null 2>&1; then git remote add origin "https://github.com/${OWNER}/${REPO}.git"; fi
if ! gh repo view "${OWNER}/${REPO}" >/dev/null 2>&1; then gh repo create "${OWNER}/${REPO}" --public --source=. --remote=origin --push; else git push -u origin main; fi
echo
echo "GitHub Pages workflow is now deploying."
echo "Site: https://${OWNER}.github.io/${REPO}/"
echo
echo "Next: deploy gateway/ and put its workers.dev URL in assets/gateway-config.js, then git add/commit/push."
