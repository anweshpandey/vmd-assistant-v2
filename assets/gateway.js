(function(){
  const DEFAULT='/api/chat';
  function base(){return (window.VMD_GATEWAY_URL||'').replace(/\/$/,'')}
  async function request(path,body){
    const root=base();
    if(!root) throw new Error('Free AI gateway is not configured yet. Deploy the gateway/Worker and set assets/gateway-config.js.');
    const r=await fetch(root+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
    let d={}; try{d=await r.json()}catch{}
    if(!r.ok) throw new Error(d.error||`Gateway HTTP ${r.status}`);
    return d;
  }
  window.VMDGateway={
    chat: async ({query,model,provider,system})=>request(DEFAULT,{query,model,provider,system}),
    health: async()=>{const root=base();if(!root)throw new Error('not configured');const r=await fetch(root+'/health');if(!r.ok)throw new Error('gateway offline');return r.json()}
  };
})();
