import { tools, toolById } from './tools-data.js';
import { languages, getLocale, t, isRtl } from './i18n.js';

const state = {
  lang: getLocale(),
  theme: localStorage.getItem('np:theme') || 'system',
  coins: Number(localStorage.getItem('np:coins') || 100),
};

const $ = (sel) => document.querySelector(sel);

function applyTheme() {
  const root = document.documentElement;
  if (state.theme === 'system') {
    root.dataset.theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } else {
    root.dataset.theme = state.theme;
  }
}

function setCoins(next) {
  state.coins = next;
  localStorage.setItem('np:coins', String(next));
  document.querySelectorAll('[data-coins]').forEach((el) => {
    el.textContent = `${state.coins} NP`;
  });
}

function spendCoins(amount = 10) {
  if (state.coins < amount) return false;
  setCoins(state.coins - amount);
  return true;
}

function toast(message) {
  const el = $('#toast');
  if (!el) return;
  el.textContent = message;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 1600);
}

function setupGlobal() {
  applyTheme();
  document.documentElement.lang = state.lang;
  document.documentElement.dir = isRtl(state.lang) ? 'rtl' : 'ltr';

  const langSel = $('#language');
  if (langSel) {
    langSel.innerHTML = languages.map(([code, name]) => `<option value="${code}">${name}</option>`).join('');
    langSel.value = state.lang;
    langSel.addEventListener('change', () => {
      state.lang = langSel.value;
      localStorage.setItem('np:lang', state.lang);
      location.reload();
    });
  }

  const themeSel = $('#theme');
  if (themeSel) {
    themeSel.value = state.theme;
    themeSel.addEventListener('change', () => {
      state.theme = themeSel.value;
      localStorage.setItem('np:theme', state.theme);
      applyTheme();
    });
  }

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(state.lang, el.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    el.placeholder = t(state.lang, el.dataset.i18nPlaceholder);
  });

  setCoins(state.coins);

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('show'));
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
}

function renderCards() {
  const grid = $('#toolGrid');
  if (!grid) return;
  const q = ($('#search')?.value || '').toLowerCase();
  grid.innerHTML = tools
    .filter((tool) => `${tool.title} ${tool.description}`.toLowerCase().includes(q))
    .map((tool) => `
      <article class="card reveal">
        ${tool.icon}
        <span class="badge">${tool.category}</span>
        <h3>${tool.title}</h3>
        <p>${tool.description}</p>
        <a class="btn" href="tools/${tool.id}.html">${t(state.lang, 'useTool')}</a>
      </article>
    `).join('');
}

function downloadBlob(blob, filename) {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function loadImage(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = dataUrl;
  });
}

function ensureCoins() {
  if (!spendCoins()) {
    toast('Low balance. Earn more NP.');
    return false;
  }
  return true;
}

function wordCounter() {
  const btn = $('#runTool');
  if (!btn) return;
  btn.onclick = () => {
    if (!ensureCoins()) return;
    const text = $('#inputText').value.trim();
    const words = text ? text.split(/\s+/).length : 0;
    const chars = text.length;
    const sentences = (text.match(/[.!?]+/g) || []).length;
    const paragraphs = text ? text.split(/\n+/).filter(Boolean).length : 0;
    $('#result').textContent = `Words: ${words}\nCharacters: ${chars}\nSentences: ${sentences}\nParagraphs: ${paragraphs}\nReading time: ${Math.max(1, Math.ceil(words / 200))} min\nSpeaking time: ${Math.max(1, Math.ceil(words / 130))} min`;
  };
}

function caseConverter() {
  const btn = $('#runTool');
  if (!btn) return;
  btn.onclick = () => {
    if (!ensureCoins()) return;
    const text = $('#inputText').value;
    const mode = $('#mode').value;
    const words = text.toLowerCase().trim().split(/\s+/).filter(Boolean);
    const map = {
      upper: text.toUpperCase(),
      lower: text.toLowerCase(),
      title: words.map((w) => w[0]?.toUpperCase() + w.slice(1)).join(' '),
      sentence: text.charAt(0).toUpperCase() + text.slice(1).toLowerCase(),
      camel: words.map((w, i) => i ? (w[0]?.toUpperCase() + w.slice(1)) : w).join(''),
      pascal: words.map((w) => w[0]?.toUpperCase() + w.slice(1)).join(''),
      snake: words.join('_'),
      kebab: words.join('-'),
      alternating: [...text].map((c, i) => i % 2 ? c.toLowerCase() : c.toUpperCase()).join(''),
    };
    $('#result').textContent = map[mode] || text;
  };
}

