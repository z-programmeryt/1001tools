import { tools, toolById } from './tools-data.js';
import { languages, getLocale, t, isRtl } from './i18n.js';

const state = {
  lang: getLocale(),
  theme: localStorage.getItem('np:theme') || 'system',
  coins: Number(localStorage.getItem('np:coins') || 100),
};

function applyTheme() {
  const root = document.documentElement;
  if (state.theme === 'system') {
    root.dataset.theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } else root.dataset.theme = state.theme;
}

function setCoins(next) {
  state.coins = next; localStorage.setItem('np:coins', String(next));
  document.querySelectorAll('[data-coins]').forEach((el) => el.textContent = `${state.coins} NP`);
}

function spendCoins(amount = 10) {
  if (state.coins < amount) return false;
  setCoins(state.coins - amount); return true;
}

function toast(message) {
  const el = document.querySelector('#toast');
  if (!el) return;
  el.textContent = message;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 1600);
}

function setupGlobal() {
  applyTheme();
  document.documentElement.lang = state.lang;
  document.documentElement.dir = isRtl(state.lang) ? 'rtl' : 'ltr';

  const langSel = document.querySelector('#language');
  if (langSel) {
    langSel.innerHTML = languages.map(([code, name]) => `<option value="${code}">${name}</option>`).join('');
    langSel.value = state.lang;
    langSel.onchange = () => { state.lang = langSel.value; localStorage.setItem('np:lang', state.lang); location.reload(); };
  }

  const themeSel = document.querySelector('#theme');
  if (themeSel) {
    themeSel.value = state.theme;
    themeSel.onchange = () => { state.theme = themeSel.value; localStorage.setItem('np:theme', state.theme); applyTheme(); };
  }

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(state.lang, el.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    el.placeholder = t(state.lang, el.dataset.i18nPlaceholder);
  });

  setCoins(state.coins);
  const io = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('show')), { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach((n) => io.observe(n));
}

function renderCards() {
  const grid = document.querySelector('#toolGrid');
  if (!grid) return;
  const q = (document.querySelector('#search')?.value || '').toLowerCase();
  grid.innerHTML = tools.filter((tool) => `${tool.title} ${tool.description}`.toLowerCase().includes(q)).map((tool) => `
    <article class="card reveal" style="animation-delay:${Math.random().toFixed(2)}s">
      ${tool.icon}
      <span class="badge">${tool.category}</span>
      <h3>${tool.title}</h3>
      <p>${tool.description}</p>
      <a class="btn" href="tools/${tool.id}.html">${t(state.lang, 'useTool')}</a>
    </article>`).join('');
}

function wordCounter() {
  const input = document.querySelector('#inputText');
  const out = document.querySelector('#result');
  const btn = document.querySelector('#runTool');
  if (!btn) return;
  btn.onclick = () => {
    if (!spendCoins()) return toast('Low balance. Earn more NP.');
    const text = input.value.trim();
    const words = text ? text.split(/\s+/).length : 0;
    const chars = text.length;
    const sentences = (text.match(/[.!?]+/g) || []).length;
    const paragraphs = text ? text.split(/\n+/).filter(Boolean).length : 0;
    out.textContent = `Words: ${words}\nCharacters: ${chars}\nSentences: ${sentences}\nParagraphs: ${paragraphs}\nReading time: ${Math.max(1, Math.ceil(words/200))} min\nSpeaking time: ${Math.max(1, Math.ceil(words/130))} min`;
  };
}

