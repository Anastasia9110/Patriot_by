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
      onDone && onDone();
    }, 1300);
  });
}

/* ============================================================
   ГОЛОС
   ============================================================ */
function playVoice(src, volume = 1.0) {
  if (!soundOn) return null;
  const a = new Audio(src);
  a.volume = volume;
  a.play().catch((e) => console.warn("Не удалось:", src, e));
  return a;
}

/* ============================================================
   СЦЕНА 0 — ГАЗЕТА
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

export function playScene0(onDone) {
  const el = buildNewspaper();
  app.appendChild(el);
  void el.offsetWidth;
  el.classList.add("is-active");

  const spreads = [...el.querySelectorAll(".newspaper__spread")];
  const inner = el.querySelector("#titleInner");
  const textEl = el.querySelector("#titleText");

  after(3000, () => {
    spreads[0].classList.add("is-turning");
    spreads[0].classList.remove("is-active");
    spreads[1].classList.add("is-active");
  });

  after(4000, () => {
    textEl.textContent =
      "Мне было пятнадцать. Я приехала на каникулы к бабушке. Я не знала, что не вернусь.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/1.mp3", 1.0);
  });

  after(11000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
  });
  after(12000, () => inner.classList.remove("is-visible"));

  after(15000, () => {
    textEl.classList.remove("is-fading");
    textEl.textContent = "Но я не жалею.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/2.mp3", 1.0);
  });

  after(16000, () => {
    spreads[1].classList.add("is-turning");
    spreads[1].classList.remove("is-active");
    spreads[2].classList.add("is-active");
  });

  after(20000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
    inner.classList.remove("is-visible");
  });

  after(22500, () => {
    el.classList.remove("is-active");
    setTimeout(() => { el.remove(); onDone && onDone(); }, 2000);
  });
}

/* ============================================================
   СЦЕНА 1 — ДОРОГА
   ============================================================ */
function buildRoad() {
  const el = document.createElement("section");
  el.className = "scene scene--road";
  el.innerHTML = `
    <div class="road-layer road-layer--scene1 is-active" id="roadLayer1"></div>
    <div class="road-layer road-layer--scene2"           id="roadLayer2"></div>
    <div class="road-grain"></div>
    <div class="road-vignette"></div>

    <div class="title-bar">
      <div class="title-bar__inner" id="roadTitleInner">
        <p class="title-bar__text" id="roadTitleText"></p>
        <span class="title-bar__bottom-line"></span>
      </div>
    </div>
  `;
  return el;
}

export function playScene1(onDone) {
  const el = buildRoad();
  app.appendChild(el);
  void el.offsetWidth;
  el.classList.add("is-active");

  // Ветер играет на фоне всю сцену
  startWind();

  const layer1 = el.querySelector("#roadLayer1");
  const layer2 = el.querySelector("#roadLayer2");
  const inner  = el.querySelector("#roadTitleInner");
  const textEl = el.querySelector("#roadTitleText");

  /* --- ЧАСТЬ 1: КОНТЕКСТ (00_1.mp3) --- */
  after(2000, () => {
    textEl.textContent =
      "Июнь 1941 года. Ленинградская школьница Зина Портнова приехала на летние каникулы к бабушке в деревню Зуи, под Витебском. С ней — младшая сестра Галя.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/00_1.mp3", 1.0);
  });

  after(14000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
  });
  after(15000, () => inner.classList.remove("is-visible"));

  /* --- ЧАСТЬ 2: НАЧАЛО ВОЙНЫ (00_2.mp3) --- */
  after(17000, () => {
    textEl.classList.remove("is-fading");
    textEl.textContent = "Через несколько дней началась война.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/00_2.mp3", 1.0);
  });

  after(23000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
  });
  after(24000, () => inner.classList.remove("is-visible"));

  /* --- Переход на вторую картинку --- */
  after(25000, () => {
    layer1.classList.remove("is-active");
    layer2.classList.add("is-active");
  });

  /* --- ЧАСТЬ 3: ДИАЛОГ С ГАЛЕЙ (без голоса, только титры) --- */
  after(26000, () => {
    textEl.classList.remove("is-fading");
    textEl.textContent = "— Зина, а скоро придём?";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
  });

  after(29500, () => { textEl.textContent = "— Скоро, Галя. Вон уже крыши видно."; });
  after(33000, () => { textEl.textContent = "— А бабушка нас ждёт?"; });
  after(36500, () => { textEl.textContent = "— Ждёт. Пирожки печёт."; });

  after(40000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
    inner.classList.remove("is-visible");
  });

  /* --- Конец сцены: гасим ветер --- */
  after(43000, () => {
    stopWind();
    el.classList.remove("is-active");
    setTimeout(() => { el.remove(); onDone && onDone(); }, 2000);
  });
}

