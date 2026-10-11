import { after, startAmbient, stopAmbient } from "./utils.js";

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
    setTimeout(() => {
      el.remove();
      onDone && onDone();
    }, 2000);
  });
}

/* ============================================================
   СЦЕНА 1 — ДОРОГА (00_1, 00_2, Galya, Galya2 и ветер)
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
  startAmbient("wind", "assets/audio/wind.mp3", 0.35);

  const layer1 = el.querySelector("#roadLayer1");
  const layer2 = el.querySelector("#roadLayer2");
  const inner = el.querySelector("#roadTitleInner");
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

  /* --- ЧАСТЬ 3: ДИАЛОГ С ГАЛЕЙ --- */

  // 1) «— Зина, а скоро придём?» — озвучка Galya.mp3
  after(26000, () => {
    textEl.classList.remove("is-fading");
    textEl.textContent = "— Зина, а скоро придём?";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/Galya.mp3", 1.0);
  });

  // 2) «— Скоро, Галя. Вон уже крыши видно.» — ответ Зины (без озвучки)
  after(29500, () => {
    textEl.textContent = "— Скоро, Галя. Вон уже крыши видно.";
  });

  // 3) «— А бабушка нас ждёт?» — озвучка Galya2.mp3
  after(33000, () => {
    textEl.textContent = "— А бабушка нас ждёт?";
    playVoice("assets/audio/Galya2.mp3", 1.0);
  });

  // 4) «— Ждёт. Пирожки печёт.» — ответ Зины (без озвучки)
  after(36500, () => {
    textEl.textContent = "— Ждёт. Пирожки печёт.";
  });

  after(40000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
    inner.classList.remove("is-visible");
  });

  /* --- Конец сцены: гасим ветер --- */
  after(43000, () => {
    stopAmbient("wind");
    el.classList.remove("is-active");
    setTimeout(() => {
      el.remove();
      onDone && onDone();
    }, 2000);
  });
}

/* ============================================================
   СЦЕНА 2 — ОБОЛЬ (с фоновым лаем и звуком деревни)
   ============================================================ */