function lorem() {
  const btn = $('#runTool');
  if (!btn) return;
  const base = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua';
  btn.onclick = () => {
    if (!ensureCoins()) return;
    const count = Number($('#count').value || 3);
    const type = $('#type').value;
    let text = '';
    if (type === 'words') text = Array.from({ length: count }, (_, i) => base.split(' ')[i % 19]).join(' ');
    else if (type === 'sentences') text = Array.from({ length: count }, () => `${base}.`).join(' ');
    else text = Array.from({ length: count }, () => `${base}.`).join('\n\n');
    $('#result').textContent = text;
  };
}

function tts() {
  const btn = $('#runTool');
  if (!btn) return;
  btn.onclick = () => {
    if (!ensureCoins()) return;
    const utterance = new SpeechSynthesisUtterance($('#inputText').value);
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
    $('#result').textContent = 'Speaking...';
  };
}

function stt() {
  const btn = $('#runTool');
  if (!btn) return;
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    $('#result').textContent = 'Speech recognition not supported in this browser.';
    return;
  }
  const rec = new SR();
  rec.continuous = true;
  rec.interimResults = true;
  btn.onclick = () => {
    if (!ensureCoins()) return;
    rec.start();
  };
  rec.onresult = (e) => {
    $('#result').textContent = [...e.results].map((r) => r[0].transcript).join(' ');
  };
}

function rewrite() {
  const btn = $('#runTool');
  if (!btn) return;
  const dict = { important: 'crucial', good: 'excellent', bad: 'poor', big: 'massive', small: 'compact', quick: 'rapid', use: 'utilize', show: 'display' };
  btn.onclick = () => {
    if (!ensureCoins()) return;
    let text = $('#inputText').value;
    Object.entries(dict).forEach(([k, v]) => { text = text.replace(new RegExp(`\\b${k}\\b`, 'gi'), v); });
    $('#result').textContent = text;
  };
}

function grammar() {
  const btn = $('#runTool');
  if (!btn) return;
  btn.onclick = () => {
    if (!ensureCoins()) return;
    const text = $('#inputText').value;
    const issues = [];
    if (/\bi\b/.test(text)) issues.push('Capitalize standalone "I".');
    if (/\s{2,}/.test(text)) issues.push('Avoid multiple consecutive spaces.');
    if (/[^.!?]$/.test(text.trim())) issues.push('Consider ending sentence with punctuation.');
    if (/\b(very very)\b/i.test(text)) issues.push('Repeated phrase: "very very".');
    $('#result').textContent = issues.length ? issues.map((item, i) => `${i + 1}. ${item}`).join('\n') : 'No major issues found.';
  };
}

function fancy() {
  const btn = $('#runTool');
  if (!btn) return;
  const map = {
    bold: ['𝗔','𝗕','𝗖','𝗗','𝗘','𝗙','𝗚','𝗛','𝗜','𝗝','𝗞','𝗟','𝗠','𝗡','𝗢','𝗣','𝗤','𝗥','𝗦','𝗧','𝗨','𝗩','𝗪','𝗫','𝗬','𝗭'],
    circled: ['Ⓐ','Ⓑ','Ⓒ','Ⓓ','Ⓔ','Ⓕ','Ⓖ','Ⓗ','Ⓘ','Ⓙ','Ⓚ','Ⓛ','Ⓜ','Ⓝ','Ⓞ','Ⓟ','Ⓠ','Ⓡ','Ⓢ','Ⓣ','Ⓤ','Ⓥ','Ⓦ','Ⓧ','Ⓨ','Ⓩ'],
  };
  btn.onclick = () => {
    if (!ensureCoins()) return;
    const text = $('#inputText').value.toUpperCase();
    const style = $('#mode').value;
    $('#result').textContent = [...text].map((ch) => /[A-Z]/.test(ch) ? map[style][ch.charCodeAt(0) - 65] : ch).join('');
  };
}

function diff() {
  const btn = $('#runTool');
  if (!btn) return;
  btn.onclick = () => {
    if (!ensureCoins()) return;
    const a = $('#inputA').value.split(/\s+/);
    const b = $('#inputB').value.split(/\s+/);
    const max = Math.max(a.length, b.length);
    const lines = [];
    for (let i = 0; i < max; i += 1) {
      if (a[i] === b[i]) lines.push(`  ${a[i] || ''}`);
      else {
        if (a[i]) lines.push(`- ${a[i]}`);
        if (b[i]) lines.push(`+ ${b[i]}`);
      }
    }
    $('#result').textContent = lines.join('\n');
  };
}

