let timers = [];

export function after(ms, fn) {
  const t = setTimeout(fn, ms);
  timers.push(t);
  return t;
}

export function clearAll() {
  timers.forEach(clearTimeout);
  timers = [];
  stopAllAmbient();
}

/* ============================================================
   РАЗБЛОКИРОВКА АУДИО (важно для Chrome / Safari)
   ============================================================ */
let audioUnlocked = false;

export function unlockAudio() {
  if (audioUnlocked) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === "suspended") ctx.resume();

    // Тихий "пустой" звук для разблокировки
    const a = new Audio();
    a.volume = 0;
    a.play().catch(() => {});
    audioUnlocked = true;
    console.log("🔊 Аудио разблокировано");
  } catch (e) {
    console.warn("Не удалось разблокировать аудио:", e);
  }
}

/* ============================================================
   ФОНОВЫЕ ЗВУКИ
   ============================================================ */
let soundOn = true;
const ambientSounds = {}; // Держим ссылки, чтобы не удалялись GC

export function startAmbient(key, src, volume = 0.3) {
  if (!soundOn) return;
  stopAmbient(key, 0);

  console.log(`🎵 Запускаю фон [${key}]:`, src);

  const a = new Audio(src);
  a.loop = true;
  a.volume = volume;
  a.preload = "auto";

  // Важно: сохраняем в объект, чтобы ссылка не потерялась
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
