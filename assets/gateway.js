/* Shared secure AI gateway configuration.
   No provider API key belongs in this file or browser storage. */
window.SCI_AI_GATEWAY = window.SCI_AI_GATEWAY || 'https://YOUR-SCIENTIFIC-AI-GATEWAY.example/api/chat';

window.scientificAIRequest = async function(payload) {
  if (!window.SCI_AI_GATEWAY || window.SCI_AI_GATEWAY.includes('YOUR-SCIENTIFIC-AI-GATEWAY')) {
    throw new Error('AI gateway is not configured yet. Set the deployed Worker URL in assets/gateway.js.');
  }
  const response = await fetch(window.SCI_AI_GATEWAY, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error?.message || data.error || `Gateway HTTP ${response.status}`);
  }
  return data;
};
