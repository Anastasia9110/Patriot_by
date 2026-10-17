let timers = [];

export function after(ms, fn) {
  const t = setTimeout(fn, ms);
  timers.push(t);
  return t;
}

export function clearAll() {
  timers.forEach(clearTimeout);
  timers = [];
  stopAllAmbient(0);      /* ← 0, а не 500 — мгновенно */
  stopAllOnce();          /* ← теперь гасим и разовые звуки */
}

/* ============================================================
   РАЗБЛОКИРОВКА АУДИО
   ============================================================ */
let audioUnlocked = false;

export function unlockAudio() {
  if (audioUnlocked) return;

  // 1. Резюмируем общий AudioContext (главное для Chrome)
  const ctx = getAudioContext();
  if (ctx && ctx.state === "suspended") {
    ctx.resume().then(() => console.log("🔊 AudioContext running"));
  }

  // 2. На всякий случай — тихий WAV через Audio element (для Safari)
  const silentWav =
    "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";
  try {
    const a = new Audio(silentWav);
    a.volume = 0.01;
    const p = a.play();
    if (p && p.catch) p.catch(() => {});
  } catch (e) {}

  audioUnlocked = true;
  console.log("🔊 Аудио разблокировано");
}

/* ============================================================
   ФОНОВЫЕ ЗВУКИ (циклично)
   ============================================================ */
let soundOn = true;
const ambientSounds = {};

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
   ОДНОРАЗОВЫЕ ЗВУКИ — теперь их можно остановить
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
/* ============================================================
   АУДИО ЧЕРЕЗ AUDIOCONTEXT (обход политики Chrome/Safari)
   ============================================================ */
let sharedAudioContext = null;

export function getAudioContext() {
  if (!sharedAudioContext) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (Ctx) sharedAudioContext = new Ctx();
  }
  return sharedAudioContext;
}

const audioBufferCache = new Map();

export async function loadAudioBuffer(url) {
  if (audioBufferCache.has(url)) return audioBufferCache.get(url);
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error();
    const arrayBuffer = await response.arrayBuffer();
    const ctx = getAudioContext();
    if (!ctx) throw new Error();
    const buffer = await ctx.decodeAudioData(arrayBuffer);
    audioBufferCache.set(url, buffer);
    return buffer;
  } catch (e) {
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