/* ============================================================
   СЦЕНА 2 — ОБОЛЬ
   ============================================================ */
function buildObol() {
  const el = document.createElement("section");
  el.className = "scene scene--obol";
  el.innerHTML = `
    <div class="obol-layer obol-layer--scene1 is-active" id="obolLayer1"></div>
    <div class="obol-layer obol-layer--scene2"           id="obolLayer2"></div>
    <div class="road-grain"></div>
    <div class="road-vignette"></div>

    <div class="title-bar">
      <div class="title-bar__inner" id="obolTitleInner">
        <p class="title-bar__text" id="obolTitleText"></p>
        <span class="title-bar__bottom-line"></span>
      </div>
    </div>
  `;
  return el;
}

export function playScene2(onDone) {
  const el = buildObol();
  app.appendChild(el);
  void el.offsetWidth;
  el.classList.add("is-active");

  const layer1 = el.querySelector("#obolLayer1");
  const layer2 = el.querySelector("#obolLayer2");
  const inner  = el.querySelector("#obolTitleInner");
  const textEl = el.querySelector("#obolTitleText");

  after(2000, () => {
    textEl.textContent =
      "Оболь оккупировали. Немецкие солдаты. Патрули. Собаки. Люди шли с опущенными глазами.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/3.mp3", 1.0);
  });

  after(12000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
  });
  after(13000, () => inner.classList.remove("is-visible"));

  after(14500, () => {
    textEl.classList.remove("is-fading");
    textEl.textContent = "— Зина, уезжай. Ты молодая. Тебя не тронут.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
  });
  after(18500, () => { textEl.textContent = "— А ты? А Галя?"; });
  after(21500, () => { textEl.textContent = "— Мы справимся."; });
  after(24000, () => { textEl.textContent = "— Нет, бабушка. Я останусь."; });

  after(28000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
    inner.classList.remove("is-visible");
  });

  after(29500, () => {
    layer1.classList.remove("is-active");
    layer2.classList.add("is-active");
  });

  after(31000, () => {
    textEl.classList.remove("is-fading");
    textEl.textContent =
      "Я осталась не потому, что была смелой. Я просто не могла бросить своих.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/4.mp3", 1.0);
  });

  after(42000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
    inner.classList.remove("is-visible");
  });

  after(44000, () => {
    textEl.classList.remove("is-fading");
    textEl.textContent =
      "В 1942 году в Оболи создали подпольную организацию «Юные мстители». Меня приняли в её комитет. Мне было шестнадцать.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/5.mp3", 1.0);
  });

  after(58000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
    inner.classList.remove("is-visible");
  });

  after(60000, () => {
    el.classList.remove("is-active");
    setTimeout(() => { el.remove(); onDone && onDone(); }, 2000);
  });
}

/* ============================================================
   ФОНОВЫЙ ВЕТЕР
   ============================================================ */
let windAudio = null;

function startWind(volume = 0.35) {
  if (!soundOn) return;
  stopWind();
  windAudio = new Audio("assets/audio/wind.mp3");
  windAudio.loop = true;
  windAudio.volume = volume;
  windAudio.play().catch((e) => console.warn("Ветер не пошёл:", e));
}

function stopWind() {
  if (windAudio) {
    windAudio.pause();
    windAudio.currentTime = 0;
    windAudio = null;
  }
}