function caseConverter() { const btn=document.querySelector('#runTool'); if(!btn) return; btn.onclick=()=>{ if(!spendCoins()) return toast('Low balance.'); const text=document.querySelector('#inputText').value; const mode=document.querySelector('#mode').value; const words=text.toLowerCase().split(/\s+/); const map={upper:text.toUpperCase(),lower:text.toLowerCase(),title:words.map(w=>w[0]?.toUpperCase()+w.slice(1)).join(' '),sentence:text.charAt(0).toUpperCase()+text.slice(1).toLowerCase(),camel:words.map((w,i)=>i? w[0]?.toUpperCase()+w.slice(1):w).join(''),pascal:words.map(w=>w[0]?.toUpperCase()+w.slice(1)).join(''),snake:words.join('_'),kebab:words.join('-'),alternating:[...text].map((c,i)=>i%2?c.toLowerCase():c.toUpperCase()).join('')}; document.querySelector('#result').textContent=map[mode]||text;}; }
function lorem() { const btn=document.querySelector('#runTool'); if(!btn) return; const base='lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua'; btn.onclick=()=>{ if(!spendCoins()) return toast('Low balance.'); const count=Number(document.querySelector('#count').value||3); const type=document.querySelector('#type').value; let text=''; if(type==='words') text=Array.from({length:count},(_,i)=>base.split(' ')[i%19]).join(' '); else if(type==='sentences') text=Array.from({length:count},()=>base.replace(/\b\w/g,c=>c.toUpperCase())+'.').join(' '); else text=Array.from({length:count},()=>base+'.').join('\n\n'); document.querySelector('#result').textContent=text; }; }
function tts() { const btn=document.querySelector('#runTool'); if(!btn) return; btn.onclick=()=>{ if(!spendCoins()) return toast('Low balance.'); const u=new SpeechSynthesisUtterance(document.querySelector('#inputText').value); speechSynthesis.cancel(); speechSynthesis.speak(u); document.querySelector('#result').textContent='Speaking...';}; }
function stt() { const start=document.querySelector('#runTool'); if(!start) return; const SR=window.SpeechRecognition||window.webkitSpeechRecognition; if(!SR){document.querySelector('#result').textContent='Speech recognition not supported in this browser.'; return;} const rec=new SR(); rec.continuous=true; rec.interimResults=true; start.onclick=()=>{ if(!spendCoins()) return toast('Low balance.'); rec.start();}; rec.onresult=(e)=>{document.querySelector('#result').textContent=[...e.results].map(r=>r[0].transcript).join(' ');}; }
function rewrite(){const btn=document.querySelector('#runTool');if(!btn) return; const dict={important:'crucial',good:'excellent',bad:'poor',big:'massive',small:'compact',quick:'rapid',use:'utilize',show:'display'}; btn.onclick=()=>{if(!spendCoins()) return toast('Low balance.'); let txt=document.querySelector('#inputText').value; Object.entries(dict).forEach(([k,v])=>{txt=txt.replace(new RegExp(`\\b${k}\\b`,'gi'),v);}); document.querySelector('#result').textContent=txt;};}
function grammar(){const btn=document.querySelector('#runTool');if(!btn) return; btn.onclick=()=>{if(!spendCoins()) return toast('Low balance.'); const txt=document.querySelector('#inputText').value; const issues=[]; if(/\bi\b/.test(txt)) issues.push('Capitalize standalone "I".'); if(/\s{2,}/.test(txt)) issues.push('Avoid multiple consecutive spaces.'); if(/[^.!?]$/.test(txt.trim())) issues.push('Consider ending sentence with punctuation.'); if(/\b(very very)\b/i.test(txt)) issues.push('Repeated phrase: "very very".'); document.querySelector('#result').textContent=issues.length?issues.map((i,n)=>`${n+1}. ${i}`).join('\n'):'No major issues found.';};}
function fancy(){const btn=document.querySelector('#runTool');if(!btn) return; const map={bold:['𝗔','𝗕','𝗖','𝗗','𝗘','𝗙','𝗚','𝗛','𝗜','𝗝','𝗞','𝗟','𝗠','𝗡','𝗢','𝗣','𝗤','𝗥','𝗦','𝗧','𝗨','𝗩','𝗪','𝗫','𝗬','𝗭'],circled:['Ⓐ','Ⓑ','Ⓒ','Ⓓ','Ⓔ','Ⓕ','Ⓖ','Ⓗ','Ⓘ','Ⓙ','Ⓚ','Ⓛ','Ⓜ','Ⓝ','Ⓞ','Ⓟ','Ⓠ','Ⓡ','Ⓢ','Ⓣ','Ⓤ','Ⓥ','Ⓦ','Ⓧ','Ⓨ','Ⓩ']}; btn.onclick=()=>{if(!spendCoins()) return toast('Low balance.'); const txt=document.querySelector('#inputText').value.toUpperCase(); const style=document.querySelector('#mode').value; const out=[...txt].map(ch=>/[A-Z]/.test(ch)?map[style][ch.charCodeAt(0)-65]:ch).join(''); document.querySelector('#result').textContent=out;};}
function diff(){const btn=document.querySelector('#runTool');if(!btn) return; btn.onclick=()=>{if(!spendCoins()) return toast('Low balance.'); const a=document.querySelector('#inputA').value.split(/\s+/); const b=document.querySelector('#inputB').value.split(/\s+/); const max=Math.max(a.length,b.length); const lines=[]; for(let i=0;i<max;i++){ if(a[i]===b[i]) lines.push(`  ${a[i]||''}`); else {if(a[i]) lines.push(`- ${a[i]}`); if(b[i]) lines.push(`+ ${b[i]}`);} } document.querySelector('#result').textContent=lines.join('\n');};}
function emoji(){const btn=document.querySelector('#runTool');if(!btn) return; const source=['😀','😂','😍','🔥','✨','🎉','🚀','✅','💡','🌍','🎯','⚡','📌','🧠','💎','❤️','👍','🥳']; btn.onclick=()=>{if(!spendCoins()) return toast('Low balance.'); const q=document.querySelector('#query').value.toLowerCase(); const list=source.filter(e=>!q || ({'🔥':'fire','🚀':'rocket','💡':'idea','🌍':'world'}[e]||'').includes(q) || e.includes(q)); document.querySelector('#result').textContent=list.join(' ');}; document.querySelector('#result').onclick=(e)=>{navigator.clipboard.writeText(e.target.textContent.trim()); toast(t(state.lang,'copied'));};}

function setupToolPage() {
  const id = document.body.dataset.tool;
  if (!id) return;
  const tool = toolById[id];
  const title = document.querySelector('#toolTitle');
  if (tool && title) title.textContent = tool.title;
  ({'word-counter':wordCounter,'case-converter':caseConverter,'lorem-ipsum':lorem,'text-to-speech':tts,'speech-to-text':stt,'text-rewriter':rewrite,'grammar-checker':grammar,'fancy-text':fancy,'text-diff':diff,'emoji-picker':emoji}[id]||(()=>{}))();
}

window.addEventListener('DOMContentLoaded', () => {
  setupGlobal();
  renderCards();
  document.querySelector('#search')?.addEventListener('input', renderCards);
  setupToolPage();
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);
});
