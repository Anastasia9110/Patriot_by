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

  after(26000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
    inner.classList.remove("is-visible");
  });

  /* ---------- КНОПКА: ПОГОВОРИТЬ С БАБУШКОЙ ---------- */

  after(28000, () => {
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