function emoji() {
  const btn = $('#runTool');
  if (!btn) return;
  const source = ['😀','😂','😍','🔥','✨','🎉','🚀','✅','💡','🌍','🎯','⚡','📌','🧠','💎','❤️','👍','🥳'];
  btn.onclick = () => {
    if (!ensureCoins()) return;
    const q = $('#query').value.toLowerCase();
    const list = source.filter((e) => !q || ({ '🔥': 'fire', '🚀': 'rocket', '💡': 'idea', '🌍': 'world' }[e] || '').includes(q));
    $('#result').textContent = list.join(' ');
  };
  $('#result')?.addEventListener('click', () => {
    navigator.clipboard.writeText($('#result').textContent.trim());
    toast(t(state.lang, 'copied'));
  });
}

async function imageCompressor() {
  const btn = $('#runTool');
  if (!btn) return;
  btn.onclick = async () => {
    if (!ensureCoins()) return;
    const file = $('#fileInput').files?.[0];
    if (!file) return toast('Please upload an image first.');
    const quality = Number($('#quality').value || 80) / 100;
    const dataUrl = await readFileAsDataUrl(file);
    const img = await loadImage(dataUrl);
    const canvas = $('#canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const out = $('#result');
      out.textContent = `Original: ${(file.size / 1024).toFixed(1)} KB\nCompressed: ${(blob.size / 1024).toFixed(1)} KB`;
      downloadBlob(blob, `compressed-${file.name.replace(/\.[a-zA-Z]+$/, '.jpg')}`);
    }, 'image/jpeg', quality);
  };
}

async function imageResizer() {
  const btn = $('#runTool');
  if (!btn) return;
  btn.onclick = async () => {
    if (!ensureCoins()) return;
    const file = $('#fileInput').files?.[0];
    if (!file) return toast('Upload an image first.');
    const dataUrl = await readFileAsDataUrl(file);
    const img = await loadImage(dataUrl);
    let width = Number($('#width').value || img.width);
    let height = Number($('#height').value || img.height);
    const lock = $('#lockRatio').checked;
    if (lock) height = Math.round((width / img.width) * img.height);

    const canvas = $('#canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.getContext('2d').drawImage(img, 0, 0, width, height);
    canvas.toBlob((blob) => {
      if (!blob) return;
      $('#result').textContent = `Resized to ${width}x${height}`;
      downloadBlob(blob, `resized-${file.name}`);
    }, file.type || 'image/png');
  };
}

async function imageFormatConverter() {
  const btn = $('#runTool');
  if (!btn) return;
  btn.onclick = async () => {
    if (!ensureCoins()) return;
    const file = $('#fileInput').files?.[0];
    const format = $('#format').value;
    if (!file) return toast('Upload an image first.');
    const dataUrl = await readFileAsDataUrl(file);
    const img = await loadImage(dataUrl);
    const canvas = $('#canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.getContext('2d').drawImage(img, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) return;
      $('#result').textContent = `Converted to ${format.toUpperCase()}`;
      downloadBlob(blob, `converted.${format === 'jpeg' ? 'jpg' : format}`);
    }, `image/${format}`, 0.92);
  };
}

function imageBase64() {
  const encodeBtn = $('#runTool');
  const decodeBtn = $('#decodeBtn');
  if (encodeBtn) {
    encodeBtn.onclick = async () => {
      if (!ensureCoins()) return;
      const file = $('#fileInput').files?.[0];
      if (!file) return toast('Upload an image first.');
      const data = await readFileAsDataUrl(file);
      $('#result').value = data;
      $('#preview').src = data;
    };
  }
  if (decodeBtn) {
    decodeBtn.onclick = () => {
      const data = $('#result').value.trim();
      if (!data.startsWith('data:image')) return toast('Invalid Base64 image string.');
      $('#preview').src = data;
    };
  }
}

function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  const val = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  const num = parseInt(val, 16);
  return [num >> 16 & 255, num >> 8 & 255, num & 255];
}

async function backgroundRemover() {
  const btn = $('#runTool');
  if (!btn) return;
  btn.onclick = async () => {
    if (!ensureCoins()) return;
    const file = $('#fileInput').files?.[0];
    if (!file) return toast('Upload an image first.');
    const [tr, tg, tb] = hexToRgb($('#targetColor').value);
    const tolerance = Number($('#tolerance').value || 40);

    const dataUrl = await readFileAsDataUrl(file);
    const img = await loadImage(dataUrl);
    const canvas = $('#canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const px = imageData.data;
    for (let i = 0; i < px.length; i += 4) {
      const dr = Math.abs(px[i] - tr);
      const dg = Math.abs(px[i + 1] - tg);
      const db = Math.abs(px[i + 2] - tb);
      if (dr + dg + db < tolerance * 3) px[i + 3] = 0;
    }
    ctx.putImageData(imageData, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) return;
      $('#result').textContent = 'Background removal completed. Download started.';
      downloadBlob(blob, 'background-removed.png');
    }, 'image/png');
  };
}


