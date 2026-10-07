import { after } from "./utils.js";

const app = document.getElementById("app");
const pre = document.getElementById("preloader");
const preWord = document.getElementById("preloaderWord");

let soundOn = true;

/* ============================================================
   ПРЕЛОАДЕР
   ============================================================ */
export function runPreloader(onDone) {
  after(300, () => preWord.classList.add("is-visible"));
  after(3000, () => {
    preWord.classList.remove("is-visible");
    preWord.classList.add("is-fading");
  });
  after(5500, () => pre.classList.add("is-flashing"));
  after(7000, () => {
    pre.classList.add("is-gone");
    setTimeout(() => {
      pre.remove();
      onDone();
    }, 1300);
  });
}

/* ============================================================
   ВОСПРОИЗВЕДЕНИЕ ТВОЕГО ГОЛОСА
   ============================================================ */
function playVoice(src, volume = 1.0) {
  if (!soundOn) return null;
  const audio = new Audio(src);
  audio.volume = volume;
  audio.play().catch((err) => {
    console.warn("Не удалось воспроизвести", src, err);
  });
  return audio;
}

/* ============================================================
   СЦЕНА 0
   ============================================================ */
function buildNewspaper() {
  const el = document.createElement("section");
  el.className = "scene scene--newspaper";
  el.innerHTML = `
    <video class="fire-bg" autoplay muted loop playsinline preload="auto">
      <source src="assets/video/fire/10229380-hd_1920_1080_30fps.mp4" type="video/mp4">
    </video>
    <div class="fire-overlay"></div>

    <div class="newspaper">
      <div class="newspaper__spread is-active">
        <img src="assets/images/newspaper/pg-00.jpg" alt="">
        <img src="assets/images/newspaper/pg-01.jpg" alt="">
      </div>
      <div class="newspaper__spread">
        <img src="assets/images/newspaper/pg-02.jpg" alt="">
        <img src="assets/images/newspaper/pg-03.jpg" alt="">
      </div>
      <div class="newspaper__spread">
        <img src="assets/images/newspaper/pg-04.jpg" alt="">
        <img src="assets/images/newspaper/pg-05.jpg" alt="">
      </div>
    </div>

    <div class="title-bar">
      <div class="title-bar__inner" id="titleInner">
        <p class="title-bar__text" id="titleText"></p>
        <span class="title-bar__bottom-line"></span>
      </div>
    </div>
  `;
  return el;
}

export function playScene0() {
  const el = buildNewspaper();
  app.appendChild(el);
  void el.offsetWidth;
  el.classList.add("is-active");

  const spreads = [...el.querySelectorAll(".newspaper__spread")];
  const inner = el.querySelector("#titleInner");
  const textEl = el.querySelector("#titleText");

  // 1. Листаем на 2-й разворот
  after(3000, () => {
    spreads[0].classList.add("is-turning");
    spreads[0].classList.remove("is-active");
    spreads[1].classList.add("is-active");
  });

  // 2. ФРАЗА 1 — твой голос из катСцена1.wav
  after(4000, () => {
    textEl.textContent =
      "Мне было пятнадцать. Я приехала на каникулы к бабушке. Я не знала, что не вернусь.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");

    playVoice("assets/audio/катСцена1.wav", 1.0);
  });

  // 3. Убираем фразу 1
  after(11000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
  });
  after(12000, () => inner.classList.remove("is-visible"));

  // 4. ФРАЗА 2 — твой голос из катСцена2.wav
  after(15000, () => {
    textEl.classList.remove("is-fading");
    textEl.textContent = "Но я не жалею.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");

    playVoice("assets/audio/катСцена2.wav", 1.0);
  });

  // 5. Листаем на 3-й разворот
  after(16000, () => {
    spreads[1].classList.add("is-turning");
    spreads[1].classList.remove("is-active");
    spreads[2].classList.add("is-active");
  });

  // 6. Убираем фразу 2
  after(20000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
    inner.classList.remove("is-visible");
  });

  // 7. Конец сцены
  after(22500, () => {
    el.classList.remove("is-active");
    setTimeout(() => el.remove(), 2000);
  });
}
