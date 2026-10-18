let timers = [];

export function after(ms, fn) {
  const t = setTimeout(fn, ms);
  timers.push(t);
  return t;
}

export function clearAll() {
  timers.forEach(clearTimeout);
  timers = [];            /* очищаем таймеры */
  stopAllAmbient(0);      /* мгновенно гасим фоны */
  stopAllOnce();          /* гасим разовые звуки */
}

/* ============================================================
   АУДИО ЧЕРЕЗ AUDIOCONTEXT (обход политики Chrome/Safari)
   ============================================================ */
let sharedAudioContext = null;
const audioBufferCache = new Map();

export function getAudioContext() {
  if (!sharedAudioContext) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (Ctx) sharedAudioContext = new Ctx();
  }
  return sharedAudioContext;
}

/* ============================================================
   РАЗБЛОКИРОВКА АУДИО (ВАЖНО ДЛЯ SAFARI)
   ============================================================ */
export function unlockAudio() {
  const ctx = getAudioContext();
  if (!ctx) return;

  // Если контекст на паузе (Safari часто его ставит на паузу) — будим
  if (ctx.state === "suspended") {
    ctx.resume().then(() => console.log("🔊 AudioContext running"));
  }

  // Проигрываем пустой буфер, чтобы окончательно разблокировать
  try {
    const buf = ctx.createBuffer(1, 1, 22050);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(ctx.destination);
    src.start(0);
    console.log("🔊 Silent buffer разблокирован, state:", ctx.state);
  } catch (e) {
    console.warn("⚠️ Silent buffer не сработал:", e);
  }
}

/* ============================================================
   ЗАГРУЗКА И ВОСПРОИЗВЕДЕНИЕ БУФЕРОВ
   ============================================================ */
export async function loadAudioBuffer(url) {
  if (audioBufferCache.has(url)) return audioBufferCache.get(url);
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const arrayBuffer = await response.arrayBuffer();
    const ctx = getAudioContext();
    if (!ctx) throw new Error("Нет AudioContext");
    
    // Safari очень придирчив к форматам. Если тут ошибка — значит файл не читается.
    const buffer = await ctx.decodeAudioData(arrayBuffer);
    audioBufferCache.set(url, buffer);
    return buffer;
  } catch (e) {
    console.warn(`❌ Ошибка загрузки буфера [${url}]:`, e);
    audioBufferCache.set(url, null);
    return null;
  }
}

export function playAudioBuffer(buffer, volume = 1.0, loop = false) {
  const ctx = getAudioContext();
  if (!ctx || !buffer) return null;
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = loop;
  const gain = ctx.createGain();
  gain.gain.value = volume;
  source.connect(gain);
  gain.connect(ctx.destination);
  source.start(0);
  return { source, gain };
}

export function stopAudioHandle(handle, fadeMs = 0) {
  if (!handle) return;
  const ctx = getAudioContext();
  const { source, gain } = handle;
  if (fadeMs > 0 && ctx) {
    try {
      const now = ctx.currentTime;
      gain.gain.setValueAtTime(gain.gain.value, now);
      gain.gain.linearRampToValueAtTime(0, now + fadeMs / 1000);
      setTimeout(() => { try { source.stop(); } catch (e) {} }, fadeMs + 50);
    } catch (e) {}
  } else {
    try { source.stop(); } catch (e) {}
  }
}

/* ============================================================
   ФОНОВЫЕ ЗВУКИ (циклично)
   ============================================================ */
let soundOn = true;
const ambientHandles = {};

export async function startAmbient(key, src, volume = 0.3) {
  if (!soundOn) return;
  stopAmbient(key, 0);
  const buffer = await loadAudioBuffer(src);
  if (!buffer) {
    console.warn(`❌ Фон [${key}] не загружен:`, src);
    return;
  }
  const handle = playAudioBuffer(buffer, volume, true);
  if (handle) {
    ambientHandles[key] = handle;
    console.log(`🎵 Фон [${key}] играет`);
  }
}

export function stopAmbient(key, fadeMs = 800) {
  const handle = ambientHandles[key];
  if (!handle) return;
  stopAudioHandle(handle, fadeMs);
  delete ambientHandles[key];
}

export function stopAllAmbient(fadeMs = 500) {
  Object.keys(ambientHandles).forEach((k) => stopAmbient(k, fadeMs));
}

/* ============================================================
   ОДНОРАЗОВЫЕ ЗВУКИ
   ============================================================ */
const onceHandles = new Set();

export async function playOnce(key, src, volume = 0.3) {
  if (!soundOn) return null;
  const buffer = await loadAudioBuffer(src);
  if (!buffer) {
    console.warn(`❌ Разовый [${key}] не загружен:`, src);
    return null;
  }
  const handle = playAudioBuffer(buffer, volume, false);
  if (handle) {
    onceHandles.add(handle);
    handle.source.onended = () => onceHandles.delete(handle);
  }
  return handle;
}

export function stopAllOnce() {
  onceHandles.forEach((h) => { try { h.source.stop(); } catch (e) {} });
  onceHandles.clear();
}