function buildObol() {
  const el = document.createElement("section");
  el.className = "scene scene--obol";
  el.innerHTML = `
    <div class="obol-layer obol-layer--scene1 is-active"    id="obolLayer1"></div>
    <div class="obol-layer obol-layer--scene2"              id="obolLayer2"></div>
    <div class="obol-layer obol-layer--grandma-closed"      id="obolLayer3"></div>
    <div class="obol-layer obol-layer--grandma-talk"        id="obolLayer4"></div>

    <button class="obol-btn" id="obolBtn">ПОГОВОРИТЬ С БАБУШКОЙ</button>

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

  /* --- ФОНОВЫЕ ЗВУКИ СЦЕНЫ 2 --- */
  startAmbient("dog", "assets/audio/dogbarking.mp3", 0.15);
  startAmbient("village", "assets/audio/village.mp3", 0.2);

  const layer1 = el.querySelector("#obolLayer1");
  const layer2 = el.querySelector("#obolLayer2");
  const layer3 = el.querySelector("#obolLayer3");  // бабушка, рот закрыт
  const layer4 = el.querySelector("#obolLayer4");  // бабушка, говорит
  const btn    = el.querySelector("#obolBtn");
  const inner  = el.querySelector("#obolTitleInner");
  const textEl = el.querySelector("#obolTitleText");

  /* ---------- ЧАСТЬ 1: ОККУПАЦИЯ ---------- */

  after(2000, () => {
    textEl.textContent =
      "Оболь оккупировали. Немецкие солдаты. Патрули. Собаки. Люди шли с опущенными глазами.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    // playVoice("assets/audio/3.mp3", 1.0);
  });

  after(12000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
  });
  after(13000, () => inner.classList.remove("is-visible"));

  /* ---------- ЧАСТЬ 2: ЗИНА ОСТАЛАСЬ ---------- */

  after(14500, () => {
    layer1.classList.remove("is-active");
    layer2.classList.add("is-active");
  });

  after(15500, () => {
    textEl.classList.remove("is-fading");
    textEl.textContent =
      "Я осталась не потому, что была смелой. Я просто не могла бросить своих.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    // playVoice("assets/audio/4.mp3", 1.0);
  });
  /* ---------- КНОПКА: ПОГОВОРИТЬ С БАБУШКОЙ ---------- */

  after(21000, () => {
    btn.classList.add("is-visible");
  });

  btn.addEventListener("click", () => {
    btn.classList.remove("is-visible");
    btn.classList.add("is-gone");

    // Переходим на первый кадр бабушки (рот закрыт)
    layer2.classList.remove("is-active");
    layer3.classList.add("is-active");

    /* Диалог. На репликах бабушки переключаемся на layer4 (говорит),
       на репликах Зины — обратно на layer3 (рот закрыт). */

    // — Зина, уезжай. Ты молодая. Тебя не тронут. (бабушка)
    after(1500, () => {
      layer3.classList.remove("is-active");
      layer4.classList.add("is-active");

      textEl.classList.remove("is-fading");
      textEl.textContent = "— Зина, уезжай. Ты молодая. Тебя не тронут.";
      inner.classList.add("is-visible");
      textEl.classList.add("is-visible");
      // playVoice("assets/audio/5.mp3", 1.0);
    });

    // — А ты? А Галя? (Зина)
    after(7500, () => {
      layer4.classList.remove("is-active");
      layer3.classList.add("is-active");
      textEl.textContent = "— А ты? А Галя?";
    });

    // — Мы справимся. (бабушка)
    after(10500, () => {
      layer3.classList.remove("is-active");
      layer4.classList.add("is-active");
      textEl.textContent = "— Мы справимся.";
    });

    // — Нет, бабушка. Я останусь. (Зина)
    after(13500, () => {
      layer4.classList.remove("is-active");
      layer3.classList.add("is-active");
      textEl.textContent = "— Нет, бабушка. Я останусь.";
    });

    // Гасим титр
    after(17500, () => {
      textEl.classList.remove("is-visible");
      textEl.classList.add("is-fading");
      inner.classList.remove("is-visible");
    });

    // — В 1942 году создали «Юных мстителей» (монолог)
    after(19500, () => {
      textEl.classList.remove("is-fading");
      textEl.textContent =
        "В 1942 году в Оболи создали подпольную организацию «Юные мстители». Меня приняли в её комитет. Мне было шестнадцать.";
      inner.classList.add("is-visible");
      textEl.classList.add("is-visible");
      // playVoice("assets/audio/6.mp3", 1.0);
    });

    // Конец сцены
    after(34000, () => {
      textEl.classList.remove("is-visible");
      textEl.classList.add("is-fading");
      inner.classList.remove("is-visible");

      el.classList.remove("is-active");
      setTimeout(() => { el.remove(); onDone && onDone(); }, 2000);
    });
  });
}
/* ============================================================
   СЦЕНА 3 — ЛИСТОВКИ
   ============================================================ */
function buildLeaflet() {
  const el = document.createElement("section");
  el.className = "scene scene--leaflet";
  el.innerHTML = `
    <div class="leaflet-layer leaflet-layer--empty is-active" id="leafletLayer1"></div>
    <div class="leaflet-layer leaflet-layer--hands"           id="leafletLayer2"></div>
    <div class="leaflet-layer leaflet-layer--done"            id="leafletLayer3"></div>

    <video class="leaflet-video" id="leafletVideo"
           muted playsinline preload="auto">
      <source src="assets/video/leaflet.mp4" type="video/mp4">
    </video>

    <button class="leaflet-btn" id="leafletBtn">ПОВЕСИТЬ ЛИСТОВКУ</button>

    <div class="road-grain"></div>
    <div class="road-vignette"></div>

    <div class="title-bar">
      <div class="title-bar__inner" id="leafletTitleInner">
        <p class="title-bar__text" id="leafletTitleText"></p>
        <span class="title-bar__bottom-line"></span>
      </div>
    </div>
  `;
  return el;
}

export function playScene3(onDone) {
  const el = buildLeaflet();
  app.appendChild(el);
  void el.offsetWidth;
  el.classList.add("is-active");

  const layer1 = el.querySelector("#leafletLayer1");
  const layer2 = el.querySelector("#leafletLayer2");
  const layer3 = el.querySelector("#leafletLayer3");
  const video  = el.querySelector("#leafletVideo");
  const btn    = el.querySelector("#leafletBtn");
  const inner  = el.querySelector("#leafletTitleInner");
  const textEl = el.querySelector("#leafletTitleText");

  /* ---------- ФОТО 1: пустой переулок ---------- */

  // Монолог
  after(2000, () => {
    textEl.textContent =
      "Мы расклеивали листовки. Собирали сведения о немцах. Устраивали диверсии.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/6.mp3", 1.0);
  });

  after(12000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
  });
  after(13000, () => inner.classList.remove("is-visible"));

  /* ---------- ФОТО 2: руки клеят листовку ---------- */

  after(14500, () => {
    layer1.classList.remove("is-active");
    layer2.classList.add("is-active");
  });

  // Диалог с подпольщиком (титры)
  after(16000, () => {
    textEl.classList.remove("is-fading");
    textEl.textContent = "— Зина, быстрее. Клей.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/7.mp3", 1.0);
  });

  after(20000, () => {
    textEl.textContent = "— Я успею.";
    playVoice("assets/audio/8.mp3", 1.0);
  });

  after(24000, () => {
    textEl.textContent = "— Услышишь шаги — беги. Не оглядывайся.";
    playVoice("assets/audio/9.mp3", 1.0);
  });

  after(29000, () => {
    textEl.textContent = "— А вы?";
    playVoice("assets/audio/10.mp3", 1.0);
  });

  after(32000, () => {
    textEl.textContent = "— Мы тоже. Только позже.";
    playVoice("assets/audio/11.mp3", 1.0);
  });

  after(36000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
    inner.classList.remove("is-visible");
  });

  // Кнопка появляется после диалога
  after(38000, () => {
    btn.classList.add("is-visible");
  });

  /* ---------- КЛИК: играем ВИДЕО ---------- */
  btn.addEventListener("click", () => {
    btn.classList.remove("is-visible");
    btn.classList.add("is-gone");

    // Видео играет поверх картинки
    video.classList.add("is-active");
    video.play().catch((e) => console.warn("Видео не пошло:", e));

    // Когда видео закончилось — показываем фото 3
    video.addEventListener("ended", () => {
      video.classList.remove("is-active");
      video.pause();

      layer2.classList.remove("is-active");
      layer3.classList.add("is-active");

      // Финальный монолог на фото 3
      after(500, () => {
        textEl.classList.remove("is-fading");
        textEl.textContent =
          "Мои руки дрожали. Но листовка держалась. Значит, и я держалась.";
        inner.classList.add("is-visible");
        textEl.classList.add("is-visible");
        playVoice("assets/audio/12.mp3", 1.0);
      });

      after(11000, () => {
        textEl.classList.remove("is-visible");
        textEl.classList.add("is-fading");
        inner.classList.remove("is-visible");
      });

      // Конец сцены
      after(13000, () => {
        el.classList.remove("is-active");
        setTimeout(() => { el.remove(); onDone && onDone(); }, 2000);
      });
    }, { once: true });
  });
}
/* ============================================================
   СЦЕНА 4 — СТОЛОВАЯ
   ============================================================ */
function buildCanteen() {
  const el = document.createElement("section");
  el.className = "scene scene--canteen";
  el.innerHTML = `
    <div class="canteen-layer canteen-layer--work is-active" id="canteenWork"></div>
    <div class="canteen-layer canteen-layer--officer-closed" id="canteenOfficerClosed"></div>
    <div class="canteen-layer canteen-layer--officer-talk"   id="canteenOfficerTalk"></div>
    <div class="canteen-layer canteen-layer--pour"           id="canteenPour"></div>
    <div class="canteen-layer canteen-layer--carry"          id="canteenCarry"></div>
    <div class="canteen-layer canteen-layer--eat"            id="canteenEat"></div>

    <video class="canteen-video" id="canteenVideo"
           muted playsinline preload="auto">
      <source src="assets/video/canteen.mp4" type="video/mp4">
    </video>

    <button class="canteen-btn" id="canteenBtn">ДАЛЕЕ</button>

    <div class="road-grain"></div>
    <div class="road-vignette"></div>

    <div class="title-bar">
      <div class="title-bar__inner" id="canteenTitleInner">
        <p class="title-bar__text" id="canteenTitleText"></p>
        <span class="title-bar__bottom-line"></span>
      </div>
    </div>
  `;
  return el;
}

export function playScene4(onDone) {
  const el = buildCanteen();
  app.appendChild(el);
  void el.offsetWidth;
  el.classList.add("is-active");

  const work          = el.querySelector("#canteenWork");
  const officerClosed = el.querySelector("#canteenOfficerClosed");
  const officerTalk   = el.querySelector("#canteenOfficerTalk");
  const pour          = el.querySelector("#canteenPour");
  const carry         = el.querySelector("#canteenCarry");
  const eat           = el.querySelector("#canteenEat");
  const video         = el.querySelector("#canteenVideo");
  const btn           = el.querySelector("#canteenBtn");
  const inner         = el.querySelector("#canteenTitleInner");
  const textEl        = el.querySelector("#canteenTitleText");

  /* ============ ШАГ 1: Зина работает в столовой ============ */

  after(2000, () => {
    textEl.textContent =
      "По заданию подполья я устроилась работать в столовую курсов переподготовки немецких офицеров. Я носила воду. Дрова. Смотрела. Запоминала.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    // playVoice("assets/audio/13.mp3", 1.0);
  });

  after(16000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
    inner.classList.remove("is-visible");
  });

  /* ============ ШАГ 2: Офицер сидит, рот закрыт ============ */

  after(17500, () => {
    work.classList.remove("is-active");
    officerClosed.classList.add("is-active");
  });

  /* ============ ШАГ 3: Кнопка «РАЗГОВОР С ОФИЦЕРОМ» ============ */

  after(19500, () => {
    btn.textContent = "РАЗГОВОР С ОФИЦЕРОМ";
    btn.classList.remove("is-gone");
    btn.classList.add("is-visible");
  });

  /* ============ КЛИК 1: офицер говорит ============ */

  const onOfficerClick = () => {
    btn.removeEventListener("click", onOfficerClick);
    btn.classList.remove("is-visible");
    btn.classList.add("is-gone");

    officerClosed.classList.remove("is-active");
    officerTalk.classList.add("is-active");

    // «Wasser! Schnell!» — офицер с открытым ртом
    after(500, () => {
      textEl.classList.remove("is-fading");
      textEl.textContent = "— Wasser! Schnell!";
      inner.classList.add("is-visible");
      textEl.classList.add("is-visible");
      // playVoice("assets/audio/14.mp3", 1.0);
    });

    // «Ja.» — офицер снова с ЗАКРЫТЫМ ртом
    after(4500, () => {
      officerTalk.classList.remove("is-active");
      officerClosed.classList.add("is-active");

      textEl.textContent = "— Ja.";
      // playVoice("assets/audio/15.mp3", 1.0);
    });

    // Гасим титр
    after(8000, () => {
      textEl.classList.remove("is-visible");
      textEl.classList.add("is-fading");
      inner.classList.remove("is-visible");
    });

    /* ============ ШАГ 4: Рука сыплет порошок ============ */

    after(10000, () => {
      officerClosed.classList.remove("is-active");
      pour.classList.add("is-active");
    });

    // «А однажды принесла яд.»
    after(11500, () => {
      textEl.classList.remove("is-fading");
      textEl.textContent = "А однажды принесла яд.";
      inner.classList.add("is-visible");
      textEl.classList.add("is-visible");
      // playVoice("assets/audio/16.mp3", 1.0);
    });

    // Гасим титр
    after(16000, () => {
      textEl.classList.remove("is-visible");
      textEl.classList.add("is-fading");
      inner.classList.remove("is-visible");
    });

    /* ============ ШАГ 5: Кнопка «ОТРАВИТЬ СУП» ============ */

    after(18000, () => {
      btn.textContent = "ОТРАВИТЬ СУП";
      btn.classList.remove("is-gone");
      btn.classList.add("is-visible");
    });

    /* ============ КЛИК 2: видео с кастрюлей ============ */

    const onPoisonClick = () => {
      btn.removeEventListener("click", onPoisonClick);
      btn.classList.remove("is-visible");
      btn.classList.add("is-gone");

      pour.classList.remove("is-active");
      video.classList.add("is-active");

      video.currentTime = 0;
      video.play().catch((e) => console.warn("Видео не пошло:", e));

      // «Погибло более ста офицеров.»
      after(1000, () => {
        textEl.classList.remove("is-fading");
        textEl.textContent = "Погибло более ста офицеров.";
        inner.classList.add("is-visible");
        textEl.classList.add("is-visible");
        // playVoice("assets/audio/17.mp3", 1.0);
      });

      // Ждём конца видео
      video.addEventListener("ended", () => {
        video.classList.remove("is-active");
        carry.classList.add("is-active");

        textEl.classList.remove("is-visible");
        textEl.classList.add("is-fading");
        inner.classList.remove("is-visible");

        /* ============ ШАГ 6: Зина несёт суп ============ */

        after(1500, () => {
          textEl.classList.remove("is-fading");
          textEl.textContent =
            "Меня заставили попробовать суп. Чтобы доказать, что я не причастна.";
          inner.classList.add("is-visible");
          textEl.classList.add("is-visible");
        });

        after(11000, () => {
          textEl.classList.remove("is-visible");
          textEl.classList.add("is-fading");
          inner.classList.remove("is-visible");
        });

        /* ============ ШАГ 7: Зина ест ============ */

        after(13000, () => {
          carry.classList.remove("is-active");
          eat.classList.add("is-active");
        });

        after(14500, () => {
          textEl.classList.remove("is-fading");
          textEl.textContent = "Я ела. И чудом выжила.";
          inner.classList.add("is-visible");
          textEl.classList.add("is-visible");
          // playVoice("assets/audio/18.mp3", 1.0);
        });

        after(24000, () => {
          textEl.textContent =
            "Я не считала. Я просто хотела, чтобы это закончилось.";
          // playVoice("assets/audio/19.mp3", 1.0);
        });

        after(33000, () => {
          textEl.classList.remove("is-visible");
          textEl.classList.add("is-fading");
          inner.classList.remove("is-visible");
        });

        // Конец сцены
        after(35000, () => {
          el.classList.remove("is-active");
          setTimeout(() => { el.remove(); onDone && onDone(); }, 2000);
        });
      }, { once: true });
    };

    btn.addEventListener("click", onPoisonClick, { once: true });
  };

  btn.addEventListener("click", onOfficerClick, { once: true });
}
/* ============================================================
   СЦЕНА 5 — ЛЕС
   ============================================================ */
function buildForest() {
  const el = document.createElement("section");
  el.className = "scene scene--forest";
  el.innerHTML = `
    <div class="forest-layer forest-layer--camp is-active"        id="forestCamp"></div>
    <div class="forest-layer forest-layer--commander-closed"      id="forestCommanderClosed"></div>
    <div class="forest-layer forest-layer--commander-talk"        id="forestCommanderTalk"></div>
    <div class="forest-layer forest-layer--shooting"              id="forestShooting"></div>
    <div class="forest-layer forest-layer--scout"                 id="forestScout"></div>
    <div class="forest-layer forest-layer--grown"                 id="forestGrown"></div>

    <button class="forest-btn" id="forestBtn">ПОГОВОРИТЬ С КОМАНДИРОМ</button>

    <div class="road-grain"></div>
    <div class="road-vignette"></div>

    <div class="title-bar">
      <div class="title-bar__inner" id="forestTitleInner">
        <p class="title-bar__text" id="forestTitleText"></p>
        <span class="title-bar__bottom-line"></span>
      </div>
    </div>
  `;
  return el;
}

export function playScene5(onDone) {
  const el = buildForest();
  app.appendChild(el);
  void el.offsetWidth;
  el.classList.add("is-active");

  const camp            = el.querySelector("#forestCamp");
  const commanderClosed = el.querySelector("#forestCommanderClosed");
  const commanderTalk   = el.querySelector("#forestCommanderTalk");
  const shooting        = el.querySelector("#forestShooting");
  const scout           = el.querySelector("#forestScout");
  const grown           = el.querySelector("#forestGrown");
  const btn             = el.querySelector("#forestBtn");
  const inner           = el.querySelector("#forestTitleInner");
  const textEl          = el.querySelector("#forestTitleText");

  /* ============ ЧАСТЬ 1: Лагерь в лесу ============ */

  after(2000, () => {
    textEl.textContent =
      "После этого оставаться в Оболи было опасно. Летом 1943 года меня отправили в партизанский отряд имени Ворошилова.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    // playVoice("assets/audio/20.mp3", 1.0);
  });

  after(13000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
    inner.classList.remove("is-visible");
  });

  /* ============ ЧАСТЬ 2: Командир, рот закрыт ============ */

  after(14500, () => {
    camp.classList.remove("is-active");
    commanderClosed.classList.add("is-active");
  });

  /* ============ Кнопка «ПОГОВОРИТЬ С КОМАНДИРОМ» ============ */

  after(16500, () => {
    btn.classList.add("is-visible");
  });

  /* ============ КЛИК: диалог с командиром ============ */

  btn.addEventListener("click", () => {
    btn.classList.remove("is-visible");
    btn.classList.add("is-gone");

    // — Портнова, страшно? (командир, рот открыт)
    after(500, () => {
      commanderClosed.classList.remove("is-active");
      commanderTalk.classList.add("is-active");

      textEl.classList.remove("is-fading");
      textEl.textContent = "— Портнова, страшно?";
      inner.classList.add("is-visible");
      textEl.classList.add("is-visible");
      // playVoice("assets/audio/21.mp3", 1.0);
    });

    // — Страшно. (Зина, командир молчит)
    after(4500, () => {
      commanderTalk.classList.remove("is-active");
      commanderClosed.classList.add("is-active");
      textEl.textContent = "— Страшно.";
      // playVoice("assets/audio/22.mp3", 1.0);
    });

    // — А почему не уходишь? (командир, рот открыт)
    after(7500, () => {
      commanderClosed.classList.remove("is-active");
      commanderTalk.classList.add("is-active");
      textEl.textContent = "— А почему не уходишь?";
      // playVoice("assets/audio/23.mp3", 1.0);
    });

    // — Если все уйдут, кто останется? (Зина, командир молчит)
    after(11500, () => {
      commanderTalk.classList.remove("is-active");
      commanderClosed.classList.add("is-active");
      textEl.textContent = "— Если все уйдут, кто останется?";
      // playVoice("assets/audio/24.mp3", 1.0);
    });

    // — Ты ребёнок. (командир, рот открыт)
    after(16000, () => {
      commanderClosed.classList.remove("is-active");
      commanderTalk.classList.add("is-active");
      textEl.textContent = "— Ты ребёнок.";
      // playVoice("assets/audio/25.mp3", 1.0);
    });

    // — Уже нет. (Зина, командир молчит)
    after(19500, () => {
      commanderTalk.classList.remove("is-active");
      commanderClosed.classList.add("is-active");
      textEl.textContent = "— Уже нет.";
      // playVoice("assets/audio/26.mp3", 1.0);
    });

    // Гасим титр
    after(24000, () => {
      textEl.classList.remove("is-visible");
      textEl.classList.add("is-fading");
      inner.classList.remove("is-visible");
    });

    /* ============ ЧАСТЬ 3: Монолог «В лесу я впервые...» ============ */

    after(26000, () => {
      textEl.classList.remove("is-fading");
      textEl.textContent =
        "В лесу я впервые почувствовала, что я не одна. Что нас много. И что я могу быть нужной.";
      inner.classList.add("is-visible");
      textEl.classList.add("is-visible");
      // playVoice("assets/audio/27.mp3", 1.0);
    });

    after(38000, () => {
      textEl.classList.remove("is-visible");
      textEl.classList.add("is-fading");
      inner.classList.remove("is-visible");
    });

    /* ============ ЧАСТЬ 4: Зина учится стрелять ============ */

    after(40000, () => {
      commanderClosed.classList.remove("is-active");
      shooting.classList.add("is-active");

      textEl.classList.remove("is-fading");
      textEl.textContent =
        "С августа 1943 года я — разведчица. Я научилась стрелять.";
      inner.classList.add("is-visible");
      textEl.classList.add("is-visible");
      // playVoice("assets/audio/28.mp3", 1.0);
    });

    after(52000, () => {
      textEl.classList.remove("is-visible");
      textEl.classList.add("is-fading");
      inner.classList.remove("is-visible");
    });

    /* ============ ЧАСТЬ 5: Зина идёт на задание ============ */

    after(54000, () => {
      shooting.classList.remove("is-active");
      scout.classList.add("is-active");

      textEl.classList.remove("is-fading");
      textEl.textContent = "Я ходила на задания.";
      inner.classList.add("is-visible");
      textEl.classList.add("is-visible");
      // playVoice("assets/audio/29.mp3", 1.0);
    });

    after(63000, () => {
      textEl.classList.remove("is-visible");
      textEl.classList.add("is-fading");
      inner.classList.remove("is-visible");
    });

    /* ============ ЧАСТЬ 6: Зина выросла ============ */

    after(65000, () => {
      scout.classList.remove("is-active");
      grown.classList.add("is-active");

      textEl.classList.remove("is-fading");
      textEl.textContent = "Я выросла.";
      inner.classList.add("is-visible");
      textEl.classList.add("is-visible");
      // playVoice("assets/audio/30.mp3", 1.0);
    });

    after(72000, () => {
      textEl.classList.remove("is-visible");
      textEl.classList.add("is-fading");
      inner.classList.remove("is-visible");
    });

    /* ============ Конец сцены ============ */

    after(75000, () => {
      el.classList.remove("is-active");
      setTimeout(() => { el.remove(); onDone && onDone(); }, 2000);
    });
  });
}
/* ============================================================
   СЦЕНА 6 — ЗАДАНИЕ
   ============================================================ */
function buildMestishche() {
  const el = document.createElement("section");
  el.className = "scene scene--mestishche";
  el.innerHTML = `
    <div class="mestishche-layer mestishche-layer--empty is-active" id="mestEmpty"></div>
    <div class="mestishche-layer mestishche-layer--walk"            id="mestWalk"></div>
    <div class="mestishche-layer mestishche-layer--anna-closed"     id="mestAnnaClosed"></div>
    <div class="mestishche-layer mestishche-layer--anna-talk"       id="mestAnnaTalk"></div>
    <div class="mestishche-layer mestishche-layer--police"          id="mestPolice"></div>
    <div class="mestishche-layer mestishche-layer--arrest"          id="mestArrest"></div>

    <button class="mestishche-btn" id="mestBtn">ОКЛИКНУТЬ АННУ</button>

    <div class="road-grain"></div>
    <div class="road-vignette"></div>

    <div class="title-bar">
      <div class="title-bar__inner" id="mestTitleInner">
        <p class="title-bar__text" id="mestTitleText"></p>
        <span class="title-bar__bottom-line"></span>
      </div>
    </div>
  `;
  return el;
}

export function playScene6(onDone) {
  const el = buildMestishche();
  app.appendChild(el);
  void el.offsetWidth;
  el.classList.add("is-active");

  const empty      = el.querySelector("#mestEmpty");
  const walk       = el.querySelector("#mestWalk");
  const annaClosed = el.querySelector("#mestAnnaClosed");
  const annaTalk   = el.querySelector("#mestAnnaTalk");
  const police     = el.querySelector("#mestPolice");
  const arrest     = el.querySelector("#mestArrest");
  const btn        = el.querySelector("#mestBtn");
  const inner      = el.querySelector("#mestTitleInner");
  const textEl     = el.querySelector("#mestTitleText");

  /* ============ ЧАСТЬ 1: Деревня Мостище, пусто ============ */

  after(2000, () => {
    textEl.textContent =
      "Декабрь 1943 года. «Юные мстители» были раскрыты. Многие арестованы. Я вызвалась установить связь с оставшимися.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    // playVoice("assets/audio/31.mp3", 1.0);
  });

  after(14000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
    inner.classList.remove("is-visible");
  });

  /* ============ ЧАСТЬ 2: Зина идёт по улице ============ */

  after(15500, () => {
    empty.classList.remove("is-active");
    walk.classList.add("is-active");
  });

  after(16500, () => {
    textEl.classList.remove("is-fading");
    textEl.textContent =
      "Я возвращалась с задания. Деревня Мостище. Снег. Тишина. Слишком тихая.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    // playVoice("assets/audio/32.mp3", 1.0);
  });

  after(26000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
    inner.classList.remove("is-visible");
  });

  /* ============ ЧАСТЬ 3: Анна, рот закрыт ============ */

  after(27500, () => {
    walk.classList.remove("is-active");
    annaClosed.classList.add("is-active");
  });

  /* ============ Кнопка «ОКЛИКНУТЬ АННУ» ============ */

  after(29500, () => {
    btn.classList.add("is-visible");
  });

  /* ============ КЛИК: Анна кричит ============ */

  btn.addEventListener("click", () => {
    btn.classList.remove("is-visible");
    btn.classList.add("is-gone");

    // Анна кричит — кадр «рот открыт»
    after(500, () => {
      annaClosed.classList.remove("is-active");
      annaTalk.classList.add("is-active");

      textEl.classList.remove("is-fading");
      textEl.textContent = "— Вот она! Зина! Это она!";
      inner.classList.add("is-visible");
      textEl.classList.add("is-visible");
      // playVoice("assets/audio/33.mp3", 1.0);
    });

    // Анна снова молчит — возврат на кадр «рот закрыт»
    after(5500, () => {
      annaTalk.classList.remove("is-active");
      annaClosed.classList.add("is-active");
    });

    // Монолог про Анну
    after(7000, () => {
      textEl.textContent =
        "Её звали Анна Храповицкая. Местная. Она узнала меня. И выдала.";
      // playVoice("assets/audio/34.mp3", 1.0);
    });

    // Гасим титр
    after(14000, () => {
      textEl.classList.remove("is-visible");
      textEl.classList.add("is-fading");
      inner.classList.remove("is-visible");
    });

    /* ============ ЧАСТЬ 4: Полицаи ============ */

    after(16000, () => {
      annaClosed.classList.remove("is-active");
      police.classList.add("is-active");
    });

    /* ============ ЧАСТЬ 5: Арест ============ */

    after(21000, () => {
      police.classList.remove("is-active");
      arrest.classList.add("is-active");

      textEl.classList.remove("is-fading");
      textEl.textContent = "Меня схватили.";
      inner.classList.add("is-visible");
      textEl.classList.add("is-visible");
      // playVoice("assets/audio/35.mp3", 1.0);
    });

    after(28000, () => {
      textEl.classList.remove("is-visible");
      textEl.classList.add("is-fading");
      inner.classList.remove("is-visible");
    });

    /* ============ Конец сцены ============ */

    after(31000, () => {
      el.classList.remove("is-active");
      setTimeout(() => { el.remove(); onDone && onDone(); }, 2000);
    });
  });
}
/* ============================================================
   СЦЕНА 7 — ДОПРОС
   ============================================================ */
function buildInterrog() {
  const el = document.createElement("section");
  el.className = "scene scene--interrog";
  el.innerHTML = `
    <div class="interrog-layer interrog-layer--empty is-active"  id="intEmpty"></div>
    <div class="interrog-layer interrog-layer--officer-closed"   id="intOfficerClosed"></div>
    <div class="interrog-layer interrog-layer--officer-talk"     id="intOfficerTalk"></div>
    <div class="interrog-layer interrog-layer--zina-table"       id="intZinaTable"></div>
    <div class="interrog-layer interrog-layer--zina-talk"        id="intZinaTalk"></div>
    <div class="interrog-layer interrog-layer--hand-gun"         id="intHandGun"></div>
    <div class="interrog-layer interrog-layer--run"              id="intRun"></div>

    <div class="interrog-flash" id="intFlash"></div>

    <button class="interrog-btn" id="intBtn">ДАЛЕЕ</button>

    <div class="road-grain"></div>
    <div class="road-vignette"></div>

    <div class="title-bar">
      <div class="title-bar__inner" id="intTitleInner">
        <p class="title-bar__text" id="intTitleText"></p>
        <span class="title-bar__bottom-line"></span>
      </div>
    </div>
  `;
  return el;
}

export function playScene7(onDone) {
  const el = buildInterrog();
  app.appendChild(el);
  void el.offsetWidth;
  el.classList.add("is-active");

  const empty         = el.querySelector("#intEmpty");
  const officerClosed = el.querySelector("#intOfficerClosed");
  const officerTalk   = el.querySelector("#intOfficerTalk");
  const zinaTable     = el.querySelector("#intZinaTable");
  const zinaTalk      = el.querySelector("#intZinaTalk");
  const handGun       = el.querySelector("#intHandGun");
  const run           = el.querySelector("#intRun");
  const flash         = el.querySelector("#intFlash");
  const btn           = el.querySelector("#intBtn");
  const inner         = el.querySelector("#intTitleInner");
  const textEl        = el.querySelector("#intTitleText");

  /* ---------- ЧАСТЬ 1: Пустая комната ---------- */

  after(2000, () => {
    textEl.textContent = "Меня допрашивали. Долго. Я молчала.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
  });

  after(9000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
    inner.classList.remove("is-visible");
  });

  /* ---------- ЧАСТЬ 2: Следователь, рот закрыт ---------- */

  after(10500, () => {
    empty.classList.remove("is-active");
    officerClosed.classList.add("is-active");
  });

  /* ---------- Кнопка 1: «ОТВЕТИТЬ СЛЕДОВАТЕЛЮ» ---------- */

  after(12500, () => {
    btn.textContent = "ОТВЕТИТЬ СЛЕДОВАТЕЛЮ";
    btn.classList.remove("is-gone");
    btn.classList.add("is-visible");
  });

  const onAnswerClick = () => {
    btn.removeEventListener("click", onAnswerClick);
    btn.classList.remove("is-visible");
    btn.classList.add("is-gone");

    // Следователь кричит
    officerClosed.classList.remove("is-active");
    officerTalk.classList.add("is-active");

    // — Кто ещё? Где отряд? Говори!
    after(500, () => {
      textEl.classList.remove("is-fading");
      textEl.textContent = "— Кто ещё? Где отряд? Говори!";
      inner.classList.add("is-visible");
      textEl.classList.add("is-visible");
    });

    // — … (Зина молчит) → кадр «Зина за столом»
    after(5500, () => {
      officerTalk.classList.remove("is-active");
      zinaTable.classList.add("is-active");
      textEl.textContent = "— …";
    });

    // — Ты пожалеешь. (следователь)
    after(9000, () => {
      zinaTable.classList.remove("is-active");
      officerTalk.classList.add("is-active");
      textEl.textContent = "— Ты пожалеешь.";
    });

    // — Я уже жалею. Что не успела больше. (Зина, рот ОТКРЫТ)
    after(13000, () => {
      officerTalk.classList.remove("is-active");
      zinaTalk.classList.add("is-active");
      textEl.textContent = "— Я уже жалею. Что не успела больше.";
    });

    // Зина закончила — рот ЗАКРЫТ
    after(17500, () => {
      zinaTalk.classList.remove("is-active");
      zinaTable.classList.add("is-active");
    });

    // Гасим титр
    after(19000, () => {
      textEl.classList.remove("is-visible");
      textEl.classList.add("is-fading");
      inner.classList.remove("is-visible");
    });

    /* ---------- ЧАСТЬ 3: Рука тянется к пистолету ---------- */

    after(21000, () => {
      zinaTable.classList.remove("is-active");
      zinaTalk.classList.remove("is-active");
      handGun.classList.add("is-active");

      textEl.classList.remove("is-fading");
      textEl.textContent = "Только не дрожи. Только не дрожи.";
      inner.classList.add("is-visible");
      textEl.classList.add("is-visible");
    });

    after(27000, () => {
      textEl.classList.remove("is-visible");
      textEl.classList.add("is-fading");
      inner.classList.remove("is-visible");
    });

    /* ---------- Кнопка 2: «ВЫХВАТИТЬ ПИСТОЛЕТ» ---------- */

    after(29000, () => {
      btn.textContent = "ВЫХВАТИТЬ ПИСТОЛЕТ";
      btn.classList.remove("is-gone");
      btn.classList.add("is-visible");
    });

    const onShootClick = () => {
      btn.removeEventListener("click", onShootClick);
      btn.classList.remove("is-visible");
      btn.classList.add("is-gone");

      // Вспышка
      flash.classList.add("is-active");
      setTimeout(() => { flash.classList.remove("is-active"); }, 400);

      // Переход на кадр «Зина бежит»
      after(600, () => {
        handGun.classList.remove("is-active");
        run.classList.add("is-active");

        textEl.classList.remove("is-fading");
        textEl.textContent = "Я выстрелила. И побежала.";
        inner.classList.add("is-visible");
        textEl.classList.add("is-visible");
      });

      after(9000, () => {
        textEl.classList.remove("is-visible");
        textEl.classList.add("is-fading");
        inner.classList.remove("is-visible");
      });

      after(12000, () => {
        el.classList.remove("is-active");
        setTimeout(() => { el.remove(); onDone && onDone(); }, 2000);
      });
    };

    btn.addEventListener("click", onShootClick, { once: true });
  };

  btn.addEventListener("click", onAnswerClick, { once: true });
}
/* ============================================================
   СЦЕНА 8 — РЕКА
   ============================================================ */
function buildRiver() {
  const el = document.createElement("section");
  el.className = "scene scene--river";
  el.innerHTML = `
    <div class="river-layer river-layer--run is-active" id="rivRun"></div>
    <div class="river-layer river-layer--bank"          id="rivBank"></div>
    <div class="river-layer river-layer--zina"          id="rivZina"></div>
    <div class="river-layer river-layer--pursuers"      id="rivPursuers"></div>
    <div class="river-layer river-layer--swim"          id="rivSwim"></div>
    <div class="river-layer river-layer--grab"          id="rivGrab"></div>
    <div class="river-layer river-layer--caught"        id="rivCaught"></div>

    <button class="river-btn" id="riverBtn">БЕЖАТЬ</button>

    <div class="road-grain"></div>
    <div class="road-vignette"></div>

    <div class="title-bar">
      <div class="title-bar__inner" id="riverTitleInner">
        <p class="title-bar__text" id="riverTitleText"></p>
        <span class="title-bar__bottom-line"></span>
      </div>
    </div>
  `;
  return el;
}

export function playScene8(onDone) {
  const el = buildRiver();
  app.appendChild(el);
  void el.offsetWidth;
  el.classList.add("is-active");

  const run       = el.querySelector("#rivRun");
  const bank      = el.querySelector("#rivBank");
  const zina      = el.querySelector("#rivZina");
  const pursuers  = el.querySelector("#rivPursuers");
  const swim      = el.querySelector("#rivSwim");
  const grab      = el.querySelector("#rivGrab");
  const caught    = el.querySelector("#rivCaught");
  const btn       = el.querySelector("#riverBtn");
  const inner     = el.querySelector("#riverTitleInner");
  const textEl    = el.querySelector("#riverTitleText");

  /* ============ ЧАСТЬ 1: Зина бежит через лес ============ */

  after(2000, () => {
    textEl.textContent = "Я бежала. Не помню сколько. Ноги несли сами.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    // playVoice("assets/audio/42.mp3", 1.0);
  });

  after(10000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
    inner.classList.remove("is-visible");
  });

  /* ============ ЧАСТЬ 2: Река ============ */

  after(11500, () => {
    run.classList.remove("is-active");
    bank.classList.add("is-active");
  });

  after(12500, () => {
    textEl.classList.remove("is-fading");
    textEl.textContent = "Река. За ней — лес. Если переплыву — уйду.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    // playVoice("assets/audio/43.mp3", 1.0);
  });

  after(22000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
    inner.classList.remove("is-visible");
  });

  /* ============ ЧАСТЬ 3: Зина у воды ============ */

  after(23500, () => {
    bank.classList.remove("is-active");
    zina.classList.add("is-active");
  });

  /* ============ Кнопка «БЕЖАТЬ» ============ */

  after(25500, () => {
    btn.classList.add("is-visible");
  });

  /* ============ КЛИК: погоня ============ */

  btn.addEventListener("click", () => {
    btn.classList.remove("is-visible");
    btn.classList.add("is-gone");

    /* ---------- Преследователи ---------- */

    after(500, () => {
      zina.classList.remove("is-active");
      pursuers.classList.add("is-active");

      textEl.classList.remove("is-fading");
      textEl.textContent = "Они уже были рядом.";
      inner.classList.add("is-visible");
      textEl.classList.add("is-visible");
      // playVoice("assets/audio/44.mp3", 1.0);
    });

    after(5000, () => {
      textEl.classList.remove("is-visible");
      textEl.classList.add("is-fading");
      inner.classList.remove("is-visible");
    });

    /* ---------- Зина в воде ---------- */

    after(6500, () => {
      pursuers.classList.remove("is-active");
      swim.classList.add("is-active");

      textEl.classList.remove("is-fading");
      textEl.textContent = "Вода обжигала.";
      inner.classList.add("is-visible");
      textEl.classList.add("is-visible");
      // playVoice("assets/audio/45.mp3", 1.0);
    });

    after(13000, () => {
      textEl.classList.remove("is-visible");
      textEl.classList.add("is-fading");
      inner.classList.remove("is-visible");
    });

    /* ---------- Руки хватают ---------- */

    after(14500, () => {
      swim.classList.remove("is-active");
      grab.classList.add("is-active");
    });

    /* ---------- Зина на снегу ---------- */

    after(19000, () => {
      grab.classList.remove("is-active");
      caught.classList.add("is-active");

      textEl.classList.remove("is-fading");
      textEl.textContent = "Они вытащили меня. Я не сопротивлялась. Сил не было.";
      inner.classList.add("is-visible");
      textEl.classList.add("is-visible");
      // playVoice("assets/audio/46.mp3", 1.0);
    });

    after(29000, () => {
      textEl.classList.remove("is-visible");
      textEl.classList.add("is-fading");
      inner.classList.remove("is-visible");
    });

    /* ============ Конец сцены ============ */

    after(32000, () => {
      el.classList.remove("is-active");
      setTimeout(() => { el.remove(); onDone && onDone(); }, 2000);
    });
  });
}
/* ============================================================
   СЦЕНА 9 — ТЮРЬМА
   ============================================================ */
function buildPrison() {
  const el = document.createElement("section");
  el.className = "scene scene--prison";
  el.innerHTML = `
    <div class="prison-layer prison-layer--cell is-active"   id="priCell"></div>
    <div class="prison-layer prison-layer--officer-closed"   id="priOfficerClosed"></div>
    <div class="prison-layer prison-layer--officer-talk"     id="priOfficerTalk"></div>
    <div class="prison-layer prison-layer--zina"             id="priZina"></div>
    <div class="prison-layer prison-layer--zina-talk"        id="priZinaTalk"></div>
    <div class="prison-layer prison-layer--final"            id="priFinal"></div>

    <button class="prison-btn" id="priBtn">ОТВЕЧАТЬ СЛЕДОВАТЕЛЮ</button>

    <div class="road-grain"></div>
    <div class="road-vignette"></div>

    <div class="title-bar">
      <div class="title-bar__inner" id="priTitleInner">
        <p class="title-bar__text" id="priTitleText"></p>
        <span class="title-bar__bottom-line"></span>
      </div>
    </div>
  `;
  return el;
}

export function playScene9(onDone) {
  const el = buildPrison();
  app.appendChild(el);
  void el.offsetWidth;
  el.classList.add("is-active");

  const cell          = el.querySelector("#priCell");
  const officerClosed = el.querySelector("#priOfficerClosed");
  const officerTalk   = el.querySelector("#priOfficerTalk");
  const zina          = el.querySelector("#priZina");
  const zinaTalk      = el.querySelector("#priZinaTalk");
  const final         = el.querySelector("#priFinal");
  const btn           = el.querySelector("#priBtn");
  const inner         = el.querySelector("#priTitleInner");
  const textEl        = el.querySelector("#priTitleText");

  /* ============ ЧАСТЬ 1: Тёмная камера ============ */

  after(2000, () => {
    textEl.textContent = "Меня пытали. Больше месяца. Я поседела. Мне было семнадцать.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    // playVoice("assets/audio/47.mp3", 1.0);
  });

  after(12000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
    inner.classList.remove("is-visible");
  });

  /* ============ ЧАСТЬ 2: Следователь, рот закрыт ============ */

  after(13500, () => {
    cell.classList.remove("is-active");
    officerClosed.classList.add("is-active");
  });

  /* ============ Кнопка «ОТВЕЧАТЬ СЛЕДОВАТЕЛЮ» ============ */

  after(15500, () => {
    btn.classList.add("is-visible");
  });

  /* ============ КЛИК: диалог ============ */

  btn.addEventListener("click", () => {
    btn.classList.remove("is-visible");
    btn.classList.add("is-gone");

    /* ---------- — Ты скажешь имена. (следователь) ---------- */

    after(500, () => {
      officerClosed.classList.remove("is-active");
      officerTalk.classList.add("is-active");

      textEl.classList.remove("is-fading");
      textEl.textContent = "— Ты скажешь имена.";
      inner.classList.add("is-visible");
      textEl.classList.add("is-visible");
      // playVoice("assets/audio/48.mp3", 1.0);
    });

    /* ---------- — Нет. (Зина, рот открыт) ---------- */

    after(4500, () => {
      officerTalk.classList.remove("is-active");
      zinaTalk.classList.add("is-active");

      textEl.textContent = "— Нет.";
      // playVoice("assets/audio/49.mp3", 1.0);
    });

    /* ---------- — Ты пожалеешь. (следователь) ---------- */

    after(7500, () => {
      zinaTalk.classList.remove("is-active");
      officerTalk.classList.add("is-active");

      textEl.textContent = "— Ты пожалеешь.";
      // playVoice("assets/audio/50.mp3", 1.0);
    });

    /* ---------- — Я не скажу. (Зина, рот открыт) ---------- */

    after(11000, () => {
      officerTalk.classList.remove("is-active");
      zinaTalk.classList.add("is-active");

      textEl.textContent = "— Я не скажу.";
      // playVoice("assets/audio/51.mp3", 1.0);
    });

    /* ---------- Пауза. Долгая. ---------- */

    after(15000, () => {
      zinaTalk.classList.remove("is-active");
      zina.classList.add("is-active");

      textEl.classList.remove("is-visible");
      textEl.classList.add("is-fading");
      inner.classList.remove("is-visible");
    });

    /* ---------- Монолог «Я не сказала ничего...» ---------- */

    after(18000, () => {
      textEl.classList.remove("is-fading");
      textEl.textContent = "Я не сказала ничего.";
      inner.classList.add("is-visible");
      textEl.classList.add("is-visible");
      // playVoice("assets/audio/52.mp3", 1.0);
    });

    after(23000, () => {
      textEl.textContent = "Не потому что герой.";
    });

    after(27000, () => {
      textEl.textContent = "Потому что имена — это люди.";
    });

    after(32000, () => {
      textEl.textContent = "А людей я не отдам.";
    });

    /* ---------- Финальный кадр: Зина у стены, свет ---------- */

    after(40000, () => {
      textEl.classList.remove("is-visible");
      textEl.classList.add("is-fading");
      inner.classList.remove("is-visible");

      zina.classList.remove("is-active");
      final.classList.add("is-active");
    });

    /* ---------- Пауза 8 секунд — просто кадр, тишина ---------- */

    after(48000, () => {
      el.classList.remove("is-active");
      setTimeout(() => { el.remove(); onDone && onDone(); }, 2000);
    });
  });
}
/* ============================================================
   СЦЕНА 10 — УТРО (финал)
   ============================================================ */
function buildMorning() {
  const el = document.createElement("section");
  el.className = "scene scene--morning";
  el.innerHTML = `
    <div class="morning-layer morning-layer--dawn is-active" id="morDawn"></div>
    <div class="morning-layer morning-layer--walk"           id="morWalk"></div>
    <div class="morning-layer morning-layer--convoy"         id="morConvoy"></div>
    <div class="morning-layer morning-layer--feet"           id="morFeet"></div>
    <div class="morning-layer morning-layer--face"           id="morFace"></div>

    <div class="road-grain"></div>
    <div class="road-vignette"></div>

    <div class="title-bar">
      <div class="title-bar__inner" id="morTitleInner">
        <p class="title-bar__text" id="morTitleText"></p>
        <span class="title-bar__bottom-line"></span>
      </div>
    </div>

    <div class="morning-white" id="morWhite">
      <p class="morning-credits" id="morCredits"></p>
      <p class="morning-whisper" id="morWhisper"></p>
      <button class="morning-btn" id="morBtn">ПОМНИТЬ</button>
    </div>

    <div class="morning-final" id="morFinal">
      <div class="morning-final__inner">
        <p class="morning-final__p" id="morP1"></p>
        <p class="morning-final__p" id="morP2"></p>
        <p class="morning-final__p" id="morP3"></p>
      </div>
    </div>
  `;
  return el;
}

export function playScene10(onDone) {
  const el = buildMorning();
  app.appendChild(el);
  void el.offsetWidth;
  el.classList.add("is-active");

  const dawn    = el.querySelector("#morDawn");
  const walk    = el.querySelector("#morWalk");
  const convoy  = el.querySelector("#morConvoy");
  const feet    = el.querySelector("#morFeet");
  const face    = el.querySelector("#morFace");
  const white   = el.querySelector("#morWhite");
  const credits = el.querySelector("#morCredits");
  const whisper = el.querySelector("#morWhisper");
  const btn     = el.querySelector("#morBtn");
  const finalBox = el.querySelector("#morFinal");
  const p1      = el.querySelector("#morP1");
  const p2      = el.querySelector("#morP2");
  const p3      = el.querySelector("#morP3");
  const inner   = el.querySelector("#morTitleInner");
  const textEl  = el.querySelector("#morTitleText");

  /* ============ ЧАСТЬ 1: Рассвет ============ */

  after(2000, () => {
    textEl.textContent = "Утром 13 января 1944 года меня вывели на расстрел.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    // playVoice("assets/audio/53.mp3", 1.0);
  });

  after(12000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
    inner.classList.remove("is-visible");
  });

  /* ============ ЧАСТЬ 2: Зина идёт ============ */

  after(14000, () => {
    dawn.classList.remove("is-active");
    walk.classList.add("is-active");
  });

  after(15000, () => {
    // Бабушка (в памяти)
    textEl.classList.remove("is-fading");
    textEl.textContent = "— Зина, ты вернёшься?";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    // playVoice("assets/audio/54.mp3", 1.0);
  });

  after(20000, () => {
    textEl.textContent = "— Я вернусь, бабушка. Только не вся.";
    // playVoice("assets/audio/55.mp3", 1.0);
  });

  after(25000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
    inner.classList.remove("is-visible");
  });

  /* ============ ЧАСТЬ 3: Конвой ============ */

  after(26500, () => {
    walk.classList.remove("is-active");
    convoy.classList.add("is-active");
  });

  after(27500, () => {
    textEl.classList.remove("is-fading");
    textEl.textContent = "Я шла босая. По снегу. Слепая. Седая.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    // playVoice("assets/audio/56.mp3", 1.0);
  });

  after(34000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
    inner.classList.remove("is-visible");
  });

  // Пауза + «Но прямая.»
  after(36000, () => {
    textEl.classList.remove("is-fading");
    textEl.textContent = "Но прямая.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    // playVoice("assets/audio/57.mp3", 1.0);
  });

  after(41000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
    inner.classList.remove("is-visible");
  });

  /* ============ ЧАСТЬ 4: Босые ноги ============ */

  after(42500, () => {
    convoy.classList.remove("is-active");
    feet.classList.add("is-active");
  });

  /* ============ ЧАСТЬ 5: Лицо Зины ============ */

  after(47000, () => {
    feet.classList.remove("is-active");
    face.classList.add("is-active");

    textEl.classList.remove("is-fading");
    textEl.textContent = "Я не просила. Я не плакала. Я просто шла.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    // playVoice("assets/audio/58.mp3", 1.0);
  });

  after(56000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
    inner.classList.remove("is-visible");
  });

  /* ============ ЧАСТЬ 6: Белый экран ============ */

  after(58000, () => {
    white.classList.add("is-active");
    // playVoice("assets/audio/59.mp3", 1.0);  // «Я не жалею.»
  });

  after(62000, () => {
    // playVoice("assets/audio/60.mp3", 1.0);  // «Я была счастлива.»
  });

  after(66000, () => {
    // playVoice("assets/audio/61.mp3", 1.0);  // «Потому что успела...»
  });

  /* ============ Печатаем текст по буквам ============ */
  after(70000, () => {
    typeText(
      credits,
      "Зинаида Мартыновна Портнова.\n1926–1944.\nГерой Советского Союза.\nПосмертно.",
      55,
      () => {
        // После печати — шёпот
        after(1500, () => {
          whisper.textContent = "Ей было семнадцать.";
          whisper.classList.add("is-visible");
          // playVoice("assets/audio/62.mp3", 1.0);
        });

        after(6000, () => {
          whisper.textContent = "Ей было семнадцать.\nМне было семнадцать.";
          // playVoice("assets/audio/63.mp3", 1.0);
        });

        // Кнопка «ПОМНИТЬ»
        after(11000, () => {
          btn.classList.add("is-visible");
        });
      }
    );
  });

  /* ============ КЛИК «ПОМНИТЬ» ============ */

  btn.addEventListener("click", () => {
    btn.classList.remove("is-visible");
    btn.classList.add("is-gone");
    white.classList.remove("is-active");

    finalBox.classList.add("is-visible");

    // playVoice("assets/audio/64.mp3", 1.0);

    after(500, () => {
      p1.textContent = "История Зины Портновой — это не только про меня. Это про Галю. Про бабушку. Про тех, кто не вернулся. Про всех детей, у которых война украла детство.";
      p1.classList.add("is-visible");
    });

    after(12000, () => {
      p2.textContent = "Я — Зина. Зинаида Мартыновна Портнова. Герой Советского Союза. Посмертно.";
      p2.classList.add("is-visible");
    });

    after(21000, () => {
      p3.textContent = "Но тогда я просто хотела, чтобы закончилась война.";
      p3.classList.add("is-visible");
    });

    /* ============ Тишина и затухание ============ */

    after(30000, () => {
      finalBox.style.transition = "opacity 4s ease";
      finalBox.style.opacity = "0";
    });

    after(35000, () => {
      el.classList.remove("is-active");
      setTimeout(() => { el.remove(); onDone && onDone(); }, 2000);
    });
  });
}

/* ============================================================
   ПЕЧАТАЮЩИЙ ТЕКСТ
   ============================================================ */
function typeText(node, fullText, speed, onDone) {
  node.textContent = "";
  let i = 0;

  const cursor = document.createElement("span");
  cursor.className = "cursor";
  node.appendChild(cursor);

  const timer = setInterval(() => {
    if (i >= fullText.length) {
      clearInterval(timer);
      cursor.remove();
      onDone && onDone();
      return;
    }
    cursor.insertAdjacentText("beforebegin", fullText[i]);
    i++;
  }, speed);
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