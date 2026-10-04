/* Scientific AI Assistants — FREE MODE UI
 * Phase 1: free providers only. Paid accounts are intentionally not exposed.
 * Provider selection is a routing preference; the secure gateway still enforces FREE_ONLY.
 */
(() => {
  const assistant = window.SCI_AI_ASSISTANT || 'scientific-ai';
  const STORAGE_KEY = `sci_ai_provider_${assistant}`;
  const providers = [
    { id: 'auto', label: 'Auto · Free', short: 'Auto · Free', desc: 'Automatic free-provider fallback.', badge: 'RECOMMENDED' },
    { id: 'openrouter-free', label: 'OpenRouter Free', short: 'OpenRouter Free', desc: 'Automatic routing among currently available free models.' },
    { id: 'gemini', label: 'Gemini Free', short: 'Gemini Free', desc: 'Google Gemini API free tier.' },
    { id: 'groq', label: 'Groq Free', short: 'Groq Free', desc: 'Groq free-plan inference.' }
  ];

  const style = document.createElement('style');
  style.textContent = `
    .sci-free-pill{display:inline-flex;align-items:center;gap:.45rem;border:1px solid rgba(52,211,153,.35);background:rgba(15,23,42,.78);color:#a7f3d0;border-radius:999px;padding:.42rem .72rem;font:600 11px/1 ui-monospace,SFMono-Regular,Menlo,monospace;cursor:pointer;backdrop-filter:blur(10px);transition:.18s;white-space:nowrap}
    .sci-free-pill:hover{border-color:rgba(52,211,153,.65);background:rgba(16,30,48,.94);transform:translateY(-1px)}
    .sci-free-dot{width:7px;height:7px;border-radius:50%;background:#34d399;box-shadow:0 0 9px rgba(52,211,153,.8);flex:0 0 auto}
    .sci-free-dot.warn{background:#fbbf24;box-shadow:0 0 9px rgba(251,191,36,.75)}
    .sci-free-dot.error{background:#fb7185;box-shadow:0 0 9px rgba(251,113,133,.75)}
    #sci-free-toast{position:fixed;right:18px;bottom:18px;z-index:10050;max-width:min(470px,calc(100vw - 36px));padding:12px 14px;border-radius:14px;background:rgba(10,16,30,.96);border:1px solid rgba(52,211,153,.35);box-shadow:0 16px 50px rgba(0,0,0,.35);color:#d1fae5;font:500 12px/1.45 Inter,ui-sans-serif,sans-serif;opacity:0;transform:translateY(12px);pointer-events:none;transition:.2s}
    #sci-free-toast.show{opacity:1;transform:none}
    #sci-free-toast.warn{border-color:rgba(251,191,36,.45);color:#fef3c7}
    #sci-free-toast.error{border-color:rgba(248,113,113,.5);color:#fee2e2}
    #sci-free-panel{position:fixed;top:72px;right:18px;width:min(365px,calc(100vw - 28px));z-index:10040;background:rgba(9,15,28,.99);border:1px solid rgba(71,85,105,.65);border-radius:18px;box-shadow:0 24px 80px rgba(0,0,0,.48);padding:16px;color:#e2e8f0;font:13px/1.45 Inter,ui-sans-serif,sans-serif;display:none}
    #sci-free-panel.open{display:block}
    #sci-free-panel h3{margin:0 0 3px;font-size:14px;color:#fff}
    #sci-free-panel .sci-free-subtitle{margin:0 0 12px;color:#94a3b8;font-size:10px}
    .sci-free-choice{width:100%;text-align:left;padding:10px;border:1px solid #263244;border-radius:11px;margin-top:7px;background:#111a2b;color:#e2e8f0;cursor:pointer;transition:.16s}
    .sci-free-choice:hover{border-color:#3b82f6;background:#152238}
    .sci-free-choice.selected{border-color:rgba(52,211,153,.7);background:rgba(6,78,59,.25)}
    .sci-free-choice strong{display:flex;align-items:center;justify-content:space-between;color:#e2e8f0;font-size:12px}
    .sci-free-choice span{display:block;color:#64748b;font-size:10px;margin-top:3px}
    .sci-free-check{color:#6ee7b7;font-size:11px}
    .sci-free-note{margin-top:12px;padding:9px 10px;border-radius:10px;background:#0f172a;color:#94a3b8;font-size:10px}
  `;
  document.head.appendChild(style);

  let toastTimer;
  function toast(message, kind='') {
    let el = document.getElementById('sci-free-toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'sci-free-toast';
      document.body.appendChild(el);
    }
    el.className = kind ? `show ${kind}` : 'show';
    el.textContent = message;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 5200);
  }

  function statusText(provider='Auto · Free', kind='') {
    const pill = document.getElementById('sci-free-pill');
    if (!pill) return;
    const dot = pill.querySelector('.sci-free-dot');
    const label = pill.querySelector('.sci-free-label');
    if (label) label.textContent = provider;
    if (dot) dot.className = `sci-free-dot${kind ? ' '+kind : ''}`;
  }

  function getSelectedProvider() {
    try { return localStorage.getItem(STORAGE_KEY) || 'auto'; } catch (_) { return 'auto'; }
  }

  function setSelectedProvider(id, announce=true) {
    const valid = providers.some(p => p.id === id) ? id : 'auto';
    try { localStorage.setItem(STORAGE_KEY, valid); } catch (_) {}
    window.SCI_AI_PREFERRED_PROVIDER = valid;
    const p = providers.find(x => x.id === valid) || providers[0];
    statusText(p.short);
    updateChoiceStates();
    if (announce) toast(`AI route set to ${p.label}. Free-only mode remains enabled.`);
  }

  function updateChoiceStates() {
    const selected = getSelectedProvider();
    document.querySelectorAll('.sci-free-choice').forEach(btn => {
      const isSelected = btn.dataset.provider === selected;
      btn.classList.toggle('selected', isSelected);
      const check = btn.querySelector('.sci-free-check');
      if (check) check.textContent = isSelected ? '✓ Selected' : '';
    });
  }

  function createPanel() {
    let panel = document.getElementById('sci-free-panel');
    if (panel) return panel;
    panel = document.createElement('div');
    panel.id = 'sci-free-panel';
    panel.innerHTML = `
      <h3>AI Provider / LLM Route</h3>
      <p class="sci-free-subtitle">Choose the free route you prefer. No paid provider can be selected in Phase 1.</p>
      ${providers.map(p => `
        <button type="button" class="sci-free-choice" data-provider="${p.id}">
          <strong><span style="display:inline;color:#e2e8f0;font-size:12px">${p.label}</span><span class="sci-free-check"></span></strong>
          <span>${p.desc}</span>
        </button>`).join('')}
      <div class="sci-free-note">Auto · Free uses automatic fallback. If the preferred free route is unavailable or rate-limited, the secure gateway may try another configured free provider. No paid request is made.</div>
    `;
    document.body.appendChild(panel);
    panel.querySelectorAll('.sci-free-choice').forEach(btn => {
      btn.addEventListener('click', () => {
        setSelectedProvider(btn.dataset.provider, true);
        panel.classList.remove('open');
      });
    });
    updateChoiceStates();
    return panel;
  }

  function createPill() {
    let pill = document.getElementById('sci-free-pill');
    if (!pill) {
      pill = document.createElement('button');
      pill.type = 'button';
      pill.id = 'sci-free-pill';
      pill.className = 'sci-free-pill';
      pill.title = 'Choose AI provider / LLM';
      pill.innerHTML = '<span class="sci-free-dot"></span><span class="sci-free-label">Auto · Free</span><i class="fa-solid fa-chevron-down text-[9px] opacity-70"></i>';
      const header = document.querySelector('header .flex.items-center.space-x-2') || document.querySelector('header');
      (header || document.body).prepend(pill);
    }
    if (!pill.dataset.sciBound) {
      pill.dataset.sciBound = '1';
      pill.addEventListener('click', (e) => {
        e.stopPropagation();
        createPanel().classList.toggle('open');
        updateChoiceStates();
      });
    }
  }

  function removeLegacyKeyUi() {
    document.querySelectorAll('#modal-apikey,#api-modal').forEach(el => el.remove());
    document.querySelectorAll('input, label, button, a').forEach(el => {
      const text = `${el.textContent||''} ${el.getAttribute('title')||''} ${el.getAttribute('aria-label')||''}`.toLowerCase();
      if (/your gemini api key|api key configuration|configure key|custom ai gateway settings/.test(text)) {
        if (el.id !== 'sci-free-pill') el.remove();
      }
    });
    document.querySelectorAll('body *').forEach(el => {
      if (el.children.length === 0 && /powered by gemini/i.test(el.textContent||'')) {
        el.textContent = (el.textContent||'').replace(/powered by gemini[^•]*•?/ig, '');
      }
    });
  }

  window.sciFreeAI = {
    status: (text, kind='') => { statusText(text, kind); toast(text, kind); },
    provider(data) {
      const map = {
        'openrouter-deepseek': 'OpenRouter Free',
        'openrouter-free': 'OpenRouter Free',
        'gemini': 'Gemini Free',
        'groq': 'Groq Free'
      };
      const label = map[data?.provider] || data?.provider || 'Free AI';
      if (data?.fallback) {
        const from = map[data?.fallbackFrom] || data?.fallbackFrom || 'Free provider';
        statusText(label, 'warn');
        toast(`⚠ ${from} was unavailable. Switched automatically to ${label}.`, 'warn');
      } else {
        statusText(label);
      }
    },
    error(error) {
      if (error?.code === 'FREE_CAPACITY_EXHAUSTED') {
        statusText('Free AI exhausted', 'error');
        toast('⚠ Free AI capacity is temporarily exhausted. No paid provider was used.', 'error');
      } else {
        statusText('Free AI unavailable', 'error');
        toast(`⚠ Free AI unavailable: ${error?.message || 'gateway error'}`, 'error');
      }
    }
  };

  const nativeFetch = window.fetch.bind(window);
  window.fetch = async function(input, init) {
    const url = typeof input === 'string' ? input : (input?.url || '');
    const isGateway = Boolean(window.SCI_AI_GATEWAY && url === window.SCI_AI_GATEWAY);
    let nextInit = init;
    if (isGateway && init?.body && typeof init.body === 'string') {
      try {
        const body = JSON.parse(init.body);
        body.assistant = body.assistant || assistant;
        body.mode = 'free';
        body.preferredProvider = getSelectedProvider();
        nextInit = {...init, body: JSON.stringify(body)};
      } catch (_) {}
    }
    try {
      const response = await nativeFetch(input, nextInit);
      if (isGateway) {
        const data = await response.clone().json().catch(() => ({}));
        if (response.ok) window.sciFreeAI.provider(data);
        else {
          const e = new Error(data?.error || `Free AI gateway HTTP ${response.status}`);
          e.code = data?.code;
          window.sciFreeAI.error(e);
        }
      }
      return response;
    } catch (e) {
      if (isGateway) window.sciFreeAI.error(e);
      throw e;
    }
  };

  document.addEventListener('click', e => {
    const panel = document.getElementById('sci-free-panel');
    const pill = document.getElementById('sci-free-pill');
    if (panel?.classList.contains('open') && !panel.contains(e.target) && e.target !== pill) panel.classList.remove('open');
  });

  document.addEventListener('DOMContentLoaded', () => {
    removeLegacyKeyUi();
    createPill();
    createPanel();
    const selected = getSelectedProvider();
    window.SCI_AI_PREFERRED_PROVIDER = selected;
    const p = providers.find(x => x.id === selected) || providers[0];
    statusText(p.short);
    updateChoiceStates();
  });
})();
