// VMD Assistant AI — canonical FREE model registry.
// Provider/model availability can change; the secure Worker remains authoritative.
window.VMD_FREE_MODELS = [
  {id:'openrouter-free', provider:'openrouter', name:'OpenRouter Free', description:'Dynamic router across the currently available free OpenRouter models.', model:'openrouter/free'},
  {id:'deepseek-r1-distill-70b-free', provider:'openrouter', name:'DeepSeek R1 Distill 70B · Free', description:'DeepSeek R1-distilled Llama 70B free endpoint via OpenRouter.', model:'deepseek/deepseek-r1-distill-llama-70b:free'},
  {id:'gemini-free', provider:'gemini', name:'Gemini · Free tier', description:'Google Gemini API free tier; requires a Gemini key in the secure gateway.', model:'gemini-2.5-flash'},
  {id:'groq-free', provider:'groq', name:'Groq · Free tier', description:'Groq free developer tier; requires a Groq key in the secure gateway.', model:'llama-3.3-70b-versatile'}
];
