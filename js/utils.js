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

  // Короткий «тихий» WAV (0.02 сек тишины) — реальный источник, без него iOS не разблокирует
  const silentWav =
    "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";

  try {
    // 1. HTMLAudioElement с реальным источником
    const a = new Audio(silentWav);
    a.volume = 0.01;
    const p = a.play();
    if (p && p.catch) p.catch(() => {});

    // 2. AudioContext — резюмируем и проигрываем пустой буфер
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (Ctx) {
      const ctx = new Ctx();
      if (ctx.state === "suspended") ctx.resume();

      const buf = ctx.createBuffer(1, 1, 22050);
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.connect(ctx.destination);
      src.start(0);
    }

    audioUnlocked = true;
    console.log("🔊 Аудио разблокировано");
  } catch (e) {
    console.warn("Не удалось разблокировать аудио:", e);
  }
}

/* ============================================================
   ФОНОВЫЕ ЗВУКИ (циклично)
   ============================================================ */
let soundOn = true;
const ambientSounds = {};

export function startAmbient(key, src, volume = 0.3) {
  if (!soundOn) return;
  stopAmbient(key, 0);

  console.log(`🎵 Запускаю фон [${key}]:`, src);

  const a = new Audio(src);
  a.loop = true;
  a.volume = volume;
  a.preload = "auto";

  ambientSounds[key] = a;

  a.addEventListener("error", () => {
    console.error(`❌ Ошибка загрузки [${key}]:`, src, a.error);
  });

  a.play()
    .then(() => console.log(`✅ Фон [${key}] играет`))
    .catch((e) => console.warn(`⚠️ Фон [${key}] не запустился:`, e));
}

export function stopAmbient(key, fadeMs = 800) {
  const a = ambientSounds[key];
  if (!a) return;

  if (fadeMs <= 0) {
    a.pause();
    a.currentTime = 0;
    delete ambientSounds[key];
    return;
  }

  const stepTime = 60;
  const steps = Math.max(1, Math.floor(fadeMs / stepTime));
  const startVol = a.volume;
  const stepVol = startVol / steps;

  const fade = setInterval(() => {
    if (a.volume > stepVol) {
      a.volume = Math.max(0, a.volume - stepVol);
    } else {
      clearInterval(fade);
      a.pause();
      a.currentTime = 0;
      delete ambientSounds[key];
    }
  }, stepTime);
}

export function stopAllAmbient(fadeMs = 500) {
  Object.keys(ambientSounds).forEach((key) => stopAmbient(key, fadeMs));
}

/* ============================================================
   ОДНОРАЗОВЫЕ ЗВУКИ — теперь их можно остановить
   ============================================================ */
const onceSounds = new Set();

export function playOnce(key, src, volume = 0.3) {
  if (!soundOn) return null;
  const a = new Audio(src);
  a.volume = volume;
  a.preload = "auto";

  onceSounds.add(a);

  const cleanUp = () => onceSounds.delete(a);
  a.addEventListener("ended", cleanUp, { once: true });
  a.addEventListener("error", () => {
    console.error(`❌ Ошибка [${key}]:`, src, a.error);
    cleanUp();
  });

  a.play()
    .then(() => console.log(`✅ Разовый звук [${key}] играет`))
    .catch((e) => {
      console.warn(`⚠️ [${key}] не запустился:`, e);
      cleanUp();
    });

  return a;
}

export function stopAllOnce() {
  onceSounds.forEach((a) => {
    try {
      a.pause();
      a.currentTime = 0;
    } catch (e) {}
  });
  onceSounds.clear();
}