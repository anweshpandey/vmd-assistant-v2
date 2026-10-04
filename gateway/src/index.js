const FREE_MODELS = {
  auto: {provider:'openrouter', model:'openrouter/free'},
  'openrouter-free': {provider:'openrouter', model:'openrouter/free'},
  'deepseek-v4-flash-0731-free': {provider:'openrouter', model:'deepseek/deepseek-v4-flash-0731:free'},
  'deepseek-v4-flash-0423-free': {provider:'openrouter', model:'deepseek/deepseek-v4-flash:free'},
  'deepseek-v3-free': {provider:'openrouter', model:'deepseek/deepseek-chat:free'},
  'deepseek-v3-1-free': {provider:'openrouter', model:'deepseek/deepseek-chat-v3.1:free'},
  'deepseek-r1-free': {provider:'openrouter', model:'deepseek/deepseek-r1:free'},
  'deepseek-r1-0528-free': {provider:'openrouter', model:'deepseek/deepseek-r1-0528:free'},
  'deepseek-r1-distill-qwen-32b-free': {provider:'openrouter', model:'deepseek/deepseek-r1-distill-qwen-32b:free'},
  'gemini-free': {provider:'gemini', model:'gemini-2.5-flash'},
  'groq-free': {provider:'groq', model:'llama-3.3-70b-versatile'}
};
const FALLBACKS = [
  {provider:'openrouter', model:'openrouter/free'},
  {provider:'openrouter', model:'deepseek/deepseek-v4-flash-0731:free'},
  {provider:'openrouter', model:'deepseek/deepseek-chat-v3.1:free'},
  {provider:'openrouter', model:'deepseek/deepseek-r1-0528:free'},
  {provider:'gemini', model:'gemini-2.5-flash'},
  {provider:'groq', model:'llama-3.3-70b-versatile'}
];
const ALLOWED_ORIGINS = ['https://anweshpandey.github.io'];
function cors(origin){
  const allowed=ALLOWED_ORIGINS.includes(origin)||origin==='null';
  return {'Access-Control-Allow-Origin':allowed?origin:ALLOWED_ORIGINS[0],'Access-Control-Allow-Headers':'Content-Type','Access-Control-Allow-Methods':'GET,POST,OPTIONS','Vary':'Origin'};
}
function json(data,status=200,origin=''){return new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json',...cors(origin)}})}
function textFromOpenAI(d){return d?.choices?.[0]?.message?.content||d?.choices?.[0]?.text||''}
async function callOpenRouter(env,model,messages){
  if(!env.OPENROUTER_API_KEY) throw new Error('OpenRouter key is not configured');
  const r=await fetch('https://openrouter.ai/api/v1/chat/completions',{method:'POST',headers:{'Authorization':`Bearer ${env.OPENROUTER_API_KEY}`,'Content-Type':'application/json','HTTP-Referer':'https://anweshpandey.github.io/vmd-assistant-v2/','X-Title':'VMD Assistant AI'},body:JSON.stringify({model,messages,temperature:0.2,max_tokens:4000})});
  const d=await r.json(); if(!r.ok) throw new Error(d?.error?.message||`OpenRouter HTTP ${r.status}`); const text=textFromOpenAI(d); if(!text)throw new Error('OpenRouter returned no text'); return text;
}
async function callGemini(env,model,system,user){
  if(!env.GEMINI_API_KEY) throw new Error('Gemini key is not configured');
  const url=`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(env.GEMINI_API_KEY)}`;
  const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({systemInstruction:{parts:[{text:system}]},contents:[{role:'user',parts:[{text:user}]}],generationConfig:{temperature:0.2,maxOutputTokens:4000}})});
  const d=await r.json(); if(!r.ok)throw new Error(d?.error?.message||`Gemini HTTP ${r.status}`); const text=d?.candidates?.[0]?.content?.parts?.map(x=>x.text||'').join('')||''; if(!text)throw new Error('Gemini returned no text'); return text;
}
async function callGroq(env,model,messages){
  if(!env.GROQ_API_KEY) throw new Error('Groq key is not configured');
  const r=await fetch('https://api.groq.com/openai/v1/chat/completions',{method:'POST',headers:{'Authorization':`Bearer ${env.GROQ_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({model,messages,temperature:0.2,max_tokens:4000})});
  const d=await r.json(); if(!r.ok)throw new Error(d?.error?.message||`Groq HTTP ${r.status}`); const text=textFromOpenAI(d); if(!text)throw new Error('Groq returned no text'); return text;
}
async function run(env,route,system,user){
  const messages=[{role:'system',content:system},{role:'user',content:user}];
  if(route.provider==='openrouter')return callOpenRouter(env,route.model,messages);
  if(route.provider==='gemini')return callGemini(env,route.model,system,user);
  if(route.provider==='groq')return callGroq(env,route.model,messages);
  throw new Error('Unsupported provider');
}
export default {async fetch(request,env){
  const origin=request.headers.get('Origin')||'';
  if(request.method==='OPTIONS')return new Response(null,{status:204,headers:cors(origin)});
  const url=new URL(request.url);
  if(url.pathname==='/health')return json({ok:true,mode:'FREE_ONLY',version:'v2.5',providers:{openrouter:!!env.OPENROUTER_API_KEY,gemini:!!env.GEMINI_API_KEY,groq:!!env.GROQ_API_KEY}},200,origin);
  if(url.pathname!=='/api/chat'||request.method!=='POST')return json({error:'Not found'},404,origin);
  try{
    const body=await request.json(); const query=String(body.query||'').trim(); const system=String(body.system||'You are a helpful VMD assistant.');
    if(!query)return json({error:'Query is required'},400,origin);
    const requested=String(body.model||'auto');
    if(requested.startsWith('paid-'))return json({error:'Paid providers are disabled in FREE_ONLY mode.'},403,origin);
    const primary=FREE_MODELS[requested]||FREE_MODELS.auto;
    const routes=[]; const add=r=>{if(r&&!routes.some(x=>x.provider===r.provider&&x.model===r.model))routes.push(r)};
    add(primary);
    if(String(body.provider)==='openrouter'&&requested==='auto')add(FREE_MODELS['openrouter-free']);
    FALLBACKS.forEach(add);
    const errors=[];
    for(const route of routes){try{const text=await run(env,route,system,query);return json({ok:true,text,provider:route.provider,model:route.model,fallback:route.provider!==primary.provider||route.model!==primary.model?`${primary.provider} unavailable; switched to ${route.provider}`:null},200,origin)}catch(e){errors.push(`${route.provider}/${route.model}: ${e.message}`)}}
    return json({error:`All configured free AI routes failed. ${errors.join(' | ')}`},503,origin);
  }catch(e){return json({error:e.message||'Bad request'},400,origin)}
}};
