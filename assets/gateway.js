/* FREE-ONLY gateway client for all Scientific AI Assistants.
   No provider API key belongs in this file or in browser storage. */
window.SCI_AI_ASSISTANT = 'vmd';
window.SCI_AI_GATEWAY = window.SCI_AI_GATEWAY || 'https://YOUR-SCIENTIFIC-AI-GATEWAY.example/api/chat';

window.scientificAIRequest = async function(payload) {
  if (!window.SCI_AI_GATEWAY || window.SCI_AI_GATEWAY.includes('YOUR-SCIENTIFIC-AI-GATEWAY')) {
    throw new Error('Free AI gateway is not configured yet.');
  }
  const res = await fetch(window.SCI_AI_GATEWAY, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || `Free AI gateway HTTP ${res.status}`);
    err.code = data.code;
    err.attempted = data.attempted;
    throw err;
  }
  return data;
};