function rgbToHex(r, g, b) {
  return `#${[r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('')}`;
}

function rgbToHsl(r, g, b) {
  const rn = r / 255; const gn = g / 255; const bn = b / 255;
  const max = Math.max(rn, gn, bn); const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, Math.round(l * 100)];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h;
  switch (max) {
    case rn: h = (gn - bn) / d + (gn < bn ? 6 : 0); break;
    case gn: h = (bn - rn) / d + 2; break;
    default: h = (rn - gn) / d + 4; break;
  }
  h /= 6;
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

async function imageColorPicker() {
  const fileInput = $('#fileInput');
  const canvas = $('#canvas');
  const ctx = canvas?.getContext('2d');
  if (!fileInput || !canvas || !ctx) return;

  fileInput.onchange = async () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    const dataUrl = await readFileAsDataUrl(file);
    const img = await loadImage(dataUrl);
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    $('#result').textContent = 'Click on the image to pick color.';
  };

  canvas.onclick = (e) => {
    if (!ensureCoins()) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) * (canvas.width / rect.width));
    const y = Math.floor((e.clientY - rect.top) * (canvas.height / rect.height));
    const [r, g, b] = ctx.getImageData(x, y, 1, 1).data;
    const hex = rgbToHex(r, g, b);
    const [h, s, l] = rgbToHsl(r, g, b);
    $('#result').textContent = `HEX: ${hex}
RGB: rgb(${r}, ${g}, ${b})
HSL: hsl(${h}, ${s}%, ${l}%)
Coordinates: (${x}, ${y})`;
    const sw = $('#swatch');
    if (sw) sw.style.background = hex;
  };
}

async function imageWatermark() {
  const btn = $('#runTool');
  if (!btn) return;
  btn.onclick = async () => {
    if (!ensureCoins()) return;
    const file = $('#fileInput').files?.[0];
    if (!file) return toast('Upload an image first.');

    const text = $('#watermarkText').value || 'NovaTools';
    const opacity = Number($('#opacity').value || 50) / 100;
    const rotation = Number($('#rotation').value || 0) * Math.PI / 180;
    const pos = $('#position').value;

    const img = await loadImage(await readFileAsDataUrl(file));
    const canvas = $('#canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#00000066';
    ctx.lineWidth = 2;
    ctx.font = `${Math.max(20, Math.round(canvas.width * 0.04))}px Inter, sans-serif`;

    let x = canvas.width - 30;
    let y = canvas.height - 30;
    if (pos === 'top-left') [x, y] = [30, 50];
    if (pos === 'top-right') [x, y] = [canvas.width - 30, 50];
    if (pos === 'bottom-left') [x, y] = [30, canvas.height - 30];
    if (pos === 'center') [x, y] = [canvas.width / 2, canvas.height / 2];

    ctx.textAlign = ['top-right', 'bottom-right'].includes(pos) ? 'right' : (pos === 'center' ? 'center' : 'left');
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.strokeText(text, 0, 0);
    ctx.fillText(text, 0, 0);
    ctx.restore();

    canvas.toBlob((blob) => {
      if (!blob) return;
      $('#result').textContent = 'Watermarked image generated and downloaded.';
      downloadBlob(blob, `watermark-${file.name}`);
    }, 'image/png');
  };
}

async function screenshotToCode() {
  const btn = $('#runTool');
  if (!btn) return;
  btn.onclick = async () => {
    if (!ensureCoins()) return;
    const file = $('#fileInput').files?.[0];
    if (!file) return toast('Upload a screenshot first.');

    const img = await loadImage(await readFileAsDataUrl(file));
    const canvas = $('#canvas');
    const ctx = canvas.getContext('2d');
    const sampleW = 40;
    const sampleH = Math.max(10, Math.round((img.height / img.width) * sampleW));
    canvas.width = sampleW;
    canvas.height = sampleH;
    ctx.drawImage(img, 0, 0, sampleW, sampleH);
    const data = ctx.getImageData(0, 0, sampleW, sampleH).data;

    let r = 0; let g = 0; let b = 0;
    for (let i = 0; i < data.length; i += 4) { r += data[i]; g += data[i + 1]; b += data[i + 2]; }
    const count = data.length / 4;
    const avg = [Math.round(r / count), Math.round(g / count), Math.round(b / count)];
    const bgHex = rgbToHex(...avg);

    const code = `<main style="min-height:100vh;display:grid;place-items:center;background:${bgHex};font-family:Inter,sans-serif;">
  <section style="width:min(900px,90%);padding:24px;border-radius:16px;background:#ffffffd8;backdrop-filter:blur(8px);">
    <h1>Generated Layout Scaffold</h1>
    <p>Source screenshot ratio: ${(img.width / img.height).toFixed(2)}</p>
    <div style="height:12px;background:#1111;border-radius:999px;margin:16px 0;"></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
      <article style="height:140px;background:#fff;border-radius:12px;"></article>
      <article style="height:140px;background:#fff;border-radius:12px;"></article>
    </div>
  </section>
</main>`;

    $('#result').value = code;
    $('#canvas').width = img.width;
    $('#canvas').height = img.height;
    $('#canvas').getContext('2d').drawImage(img, 0, 0);
  };
}

function hashCode(str) {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) h = ((h << 5) - h) + str.charCodeAt(i);
  return Math.abs(h);
}

function qrGenerator() {
  const btn = $('#runTool');
  if (!btn) return;
  btn.onclick = () => {
    if (!ensureCoins()) return;
    const text = $('#qrText').value.trim();
    if (!text) return toast('Enter content for QR.');

    const fg = $('#fgColor').value;
    const bg = $('#bgColor').value;
    const canvas = $('#canvas');
    const ctx = canvas.getContext('2d');
    const size = 29;
    const cell = 12;
    canvas.width = size * cell;
    canvas.height = size * cell;

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const seed = hashCode(text);
    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        const v = (seed + x * 37 + y * 57 + (x * y)) % 11;
        const inFinder = (x < 7 && y < 7) || (x > 21 && y < 7) || (x < 7 && y > 21);
        if (inFinder) {
          ctx.fillStyle = (x % 6 === 0 || y % 6 === 0 || (x > 1 && x < 5 && y > 1 && y < 5)) ? fg : bg;
          ctx.fillRect(x * cell, y * cell, cell, cell);
        } else if (v < 5) {
          ctx.fillStyle = fg;
          ctx.fillRect(x * cell, y * cell, cell, cell);
        }
      }
    }

    canvas.toBlob((blob) => blob && downloadBlob(blob, 'qr-code.png'), 'image/png');
    $('#result').textContent = 'QR-style matrix generated (visual custom code).';
  };
}

function barcodeGenerator() {
  const btn = $('#runTool');
  if (!btn) return;
  btn.onclick = () => {
    if (!ensureCoins()) return;
    const text = $('#barcodeText').value.trim();
    if (!text) return toast('Enter text for barcode.');

    const canvas = $('#canvas');
    const ctx = canvas.getContext('2d');
    const width = 600;
    const height = 220;
    canvas.width = width;
    canvas.height = height;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#111';

    let x = 20;
    for (const ch of text) {
      const code = ch.charCodeAt(0);
      const bits = code.toString(2).padStart(8, '0');
      for (const bit of bits) {
        const barW = bit === '1' ? 3 : 1;
        ctx.fillRect(x, 20, barW, 150);
        x += barW + 1;
      }
      x += 4;
      if (x > width - 20) break;
    }

    ctx.font = '20px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(text, width / 2, 200);

    canvas.toBlob((blob) => blob && downloadBlob(blob, 'barcode.png'), 'image/png');
    $('#result').textContent = 'Barcode-style graphic generated.';
  };
}

function setupToolPage() {
  const id = document.body.dataset.tool;
  if (!id) return;

  const tool = toolById[id];
  if (tool && $('#toolTitle')) $('#toolTitle').textContent = tool.title;

  const handlers = {
    'word-counter': wordCounter,
    'case-converter': caseConverter,
    'lorem-ipsum': lorem,
    'text-to-speech': tts,
    'speech-to-text': stt,
    'text-rewriter': rewrite,
    'grammar-checker': grammar,
    'fancy-text': fancy,
    'text-diff': diff,
    'emoji-picker': emoji,
    'image-compressor': imageCompressor,
    'image-resizer': imageResizer,
    'image-format-converter': imageFormatConverter,
    'image-base64': imageBase64,
    'background-remover': backgroundRemover,
    'image-color-picker': imageColorPicker,
    'image-watermark': imageWatermark,
    'screenshot-to-code': screenshotToCode,
    'qr-generator': qrGenerator,
    'barcode-generator': barcodeGenerator,
  };

  handlers[id]?.();
}

window.addEventListener('DOMContentLoaded', () => {
  setupGlobal();
  renderCards();
  $('#search')?.addEventListener('input', renderCards);
  setupToolPage();
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);
});
