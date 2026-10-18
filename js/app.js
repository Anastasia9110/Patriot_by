import {
  after,
  startAmbient,
  stopAmbient,
  stopAllAmbient,
  playOnce,
} from "./utils.js";

const app = document.getElementById("app");
const pre = document.getElementById("preloader");
const preWord = document.getElementById("preloaderWord");

let soundOn = true;

/* ============================================================
   ГРОМКОСТЬ
   ============================================================ */
const V_ZINA = 0.55;
const V_OTHER = 0.85;
const V_MONO = 0.55;

/* ============================================================
   ПРЕЛОАДЕР (короткий)
   ============================================================ */
export function runPreloader(onDone) {
  after(150, () => preWord.classList.add("is-visible"));
  after(1000, () => {
    preWord.classList.remove("is-visible");
    preWord.classList.add("is-fading");
  });
  after(1600, () => pre.classList.add("is-flashing"));
  after(2300, () => {
    pre.classList.add("is-gone");
    setTimeout(() => {
      pre.remove();
      onDone && onDone();
    }, 700);
  });
}

/* ============================================================
   ГОЛОСА
   ============================================================ */
const activeVoices = new Set();

function playVoiceSmart(baseName, volume = 1.0) {
  if (!soundOn) return null;

  const formats = [".m4a", ".mp3", ".wav"];
  let idx = 0;

  function tryNext() {
    if (idx >= formats.length) {
      console.warn("❌ Не найден ни .m4a, ни .mp3:", baseName);
      return;
    }
    const src = `assets/audio/${baseName}${formats[idx]}`;
    idx++;

    const a = new Audio(src);
    a.volume = volume;

    const cleanUp = () => activeVoices.delete(a);
    a.addEventListener("ended", cleanUp, { once: true });
    a.addEventListener(
      "error",
      () => {
        cleanUp();
        tryNext();
      },
      { once: true },
    );

    activeVoices.add(a);
    a.play().catch(() => {
      cleanUp();
      tryNext();
    });
  }

  tryNext();
  return null;
}

// 👇 ВОТ ТА САМАЯ УМНАЯ ФУНКЦИЯ, КОТОРАЯ ИЩЕТ m4a, А ПОТОМ mp3 👇
function playVoice(src, volume = 1.0) {
  if (!soundOn) return null;

  let cleanSrc = src.replace(/\.mp3$/, "").replace(/\.m4a$/, "");
  const extensions = [".m4a", ".mp3"];
  let extIdx = 0;

  function tryNextExt() {
    if (extIdx >= extensions.length) {
      console.warn("❌ Файл не найден (ни m4a, ни mp3):", cleanSrc);
      return;
    }

    const currentSrc = cleanSrc + extensions[extIdx];
    extIdx++;

    const a = new Audio(currentSrc);
    a.volume = volume;

    const cleanUp = () => activeVoices.delete(a);
    a.addEventListener("ended", cleanUp, { once: true });
    a.addEventListener(
      "error",
      () => {
        cleanUp();
        tryNextExt();
      },
      { once: true },
    );

    activeVoices.add(a);

    a.play().catch(() => {
      cleanUp();
      tryNextExt();
    });
  }

  tryNextExt();
  return null;
}

export function stopAllVoices() {
  activeVoices.forEach((a) => {
    try {
      a.pause();
      a.currentTime = 0;
    } catch (e) {
      /* ignore */
    }
  });
  activeVoices.clear();
}
/* ============================================================
   СЦЕНА 0 — ГАЗЕТА (ЗИНА)
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
    playVoiceSmart("s0_01", V_MONO);
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
    playVoiceSmart("s0_02", V_MONO);
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
   СЦЕНА 1 — ДОРОГА (ЗИНА)
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

  startAmbient("wind", "assets/audio/wind.mp3", 0.35);

  const layer1 = el.querySelector("#roadLayer1");
  const layer2 = el.querySelector("#roadLayer2");
  const inner = el.querySelector("#roadTitleInner");
  const textEl = el.querySelector("#roadTitleText");

  after(2000, () => {
    textEl.textContent =
      "Июнь 1941 года. Ленинградская школьница Зина Портнова приехала на летние каникулы к бабушке в деревню Зуи, под Витебском. С ней — младшая сестра Галя.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoiceSmart("s1_01", V_MONO);
  });

  after(14000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
  });
  after(15000, () => inner.classList.remove("is-visible"));

  after(17000, () => {
    textEl.classList.remove("is-fading");
    textEl.textContent = "Через несколько дней началась война.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoiceSmart("s1_02", V_MONO);
  });

  after(23000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
  });
  after(24000, () => inner.classList.remove("is-visible"));

  after(25000, () => {
    layer1.classList.remove("is-active");
    layer2.classList.add("is-active");
  });

  after(26000, () => {
    textEl.classList.remove("is-fading");
    textEl.textContent = "— Зина, а скоро придём?";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoiceSmart("s1_03", V_OTHER);
  });

  after(29500, () => {
    textEl.textContent = "— Скоро, Галя. Вон уже крыши видно.";
    playVoiceSmart("s1_04", V_MONO);
  });

  after(33000, () => {
    textEl.textContent = "— А бабушка нас ждёт?";
    playVoiceSmart("s1_05", V_OTHER);
  });

  after(36500, () => {
    textEl.textContent = "— Ждёт. Пирожки печёт.";
    playVoiceSmart("s1_06", V_MONO);
  });

  after(42000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
    inner.classList.remove("is-visible");
  });

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
   СЦЕНА 2 — ОБОЛЬ (ЗИНА)
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

  playOnce("dog", "assets/audio/dogbarking.mp3", 0.35);
  startAmbient("village", "assets/audio/village.mp3", 0.2);

  const layer1 = el.querySelector("#obolLayer1");
  const layer2 = el.querySelector("#obolLayer2");
  const layer3 = el.querySelector("#obolLayer3");
  const layer4 = el.querySelector("#obolLayer4");
  const btn = el.querySelector("#obolBtn");
  const inner = el.querySelector("#obolTitleInner");
  const textEl = el.querySelector("#obolTitleText");

  after(2000, () => {
    textEl.textContent =
      "Оболь оккупировали. Немецкие солдаты. Патрули. Собаки. Люди шли с опущенными глазами.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoiceSmart("s2_01", V_MONO); // Добавил звук
  });

  after(12000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
  });
  after(13000, () => inner.classList.remove("is-visible"));

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
    playVoiceSmart("s2_02", V_MONO); // Добавил звук
  });

  after(21000, () => {
    btn.classList.add("is-visible");
  });

  btn.addEventListener("click", () => {
    btn.classList.remove("is-visible");
    btn.classList.add("is-gone");

    layer2.classList.remove("is-active");
    layer3.classList.add("is-active");

    after(1500, () => {
      layer3.classList.remove("is-active");
      layer4.classList.add("is-active");
      textEl.classList.remove("is-fading");
      textEl.textContent = "— Зина, уезжай. Ты молодая. Тебя не тронут.";
      inner.classList.add("is-visible");
      textEl.classList.add("is-visible");
      playVoiceSmart("s2_03", V_OTHER); // Добавил звук бабушки
    });

    after(7500, () => {
      layer4.classList.remove("is-active");
      layer3.classList.add("is-active");
      textEl.textContent = "— А ты? А Галя?";
      playVoiceSmart("s2_04", V_MONO);
    });

    after(10500, () => {
      layer3.classList.remove("is-active");
      layer4.classList.add("is-active");
      textEl.textContent = "— Мы справимся.";
      playVoiceSmart("s2_05", V_OTHER);
    });

    after(13500, () => {
      layer4.classList.remove("is-active");
      layer3.classList.add("is-active");
      textEl.textContent = "— Нет, бабушка. Я останусь.";
      playVoiceSmart("s2_06", V_MONO);
    });

    after(17500, () => {
      textEl.classList.remove("is-visible");
      textEl.classList.add("is-fading");
      inner.classList.remove("is-visible");
    });

    after(19500, () => {
      textEl.classList.remove("is-fading");
      textEl.textContent =
        "В 1942 году в Оболи создали подпольную организацию «Юные мстители». Меня приняли в её комитет. Мне было шестнадцать.";
      inner.classList.add("is-visible");
      textEl.classList.add("is-visible");
      playVoiceSmart("s2_07", V_MONO); // Добавил звук
    });

    after(34000, () => {
      textEl.classList.remove("is-visible");
      textEl.classList.add("is-fading");
      inner.classList.remove("is-visible");
      stopAmbient("village", 800);
      el.classList.remove("is-active");
      setTimeout(() => {
        el.remove();
        onDone && onDone();
      }, 2000);
    });
  });
}

/* ============================================================
   СЦЕНА 3 — ЛИСТОВКИ (ЗИНА)
   ============================================================ */
function buildLeaflet() {
  const el = document.createElement("section");
  el.className = "scene scene--leaflet";
  el.innerHTML = `
    <div class="leaflet-layer leaflet-layer--empty is-active" id="leafletLayer1"></div>
    <div class="leaflet-layer leaflet-layer--hands"           id="leafletLayer2"></div>
    <div class="leaflet-layer leaflet-layer--done"            id="leafletLayer3"></div>
    <video class="leaflet-video" id="leafletVideo" muted playsinline preload="auto">
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
  stopAllAmbient(500);
  const el = buildLeaflet();
  app.appendChild(el);
  void el.offsetWidth;
  el.classList.add("is-active");

  const layer1 = el.querySelector("#leafletLayer1");
  const layer2 = el.querySelector("#leafletLayer2");
  const layer3 = el.querySelector("#leafletLayer3");
  const video = el.querySelector("#leafletVideo");
  const btn = el.querySelector("#leafletBtn");
  const inner = el.querySelector("#leafletTitleInner");
  const textEl = el.querySelector("#leafletTitleText");

  let runAudio = null;
  function killRun() {
    try {
      stopAmbient("run", 0);
    } catch (e) {}
    if (runAudio) {
      try {
        runAudio.pause();
        runAudio.currentTime = 0;
        runAudio.volume = 0;
        runAudio.src = "";
        runAudio.load();
      } catch (e) {}
      runAudio = null;
    }
  }

  after(2000, () => {
    textEl.textContent =
      "Мы расклеивали листовки. Собирали сведения о немцах. Устраивали диверсии.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoiceSmart("s3_01", V_MONO);
  });

  after(12000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
  });
  after(13000, () => inner.classList.remove("is-visible"));

  after(14500, () => {
    layer1.classList.remove("is-active");
    layer2.classList.add("is-active");
  });

  after(16000, () => {
    textEl.classList.remove("is-fading");
    textEl.textContent = "— Зина, быстрее. Клей.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoiceSmart("s3_02", V_OTHER);
  });

  after(20000, () => {
    textEl.textContent = "— Я успею.";
    playVoiceSmart("s3_03", V_MONO);
  });

  after(24000, () => {
    textEl.textContent = "— Услышишь шаги — беги. Не оглядывайся.";
    playVoiceSmart("s3_04", V_OTHER);
  });

  after(29000, () => {
    textEl.textContent = "— А вы?";
    playVoiceSmart("s3_05", V_MONO);
  });

  after(32000, () => {
    textEl.textContent = "— Мы тоже. Только позже.";
    playVoiceSmart("s3_06", V_OTHER);
  });

  after(36000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
    inner.classList.remove("is-visible");
  });

  after(38000, () => {
    btn.classList.add("is-visible");
  });

  btn.addEventListener("click", () => {
    btn.classList.remove("is-visible");
    btn.classList.add("is-gone");
    video.classList.add("is-active");
    video.play().catch((e) => console.warn("Видео не пошло:", e));

    video.addEventListener(
      "ended",
      () => {
        video.classList.remove("is-active");
        video.pause();
        stopAmbient("paper", 300);
        layer2.classList.remove("is-active");
        layer3.classList.add("is-active");
        startAmbient("night3", "assets/audio/night3.mp3", 0.55);
        runAudio = playOnce("run", "assets/audio/run.mp3", 0.7);
        after(3500, killRun);

        after(500, () => {
          textEl.classList.remove("is-fading");
          textEl.textContent =
            "Мои руки дрожали. Но листовка держалась. Значит, и я держалась.";
          inner.classList.add("is-visible");
          textEl.classList.add("is-visible");
          playVoiceSmart("s3_07", V_MONO);
        });

        after(11000, () => {
          textEl.classList.remove("is-visible");
          textEl.classList.add("is-fading");
          inner.classList.remove("is-visible");
        });

        after(13000, () => {
          stopAmbient("night3", 800);
          killRun();
          el.classList.remove("is-active");
          setTimeout(() => {
            el.remove();
            onDone && onDone();
          }, 2000);
        });
      },
      { once: true },
    );
  });
}

/* ============================================================
   СЦЕНА 4 — СТОЛОВАЯ (ЗИНА)
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
    <video class="canteen-video" id="canteenVideo" muted playsinline preload="auto">
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

  const work = el.querySelector("#canteenWork");
  const officerClosed = el.querySelector("#canteenOfficerClosed");
  const officerTalk = el.querySelector("#canteenOfficerTalk");
  const pour = el.querySelector("#canteenPour");
  const carry = el.querySelector("#canteenCarry");
  const eat = el.querySelector("#canteenEat");
  const video = el.querySelector("#canteenVideo");
  const btn = el.querySelector("#canteenBtn");
  const inner = el.querySelector("#canteenTitleInner");
  const textEl = el.querySelector("#canteenTitleText");

  after(2000, () => {
    textEl.textContent =
      "По заданию подполья я устроилась работать в столовую курсов переподготовки немецких офицеров. Я носила воду. Дрова. Смотрела. Запоминала.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoiceSmart("s4_01", V_MONO); // Добавил звук
  });

  after(16000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
    inner.classList.remove("is-visible");
  });

  after(17500, () => {
    work.classList.remove("is-active");
    officerClosed.classList.add("is-active");
  });

  after(19500, () => {
    btn.textContent = "РАЗГОВОР С ОФИЦЕРОМ";
    btn.classList.remove("is-gone");
    btn.classList.add("is-visible");
  });

  const onOfficerClick = () => {
    btn.removeEventListener("click", onOfficerClick);
    btn.classList.remove("is-visible");
    btn.classList.add("is-gone");
    officerClosed.classList.remove("is-active");
    officerTalk.classList.add("is-active");

    after(500, () => {
      textEl.classList.remove("is-fading");
      textEl.textContent = "— Wasser! Schnell!";
      inner.classList.add("is-visible");
      textEl.classList.add("is-visible");
      playVoiceSmart("s4_02", V_OTHER); // Добавил звук немца
    });

    after(4500, () => {
      officerTalk.classList.remove("is-active");
      officerClosed.classList.add("is-active");
      textEl.textContent = "— Ja.";
      playVoiceSmart("s4_03", V_MONO); // Добавил звук
    });

    after(8000, () => {
      textEl.classList.remove("is-visible");
      textEl.classList.add("is-fading");
      inner.classList.remove("is-visible");
    });

    after(10000, () => {
      officerClosed.classList.remove("is-active");
      pour.classList.add("is-active");
    });

    after(11500, () => {
      textEl.classList.remove("is-fading");
      textEl.textContent = "А однажды принесла яд.";
      inner.classList.add("is-visible");
      textEl.classList.add("is-visible");
      playVoiceSmart("s4_04", V_MONO); // Добавил звук
    });

    after(16000, () => {
      textEl.classList.remove("is-visible");
      textEl.classList.add("is-fading");
      inner.classList.remove("is-visible");
    });

    after(18000, () => {
      btn.textContent = "ОТРАВИТЬ СУП";
      btn.classList.remove("is-gone");
      btn.classList.add("is-visible");
    });

    const onPoisonClick = () => {
      btn.removeEventListener("click", onPoisonClick);
      btn.classList.remove("is-visible");
      btn.classList.add("is-gone");
      pour.classList.remove("is-active");
      video.classList.add("is-active");
      video.currentTime = 0;
      video.play().catch((e) => console.warn("Видео не пошло:", e));

      after(1000, () => {
        textEl.classList.remove("is-fading");
        textEl.textContent = "Погибло более ста офицеров.";
        inner.classList.add("is-visible");
        textEl.classList.add("is-visible");
      });

      video.addEventListener(
        "ended",
        () => {
          video.classList.remove("is-active");
          carry.classList.add("is-active");
          textEl.classList.remove("is-visible");
          textEl.classList.add("is-fading");
          inner.classList.remove("is-visible");

          after(1500, () => {
            textEl.classList.remove("is-fading");
            textEl.textContent =
              "Меня заставили попробовать суп. Чтобы доказать, что я не причастна.";
            inner.classList.add("is-visible");
            textEl.classList.add("is-visible");
            playVoiceSmart("s4_05", V_MONO); // Добавил звук
          });

          after(11000, () => {
            textEl.classList.remove("is-visible");
            textEl.classList.add("is-fading");
            inner.classList.remove("is-visible");
          });

          after(13000, () => {
            carry.classList.remove("is-active");
            eat.classList.add("is-active");
          });

          after(14500, () => {
            textEl.classList.remove("is-fading");
            textEl.textContent = "Я ела. И чудом выжила.";
            inner.classList.add("is-visible");
            textEl.classList.add("is-visible");
            playVoiceSmart("s4_06", V_MONO); // Добавил звук
          });

          after(24000, () => {
            textEl.textContent =
              "Я не считала. Я просто хотела, чтобы это закончилось.";
            playVoiceSmart("s4_07", V_MONO); // Добавил звук
          });

          after(33000, () => {
            textEl.classList.remove("is-visible");
            textEl.classList.add("is-fading");
            inner.classList.remove("is-visible");
          });

          after(35000, () => {
            el.classList.remove("is-active");
            setTimeout(() => {
              el.remove();
              onDone && onDone();
            }, 2000);
          });
        },
        { once: true },
      );
    };
    btn.addEventListener("click", onPoisonClick, { once: true });
  };
  btn.addEventListener("click", onOfficerClick, { once: true });
}

/* ============================================================
   СЦЕНА 5 — ЛЕС (ЗИНА)
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

  const camp = el.querySelector("#forestCamp");
  const commanderClosed = el.querySelector("#forestCommanderClosed");
  const commanderTalk = el.querySelector("#forestCommanderTalk");
  const shooting = el.querySelector("#forestShooting");
  const scout = el.querySelector("#forestScout");
  const grown = el.querySelector("#forestGrown");
  const btn = el.querySelector("#forestBtn");
  const inner = el.querySelector("#forestTitleInner");
  const textEl = el.querySelector("#forestTitleText");

  after(2000, () => {
    textEl.textContent =
      "После этого оставаться в Оболи было опасно. Летом 1943 года меня отправили в партизанский отряд имени Ворошилова.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoiceSmart("s5_01", V_MONO); // Добавил звук
  });

  after(13000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
    inner.classList.remove("is-visible");
  });

  after(14500, () => {
    camp.classList.remove("is-active");
    commanderClosed.classList.add("is-active");
  });

  after(16500, () => {
    btn.classList.add("is-visible");
  });

  btn.addEventListener("click", () => {
    btn.classList.remove("is-visible");
    btn.classList.add("is-gone");

    after(500, () => {
      commanderClosed.classList.remove("is-active");
      commanderTalk.classList.add("is-active");
      textEl.classList.remove("is-fading");
      textEl.textContent = "— Портнова, страшно?";
      inner.classList.add("is-visible");
      textEl.classList.add("is-visible");
      playVoiceSmart("s5_02", V_OTHER); // Твой файл
    });

    after(4500, () => {
      commanderTalk.classList.remove("is-active");
      commanderClosed.classList.add("is-active");
      textEl.textContent = "— Страшно.";
      playVoiceSmart("s5_03", V_MONO); // Добавил звук
    });

    after(7500, () => {
      commanderClosed.classList.remove("is-active");
      commanderTalk.classList.add("is-active");
      textEl.textContent = "— А почему не уходишь?";
      playVoiceSmart("s5_04", V_OTHER); // Твой файл
    });

    after(11500, () => {
      commanderTalk.classList.remove("is-active");
      commanderClosed.classList.add("is-active");
      textEl.textContent = "— Если все уйдут, кто останется?";
      playVoiceSmart("s5_05", V_MONO); // Добавил звук
    });

    after(16000, () => {
      commanderClosed.classList.remove("is-active");
      commanderTalk.classList.add("is-active");
      textEl.textContent = "— Ты ребёнок.";
      playVoiceSmart("s5_06", V_OTHER); // Добавил звук
    });

    after(19500, () => {
      commanderTalk.classList.remove("is-active");
      commanderClosed.classList.add("is-active");
      textEl.textContent = "— Уже нет.";
      playVoiceSmart("s5_07", V_MONO); // Добавил звук
    });

    after(24000, () => {
      textEl.classList.remove("is-visible");
      textEl.classList.add("is-fading");
      inner.classList.remove("is-visible");
    });

    after(26000, () => {
      textEl.classList.remove("is-fading");
      textEl.textContent =
        "В лесу я впервые почувствовала, что я не одна. Что нас много. И что я могу быть нужной.";
      inner.classList.add("is-visible");
      textEl.classList.add("is-visible");
      playVoiceSmart("s5_08", V_MONO); // Добавил звук
    });

    after(38000, () => {
      textEl.classList.remove("is-visible");
      textEl.classList.add("is-fading");
      inner.classList.remove("is-visible");
    });

    after(40000, () => {
      commanderClosed.classList.remove("is-active");
      shooting.classList.add("is-active");
      textEl.classList.remove("is-fading");
      textEl.textContent =
        "С августа 1943 года я — разведчица. Я научилась стрелять.";
      inner.classList.add("is-visible");
      textEl.classList.add("is-visible");
      playVoiceSmart("s5_09", V_MONO); // Добавил звук
    });

    after(52000, () => {
      textEl.classList.remove("is-visible");
      textEl.classList.add("is-fading");
      inner.classList.remove("is-visible");
    });

    after(54000, () => {
      shooting.classList.remove("is-active");
      scout.classList.add("is-active");
      textEl.classList.remove("is-fading");
      textEl.textContent = "Я ходила на задания.";
      inner.classList.add("is-visible");
      textEl.classList.add("is-visible");
      playVoiceSmart("s5_10", V_MONO); // Добавил звук
    });

    after(63000, () => {
      textEl.classList.remove("is-visible");
      textEl.classList.add("is-fading");
      inner.classList.remove("is-visible");
    });

    after(65000, () => {
      scout.classList.remove("is-active");
      grown.classList.add("is-active");
      textEl.classList.remove("is-fading");
      textEl.textContent = "Я выросла.";
      inner.classList.add("is-visible");
      textEl.classList.add("is-visible");
      playVoiceSmart("s5_11", V_MONO); // Добавил звук
    });

    after(72000, () => {
      textEl.classList.remove("is-visible");
      textEl.classList.add("is-fading");
      inner.classList.remove("is-visible");
    });

    after(75000, () => {
      stopAmbient("snowstorm", 800);
      el.classList.remove("is-active");
      setTimeout(() => {
        el.remove();
        onDone && onDone();
      }, 2000);
    });
  });
}

/* ============================================================
   СЦЕНА 6 — ЗАДАНИЕ (ЗИНА)
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

  const empty = el.querySelector("#mestEmpty");
  const walk = el.querySelector("#mestWalk");
  const annaClosed = el.querySelector("#mestAnnaClosed");
  const annaTalk = el.querySelector("#mestAnnaTalk");
  const police = el.querySelector("#mestPolice");
  const arrest = el.querySelector("#mestArrest");
  const btn = el.querySelector("#mestBtn");
  const inner = el.querySelector("#mestTitleInner");
  const textEl = el.querySelector("#mestTitleText");

  after(2000, () => {
    textEl.textContent =
      "Декабрь 1943 года. «Юные мстители» были раскрыты. Многие арестованы. Я вызвалась установить связь с оставшимися.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoiceSmart("s6_01", V_MONO); // Добавил звук
  });

  after(14000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
    inner.classList.remove("is-visible");
  });

  after(15500, () => {
    empty.classList.remove("is-active");
    walk.classList.add("is-active");
  });

  after(16500, () => {
    textEl.classList.remove("is-fading");
    textEl.textContent =
      "Я возвращалась с задания. Деревня Мостище. Снег. Тишина. Слишком тихо.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoiceSmart("s6_02", V_MONO); // Добавил звук
  });

  after(26000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
    inner.classList.remove("is-visible");
  });

  after(27500, () => {
    walk.classList.remove("is-active");
    annaClosed.classList.add("is-active");
  });

  after(29500, () => {
    btn.classList.add("is-visible");
  });

  btn.addEventListener("click", () => {
    btn.classList.remove("is-visible");
    btn.classList.add("is-gone");

    after(500, () => {
      annaClosed.classList.remove("is-active");
      annaTalk.classList.add("is-active");
      textEl.classList.remove("is-fading");
      textEl.textContent = "— Вот она! Зина! Это она!";
      inner.classList.add("is-visible");
      textEl.classList.add("is-visible");
      playVoiceSmart("s6_03", V_OTHER); // Добавил звук
    });

    after(5500, () => {
      annaTalk.classList.remove("is-active");
      annaClosed.classList.add("is-active");
    });

    after(7000, () => {
      textEl.textContent =
        "Её звали Анна Храповицкая. Местная. Она узнала меня. И выдала.";
      playVoiceSmart("s6_04", V_MONO); // Добавил звук
    });

    after(14000, () => {
      textEl.classList.remove("is-visible");
      textEl.classList.add("is-fading");
      inner.classList.remove("is-visible");
    });

    after(16000, () => {
      annaClosed.classList.remove("is-active");
      police.classList.add("is-active");
    });

    after(21000, () => {
      police.classList.remove("is-active");
      arrest.classList.add("is-active");
      textEl.classList.remove("is-fading");
      textEl.textContent = "Меня схватили.";
      inner.classList.add("is-visible");
      textEl.classList.add("is-visible");
      playVoiceSmart("s6_05", V_MONO); // Добавил звук
    });

    after(28000, () => {
      textEl.classList.remove("is-visible");
      textEl.classList.add("is-fading");
      inner.classList.remove("is-visible");
    });

    after(31000, () => {
      el.classList.remove("is-active");
      setTimeout(() => {
        el.remove();
        onDone && onDone();
      }, 2000);
    });
  });
}

/* ============================================================
   СЦЕНА 7 — ДОПРОС (ЗИНА)
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

  const empty = el.querySelector("#intEmpty");
  const officerClosed = el.querySelector("#intOfficerClosed");
  const officerTalk = el.querySelector("#intOfficerTalk");
  const zinaTable = el.querySelector("#intZinaTable");
  const zinaTalk = el.querySelector("#intZinaTalk");
  const handGun = el.querySelector("#intHandGun");
  const run = el.querySelector("#intRun");
  const flash = el.querySelector("#intFlash");
  const btn = el.querySelector("#intBtn");
  const inner = el.querySelector("#intTitleInner");
  const textEl = el.querySelector("#intTitleText");

  after(2000, () => {
    textEl.textContent = "Меня допрашивали. Долго. Я молчала.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoiceSmart("s7_01", V_MONO);
  });

  after(9000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
    inner.classList.remove("is-visible");
  });

  after(10500, () => {
    empty.classList.remove("is-active");
    officerClosed.classList.add("is-active");
  });

  after(12500, () => {
    btn.textContent = "ОТВЕТИТЬ СЛЕДОВАТЕЛЮ";
    btn.classList.remove("is-gone");
    btn.classList.add("is-visible");
  });

  const onAnswerClick = () => {
    btn.removeEventListener("click", onAnswerClick);
    btn.classList.remove("is-visible");
    btn.classList.add("is-gone");
    officerClosed.classList.remove("is-active");
    officerTalk.classList.add("is-active");

    after(500, () => {
      textEl.classList.remove("is-fading");
      textEl.textContent = "— Кто ещё? Где отряд? Говори!";
      inner.classList.add("is-visible");
      textEl.classList.add("is-visible");
      playVoiceSmart("s7_02", V_OTHER);
    });

    after(5500, () => {
      officerTalk.classList.remove("is-active");
      zinaTable.classList.add("is-active");
      textEl.textContent = "— …";
    });

    after(9000, () => {
      zinaTable.classList.remove("is-active");
      officerTalk.classList.add("is-active");
      textEl.textContent = "— Ты пожалеешь.";
      playVoiceSmart("s7_02b", V_OTHER);
    });

    after(13000, () => {
      officerTalk.classList.remove("is-active");
      zinaTalk.classList.add("is-active");
      textEl.textContent = "— Я уже жалею. Что не успела больше.";
      playVoiceSmart("s7_03", V_MONO);
    });

    after(17500, () => {
      zinaTalk.classList.remove("is-active");
      zinaTable.classList.add("is-active");
    });

    after(19000, () => {
      textEl.classList.remove("is-visible");
      textEl.classList.add("is-fading");
      inner.classList.remove("is-visible");
    });

    after(21000, () => {
      zinaTable.classList.remove("is-active");
      zinaTalk.classList.remove("is-active");
      handGun.classList.add("is-active");
      textEl.classList.remove("is-fading");
      textEl.textContent = "Только не дрожи. Только не дрожи.";
      inner.classList.add("is-visible");
      textEl.classList.add("is-visible");
      playVoiceSmart("s7_04", V_MONO);
    });

    after(27000, () => {
      textEl.classList.remove("is-visible");
      textEl.classList.add("is-fading");
      inner.classList.remove("is-visible");
    });

    after(29000, () => {
      btn.textContent = "ВЫХВАТИТЬ ПИСТОЛЕТ";
      btn.classList.remove("is-gone");
      btn.classList.add("is-visible");
    });

    const onShootClick = () => {
      btn.removeEventListener("click", onShootClick);
      btn.classList.remove("is-visible");
      btn.classList.add("is-gone");
      flash.classList.add("is-active");
      setTimeout(() => {
        flash.classList.remove("is-active");
      }, 400);

      after(600, () => {
        handGun.classList.remove("is-active");
        run.classList.add("is-active");
        textEl.classList.remove("is-fading");
        textEl.textContent = "Я выстрелила. И побежала.";
        inner.classList.add("is-visible");
        textEl.classList.add("is-visible");
        playVoiceSmart("s7_05", V_MONO);
      });

      after(9000, () => {
        textEl.classList.remove("is-visible");
        textEl.classList.add("is-fading");
        inner.classList.remove("is-visible");
      });

      after(12000, () => {
        el.classList.remove("is-active");
        setTimeout(() => {
          el.remove();
          onDone && onDone();
        }, 2000);
      });
    };
    btn.addEventListener("click", onShootClick, { once: true });
  };
  btn.addEventListener("click", onAnswerClick, { once: true });
}

/* ============================================================
   СЦЕНА 8 — РЕКА (ЗИНА)
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

  startAmbient("big-river", "assets/audio/big-river.mp3", 0.25);

  const run = el.querySelector("#rivRun");
  const bank = el.querySelector("#rivBank");
  const zina = el.querySelector("#rivZina");
  const pursuers = el.querySelector("#rivPursuers");
  const swim = el.querySelector("#rivSwim");
  const grab = el.querySelector("#rivGrab");
  const caught = el.querySelector("#rivCaught");
  const btn = el.querySelector("#riverBtn");
  const inner = el.querySelector("#riverTitleInner");
  const textEl = el.querySelector("#riverTitleText");

  after(2000, () => {
    textEl.textContent = "Я бежала. Не помню сколько. Ноги несли сами.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoiceSmart("s8_01", V_MONO); // Добавил звук
  });

  after(10000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
    inner.classList.remove("is-visible");
  });

  after(11500, () => {
    run.classList.remove("is-active");
    bank.classList.add("is-active");
  });

  after(12500, () => {
    textEl.classList.remove("is-fading");
    textEl.textContent = "Река. За ней — лес. Если переплыву — уйду.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoiceSmart("s8_02", V_MONO); // Добавил звук
  });

  after(22000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
    inner.classList.remove("is-visible");
  });

  after(23500, () => {
    bank.classList.remove("is-active");
    zina.classList.add("is-active");
  });

  after(25500, () => {
    btn.classList.add("is-visible");
  });

  btn.addEventListener("click", () => {
    btn.classList.remove("is-visible");
    btn.classList.add("is-gone");

    after(500, () => {
      zina.classList.remove("is-active");
      pursuers.classList.add("is-active");
      textEl.classList.remove("is-fading");
      textEl.textContent = "Они уже были рядом.";
      inner.classList.add("is-visible");
      textEl.classList.add("is-visible");
      playVoiceSmart("s8_03", V_MONO); // Добавил звук
    });

    after(5000, () => {
      textEl.classList.remove("is-visible");
      textEl.classList.add("is-fading");
      inner.classList.remove("is-visible");
    });

    after(6500, () => {
      pursuers.classList.remove("is-active");
      swim.classList.add("is-active");
      textEl.classList.remove("is-fading");
      textEl.textContent = "Вода обжигала.";
      inner.classList.add("is-visible");
      textEl.classList.add("is-visible");
      playVoiceSmart("s8_04", V_MONO); // Добавил звук
    });

    after(13000, () => {
      textEl.classList.remove("is-visible");
      textEl.classList.add("is-fading");
      inner.classList.remove("is-visible");
    });

    after(14500, () => {
      swim.classList.remove("is-active");
      grab.classList.add("is-active");
    });

    after(19000, () => {
      grab.classList.remove("is-active");
      caught.classList.add("is-active");
      textEl.classList.remove("is-fading");
      textEl.textContent =
        "Они вытащили меня. Я не сопротивлялась. Сил не было.";
      inner.classList.add("is-visible");
      textEl.classList.add("is-visible");
      playVoiceSmart("s8_05", V_MONO); // Добавил звук
    });

    after(29000, () => {
      stopAmbient("big-river", 600);
      textEl.classList.remove("is-visible");
      textEl.classList.add("is-fading");
      inner.classList.remove("is-visible");
    });

    after(32000, () => {
      el.classList.remove("is-active");
      setTimeout(() => {
        el.remove();
        onDone && onDone();
      }, 2000);
    });
  });
}

/* ============================================================
   СЦЕНА 9 — ТЮРЬМА (ЗИНА)
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

  const cell = el.querySelector("#priCell");
  const officerClosed = el.querySelector("#priOfficerClosed");
  const officerTalk = el.querySelector("#priOfficerTalk");
  const zina = el.querySelector("#priZina");
  const zinaTalk = el.querySelector("#priZinaTalk");
  const final = el.querySelector("#priFinal");
  const btn = el.querySelector("#priBtn");
  const inner = el.querySelector("#priTitleInner");
  const textEl = el.querySelector("#priTitleText");

  startAmbient(
    "99_cavern_of_lost_souls",
    "assets/audio/99_cavern_of_lost_souls.mp3",
    0.2,
  );

  after(2000, () => {
    textEl.textContent =
      "Меня пытали. Больше месяца. Я поседела. Мне было семнадцать.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoiceSmart("s9_01", V_MONO); // Добавил звук
  });

  after(12000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
    inner.classList.remove("is-visible");
  });

  after(13500, () => {
    cell.classList.remove("is-active");
    officerClosed.classList.add("is-active");
  });

  after(15500, () => {
    btn.classList.add("is-visible");
  });

  btn.addEventListener("click", () => {
    btn.classList.remove("is-visible");
    btn.classList.add("is-gone");

    after(500, () => {
      officerClosed.classList.remove("is-active");
      officerTalk.classList.add("is-active");
      textEl.classList.remove("is-fading");
      textEl.textContent = "— Ты скажешь имена.";
      inner.classList.add("is-visible");
      textEl.classList.add("is-visible");
      playVoiceSmart("s9_01d", V_OTHER); // Твой файл
    });

    after(4500, () => {
      officerTalk.classList.remove("is-active");
      zinaTalk.classList.add("is-active");
      textEl.textContent = "— Нет.";
      playVoiceSmart("s9_02", V_MONO); // Добавил звук
    });

    after(7500, () => {
      zinaTalk.classList.remove("is-active");
      officerTalk.classList.add("is-active");
      textEl.textContent = "— Ты пожалеешь.";
      playVoiceSmart("s7_02b", V_OTHER); // Твой файл
    });

    after(11000, () => {
      officerTalk.classList.remove("is-active");
      zinaTalk.classList.add("is-active");
      textEl.textContent = "— Я не скажу.";
      playVoiceSmart("s9_04", V_MONO); // Добавил звук
    });

    after(15000, () => {
      zinaTalk.classList.remove("is-active");
      zina.classList.add("is-active");
      textEl.classList.remove("is-visible");
      textEl.classList.add("is-fading");
      inner.classList.remove("is-visible");
    });

    after(18000, () => {
      textEl.classList.remove("is-fading");
      textEl.textContent = "Я не сказала ничего.";
      inner.classList.add("is-visible");
      textEl.classList.add("is-visible");
      playVoiceSmart("s9_05", V_MONO); // Добавил звук
    });

    after(23000, () => {
      textEl.textContent = "Не потому что герой.";
      playVoiceSmart("s9_07", V_MONO);
    });

    after(27000, () => {
      textEl.textContent = "Потому что имена — это люди.";
      playVoiceSmart("s9_08", V_MONO);
    });

    after(32000, () => {
      textEl.textContent = "А людей я не отдам.";
      playVoiceSmart("s9_09", V_MONO);
    });

    after(40000, () => {
      textEl.classList.remove("is-visible");
      textEl.classList.add("is-fading");
      inner.classList.remove("is-visible");
      zina.classList.remove("is-active");
      final.classList.add("is-active");
    });

    after(48000, () => {
      stopAmbient("99_cavern_of_lost_souls", 800);
      el.classList.remove("is-active");
      setTimeout(() => {
        el.remove();
        onDone && onDone();
      }, 2000);
    });
  });
}

/* ============================================================
   СЦЕНА 10 — УТРО (ЗИНА, ФИНАЛ)
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

  const dawn = el.querySelector("#morDawn");
  const walk = el.querySelector("#morWalk");
  const convoy = el.querySelector("#morConvoy");
  const feet = el.querySelector("#morFeet");
  const face = el.querySelector("#morFace");
  const white = el.querySelector("#morWhite");
  const credits = el.querySelector("#morCredits");
  const whisper = el.querySelector("#morWhisper");
  const btn = el.querySelector("#morBtn");
  const finalBox = el.querySelector("#morFinal");
  const p1 = el.querySelector("#morP1");
  const p2 = el.querySelector("#morP2");
  const p3 = el.querySelector("#morP3");
  const inner = el.querySelector("#morTitleInner");
  const textEl = el.querySelector("#morTitleText");

  after(2000, () => {
    textEl.textContent = "Утром 13 января 1944 года меня вывели на расстрел.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoiceSmart("s10_01", V_MONO); // Добавил звук
  });

  after(12000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
    inner.classList.remove("is-visible");
  });

  after(14000, () => {
    dawn.classList.remove("is-active");
    walk.classList.add("is-active");
  });

  after(15000, () => {
    textEl.classList.remove("is-fading");
    textEl.textContent = "— Зина, ты вернёшься?";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoiceSmart("s10_02", V_OTHER); // Добавил звук
  });

  after(20000, () => {
    textEl.textContent = "— Я вернусь, бабушка. Только не вся.";
    playVoiceSmart("s10_03", V_MONO); // Добавил звук
  });

  after(25000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
    inner.classList.remove("is-visible");
  });

  after(26500, () => {
    walk.classList.remove("is-active");
    convoy.classList.add("is-active");
  });

  after(27500, () => {
    textEl.classList.remove("is-fading");
    textEl.textContent = "Я шла босая. По снегу. Слепая. Седая.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoiceSmart("s10_04", V_MONO); // Добавил звук
  });

  after(34000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
    inner.classList.remove("is-visible");
  });

  after(36000, () => {
    textEl.classList.remove("is-fading");
    textEl.textContent = "Не сломленная.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoiceSmart("s10_05", V_MONO); // Добавил звук
  });

  after(41000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
    inner.classList.remove("is-visible");
  });

  after(42500, () => {
    convoy.classList.remove("is-active");
    feet.classList.add("is-active");
  });

  after(47000, () => {
    feet.classList.remove("is-active");
    face.classList.add("is-active");
    textEl.classList.remove("is-fading");
    textEl.textContent = "Я не просила. Я не плакала. Я просто шла.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoiceSmart("s10_06", V_MONO); // Добавил звук
  });

  after(52000, () => {
    stopAmbient("uzi_45_distant_burst_01", 0);
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
    inner.classList.remove("is-visible");
  });

  after(58000, () => {
    white.classList.add("is-active");
  });

  after(70000, () => {
    typeText(
      credits,
      "Зинаида Мартыновна Портнова.\n1926–1944.\nГерой Советского Союза.\nПосмертно.",
      55,
      () => {
        after(1500, () => {
          whisper.textContent = "Ей было семнадцать.";
          whisper.classList.add("is-visible");
        });
        after(6000, () => {
          whisper.textContent = "Ей было семнадцать.\nМне было семнадцать.";
        });
        after(11000, () => {
          btn.classList.add("is-visible");
        });
      },
    );
  });

  btn.addEventListener("click", () => {
    btn.classList.remove("is-visible");
    btn.classList.add("is-gone");
    white.classList.remove("is-active");
    finalBox.classList.add("is-visible");

    after(500, () => {
      p1.textContent =
        "История Зины Портновой — это не только про меня. Это про Галю. Про бабушку. Про тех, кто не вернулся. Про всех детей, у которых война украла детство.";
      p1.classList.add("is-visible");
      playVoiceSmart("s10_11", V_MONO);
    });

    after(12000, () => {
      p2.textContent =
        "Я — Зина. Зинаида Мартыновна Портнова. Герой Советского Союза. Посмертно.";
      p2.classList.add("is-visible");
      playVoiceSmart("s10_12", V_MONO);
    });

    after(21000, () => {
      p3.textContent = "Но тогда я просто хотела, чтобы закончилась война.";
      p3.classList.add("is-visible");
      playVoiceSmart("s10_13", V_MONO);
    });

    after(30000, () => {
      finalBox.style.transition = "opacity 4s ease";
      finalBox.style.opacity = "0";
    });

    after(35000, () => {
      stopAmbient("snowstorm", 1200);
      el.classList.remove("is-active");
      setTimeout(() => {
        el.remove();
        onDone && onDone();
      }, 2000);
    });
  });
}

/* ============================================================
   ЛИДА — СЦЕНА 0. ЧЁРНЫЙ. ТИШИНА.
   ============================================================ */
function buildLidaIntro() {
  const el = document.createElement("section");
  el.className = "scene scene--lida-intro";
  el.innerHTML = `
    <img class="lida-intro__bag" id="lidaIntroBag"
         src="assets/images/lida/scene00-bag.png" alt="">
    <div class="lida-intro__word" id="lidaIntroWord">
      <span>Л</span><span>И</span><span>Д</span><span>А</span>
    </div>
    <div class="lida-intro__fade" id="lidaIntroFade"></div>
  `;
  return el;
}

export function playLidaScene0(onDone) {
  const el = buildLidaIntro();
  app.appendChild(el);
  void el.offsetWidth;
  el.classList.add("is-active");

  const bag = el.querySelector("#lidaIntroBag");
  const letters = el.querySelectorAll("#lidaIntroWord span");
  const fade = el.querySelector("#lidaIntroFade");

  after(300, () => bag.classList.add("is-visible"));
  after(800, () => playVoice("assets/audio/lida/00_1.mp3", 1.0));

  letters.forEach((letter, i) => {
    after(1200 + i * 350, () => letter.classList.add("is-visible"));
  });

  after(4500, () => playVoice("assets/audio/lida/00_2.mp3", 1.0));
  after(6500, () => playVoice("assets/audio/lida/00_3.mp3", 1.0));

  after(8000, () => {
    bag.classList.remove("is-visible");
    letters.forEach((l) => l.classList.remove("is-visible"));
  });

  after(8500, () => fade.classList.add("is-active"));

  after(10000, () => {
    el.classList.remove("is-active");
    setTimeout(() => {
      el.remove();
      onDone && onDone();
    }, 1500);
  });
}

/* ============================================================
   ЛИДА — СЦЕНА 1. ГОРОД
   ============================================================ */
function buildLidaCity() {
  const el = document.createElement("section");
  el.className = "scene scene--lida-city";
  el.innerHTML = `
    <div class="lida-city__layer lida-city__layer--city is-active" id="lidaCityBg"></div>
    <div class="lida-city__layer lida-city__layer--sky"            id="lidaCitySky"></div>
    <div class="road-grain"></div>
    <div class="road-vignette"></div>
    <div class="title-bar">
      <div class="title-bar__inner" id="lidaCityTitleInner">
        <p class="title-bar__text" id="lidaCityTitleText"></p>
        <span class="title-bar__bottom-line"></span>
      </div>
    </div>
    <div class="lida-city__fade" id="lidaCityFade"></div>
  `;
  return el;
}

export function playLidaScene1(onDone) {
  const el = buildLidaCity();
  app.appendChild(el);
  void el.offsetWidth;
  el.classList.add("is-active");

  const city = el.querySelector("#lidaCityBg");
  const sky = el.querySelector("#lidaCitySky");
  const fade = el.querySelector("#lidaCityFade");
  const inner = el.querySelector("#lidaCityTitleInner");
  const textEl = el.querySelector("#lidaCityTitleText");

  startAmbient("city", "assets/audio/lida/city.mp3", 0.3);

  after(1000, () => {
    textEl.textContent =
      "Гродно. Июнь 1941 года. Здесь жила Лида Вашкевич. Ей было девять.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/lida/city_life.mp3", 1.0);
  });
  after(5000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
  });
  after(6000, () => inner.classList.remove("is-visible"));

  after(6500, () => {
    textEl.classList.remove("is-fading");
    textEl.textContent = "22 июня всё закончилось.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/lida/june_22.mp3", 1.0);
  });
  after(10500, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
  });
  after(11500, () => inner.classList.remove("is-visible"));

  after(12000, () => {
    city.classList.remove("is-active");
    sky.classList.add("is-active");
    startAmbient("planes", "assets/audio/lida/planes.mp3", 0.35);
  });

  after(13500, () => {
    textEl.classList.remove("is-fading");
    textEl.textContent = "— Лида! Пойдём на реку!";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/lida/friend_1.mp3", 1.0);
  });
  after(17500, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
  });
  after(18500, () => inner.classList.remove("is-visible"));

  after(19000, () => {
    textEl.classList.remove("is-fading");
    textEl.textContent = "— Не могу. Мама сказала — дома помочь.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/lida/lida_no.mp3", 1.0);
  });
  after(23000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
  });
  after(24000, () => inner.classList.remove("is-visible"));

  after(24500, () => {
    textEl.classList.remove("is-fading");
    textEl.textContent = "— Завтра пойдём?";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/lida/friend_2.mp3", 1.0);
  });
  after(28500, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
  });
  after(29500, () => inner.classList.remove("is-visible"));

  after(30000, () => {
    textEl.classList.remove("is-fading");
    textEl.textContent = "— Завтра… посмотрим.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/lida/lida_tomorrow.mp3", 1.0);
  });
  after(34000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
  });
  after(35000, () => inner.classList.remove("is-visible"));

  after(36000, () => fade.classList.add("is-active"));

  after(39000, () => {
    stopAmbient("city", 800);
    stopAmbient("planes", 800);
    el.classList.remove("is-active");
    setTimeout(() => {
      el.remove();
      onDone && onDone();
    }, 2000);
  });
}

/* ============================================================
   ЛИДА — СЦЕНА 2. ОТЕЦ
   ============================================================ */
function buildLidaFather() {
  const el = document.createElement("section");
  el.className = "scene scene--lida-father";
  el.innerHTML = `
    <div class="lida-father__layer lida-father__layer--room is-active" id="lidaFatherRoom"></div>
    <div class="lida-father__layer lida-father__layer--listening"      id="lidaFatherListening"></div>
    <div class="lida-father__layer lida-father__layer--closed"         id="lidaFatherClosed"></div>
    <div class="lida-father__layer lida-father__layer--talk"           id="lidaFatherTalk"></div>
    <div class="lida-father__layer lida-father__layer--smile"          id="lidaFatherSmile"></div>
    <button class="lida-father__btn" id="lidaFatherBtn">ПОГОВОРИТЬ С ОТЦОМ</button>
    <div class="road-grain"></div>
    <div class="road-vignette"></div>
    <div class="title-bar">
      <div class="title-bar__inner" id="lidaFatherTitleInner">
        <p class="title-bar__text" id="lidaFatherTitleText"></p>
        <span class="title-bar__bottom-line"></span>
      </div>
    </div>
  `;
  return el;
}

export function playLidaScene2(onDone) {
  const el = buildLidaFather();
  app.appendChild(el);
  void el.offsetWidth;
  el.classList.add("is-active");

  const room = el.querySelector("#lidaFatherRoom");
  const listening = el.querySelector("#lidaFatherListening");
  const closed = el.querySelector("#lidaFatherClosed");
  const talk = el.querySelector("#lidaFatherTalk");
  const smile = el.querySelector("#lidaFatherSmile");
  const btn = el.querySelector("#lidaFatherBtn");
  const inner = el.querySelector("#lidaFatherTitleInner");
  const textEl = el.querySelector("#lidaFatherTitleText");

  startAmbient("night", "assets/audio/lida/night.mp3", 0.25);
  startAmbient("clock", "assets/audio/lida/clock.mp3", 0.15);

  after(1000, () => {
    textEl.textContent = "— Завтра в шесть. У старой мельницы.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/lida/dad_1.mp3", 1.0);
  });
  after(5000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
  });
  after(6000, () => inner.classList.remove("is-visible"));

  after(6500, () => {
    textEl.classList.remove("is-fading");
    textEl.textContent = "— А если провал?";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/lida/voice_2.mp3", 1.0);
  });
  after(10500, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
  });
  after(11500, () => inner.classList.remove("is-visible"));

  after(12000, () => {
    textEl.classList.remove("is-fading");
    textEl.textContent = "— Тогда — рассыпаемся.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/lida/dad_2.mp3", 1.0);
  });
  after(16000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
  });
  after(17000, () => inner.classList.remove("is-visible"));

  after(17500, () => {
    textEl.classList.remove("is-fading");
    textEl.textContent = "— А девочка? Лида?";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/lida/voice_3.mp3", 1.0);
  });
  after(21500, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
  });
  after(22500, () => inner.classList.remove("is-visible"));

  after(23000, () => {
    textEl.classList.remove("is-fading");
    textEl.textContent = "— Лида — не при чём. Она ребёнок.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/lida/dad_3.mp3", 1.0);
  });
  after(27000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
  });
  after(28000, () => inner.classList.remove("is-visible"));

  after(28500, () => {
    room.classList.remove("is-active");
    listening.classList.add("is-active");
    textEl.classList.remove("is-fading");
    textEl.textContent = "— Я не ребёнок.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/lida/lida_2.mp3", 1.0);
  });
  after(32000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
    inner.classList.remove("is-visible");
  });

  after(33500, () => btn.classList.add("is-visible"));

  btn.addEventListener("click", () => {
    btn.classList.remove("is-visible");
    btn.classList.add("is-gone");
    listening.classList.remove("is-active");
    closed.classList.add("is-active");

    after(1500, () => {
      closed.classList.remove("is-active");
      talk.classList.add("is-active");
      textEl.classList.remove("is-fading");
      textEl.textContent = "— Лида? Ты почему не спишь?";
      inner.classList.add("is-visible");
      textEl.classList.add("is-visible");
      playVoice("assets/audio/lida/dad_4.mp3", 1.0);
    });
    after(5500, () => {
      talk.classList.remove("is-active");
      closed.classList.add("is-active");
      textEl.textContent = "— Не хочется.";
      playVoice("assets/audio/lida/lida_3.mp3", 1.0);
    });
    after(8500, () => {
      closed.classList.remove("is-active");
      talk.classList.add("is-active");
      textEl.textContent = "— Что ты слышала?";
      playVoice("assets/audio/lida/dad_5.mp3", 1.0);
    });
    after(12000, () => {
      talk.classList.remove("is-active");
      closed.classList.add("is-active");
      textEl.textContent = "— Всё.";
      playVoice("assets/audio/lida/lida_4.mp3", 1.0);
    });
    after(14500, () => {
      closed.classList.remove("is-active");
      talk.classList.add("is-active");
      textEl.textContent = "— И что ты думаешь?";
      playVoice("assets/audio/lida/dad_6.mp3", 1.0);
    });
    after(18500, () => {
      talk.classList.remove("is-active");
      closed.classList.add("is-active");
      textEl.textContent = "— Я хочу помогать.";
      playVoice("assets/audio/lida/lida_5.mp3", 1.0);
    });
    after(21500, () => {
      closed.classList.remove("is-active");
      talk.classList.add("is-active");
      textEl.textContent = "— Тебе десять лет.";
      playVoice("assets/audio/lida/dad_7.mp3", 1.0);
    });
    after(25000, () => {
      talk.classList.remove("is-active");
      closed.classList.add("is-active");
      textEl.textContent = "— И что? Фашистам всё равно, сколько мне лет.";
      playVoice("assets/audio/lida/lida_6.mp3", 1.0);
    });
    after(29500, () => {
      closed.classList.remove("is-active");
      smile.classList.add("is-active");
      textEl.textContent = "— Ты вся в меня.";
      playVoice("assets/audio/lida/dad_8.mp3", 1.0);
    });
    after(34000, () => {
      textEl.classList.remove("is-visible");
      textEl.classList.add("is-fading");
      inner.classList.remove("is-visible");
    });
    after(36000, () => {
      stopAmbient("night", 800);
      stopAmbient("clock", 800);
      el.classList.remove("is-active");
      setTimeout(() => {
        el.remove();
        onDone && onDone();
      }, 1500);
    });
  });
}

/* ============================================================
   ЛИДА — СЦЕНА 3. СУМКА
   ============================================================ */
function buildLidaBag() {
  const el = document.createElement("section");
  el.className = "scene scene--lida-bag";
  el.innerHTML = `
    <div class="lida-bag__layer lida-bag__layer--shop is-active" id="lidaBagShop"></div>
    <div class="lida-bag__layer lida-bag__layer--yard"           id="lidaBagYard"></div>
    <div class="lida-bag__layer lida-bag__layer--room"           id="lidaBagRoom"></div>
    <div class="lida-bag__layer lida-bag__layer--hands"          id="lidaBagHands"></div>
    <div class="lida-bag__layer lida-bag__layer--mother-closed"  id="lidaBagMotherClosed"></div>
    <div class="lida-bag__layer lida-bag__layer--mother-talk"    id="lidaBagMotherTalk"></div>
    <button class="lida-bag__btn" id="lidaBagBtn">СОБРАТЬ СУМКУ</button>
    <div class="road-grain"></div>
    <div class="road-vignette"></div>
    <div class="title-bar">
      <div class="title-bar__inner" id="lidaBagTitleInner">
        <p class="title-bar__text" id="lidaBagTitleText"></p>
        <span class="title-bar__bottom-line"></span>
      </div>
    </div>
    <div class="lida-bag__fade" id="lidaBagFade"></div>
  `;
  return el;
}

export function playLidaScene3(onDone) {
  const el = buildLidaBag();
  app.appendChild(el);
  void el.offsetWidth;
  el.classList.add("is-active");

  const shop = el.querySelector("#lidaBagShop");
  const yard = el.querySelector("#lidaBagYard");
  const room = el.querySelector("#lidaBagRoom");
  const hands = el.querySelector("#lidaBagHands");
  const motherClosed = el.querySelector("#lidaBagMotherClosed");
  const motherTalk = el.querySelector("#lidaBagMotherTalk");
  const btn = el.querySelector("#lidaBagBtn");
  const fade = el.querySelector("#lidaBagFade");
  const inner = el.querySelector("#lidaBagTitleInner");
  const textEl = el.querySelector("#lidaBagTitleText");

  startAmbient("shop", "assets/audio/lida/shop.mp3", 0.2);

  after(1000, () => {
    textEl.textContent = "— Опять ты, девка. Что тебе?";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/lida/shop_1.mp3", 1.0);
  });
  after(5000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
  });
  after(6000, () => inner.classList.remove("is-visible"));

  after(6500, () => {
    textEl.classList.remove("is-fading");
    textEl.textContent = "— Бумагу. Две штуки.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/lida/lida_7.mp3", 1.0);
  });
  after(10500, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
  });
  after(11500, () => inner.classList.remove("is-visible"));

  after(12000, () => {
    textEl.classList.remove("is-fading");
    textEl.textContent = "— Две? Зачем тебе столько?";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/lida/shop_2.mp3", 1.0);
  });
  after(16000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
  });
  after(17000, () => inner.classList.remove("is-visible"));

  after(17500, () => {
    textEl.classList.remove("is-fading");
    textEl.textContent = "— Рисовать. Учительница задала.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/lida/lida_8.mp3", 1.0);
  });
  after(21500, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
    inner.classList.remove("is-visible");
  });

  after(23000, () => {
    shop.classList.remove("is-active");
    yard.classList.add("is-active");
    stopAmbient("shop", 800);
    startAmbient("yard", "assets/audio/lida/yard.mp3", 0.2);
  });

  after(24000, () => {
    textEl.classList.remove("is-fading");
    textEl.textContent =
      "— Слушайте. Каждому — по два листа. Купить надо в разных местах. Понял, Витя? Ты — на Почтовой. Ты, Таня — на Советской. Никто не должен знать, зачем.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/lida/lida_9.mp3", 1.0);
  });
  after(28000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
  });
  after(29000, () => inner.classList.remove("is-visible"));

  after(29500, () => {
    textEl.classList.remove("is-fading");
    textEl.textContent = "— А зачем, Лида?";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/lida/boy_1.mp3", 1.0);
  });
  after(33500, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
  });
  after(34500, () => inner.classList.remove("is-visible"));

  after(35000, () => {
    textEl.classList.remove("is-fading");
    textEl.textContent =
      "— Потом узнаешь. Главное — сделай. Никому ни слова. Даже маме.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/lida/lida_10.mp3", 1.0);
  });
  after(39000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
  });
  after(40000, () => inner.classList.remove("is-visible"));

  after(40500, () => {
    textEl.classList.remove("is-fading");
    textEl.textContent = "— А если спросят?";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/lida/boy_2.mp3", 1.0);
  });
  after(44500, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
  });
  after(45500, () => inner.classList.remove("is-visible"));

  after(46000, () => {
    textEl.classList.remove("is-fading");
    textEl.textContent = "— Скажешь — в школу. Для тетрадей.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/lida/lida_11.mp3", 1.0);
  });
  after(50000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
    inner.classList.remove("is-visible");
  });

  after(51500, () => {
    yard.classList.remove("is-active");
    room.classList.add("is-active");
    stopAmbient("yard", 800);
    startAmbient("home", "assets/audio/lida/home.mp3", 0.15);
  });

  after(52500, () => {
    room.classList.remove("is-active");
    motherTalk.classList.add("is-active");
    textEl.classList.remove("is-fading");
    textEl.textContent = "— Лида. Что это?";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/lida/mom_1.mp3", 1.0);
  });
  after(56500, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
  });
  after(57500, () => inner.classList.remove("is-visible"));

  after(58000, () => {
    motherTalk.classList.remove("is-active");
    motherClosed.classList.add("is-active");
    textEl.classList.remove("is-fading");
    textEl.textContent = "— Уголь. Для бабушки. Печку топить.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/lida/lida_12.mp3", 1.0);
  });
  after(62000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
  });
  after(63000, () => inner.classList.remove("is-visible"));

  after(63500, () => {
    motherClosed.classList.remove("is-active");
    motherTalk.classList.add("is-active");
    textEl.classList.remove("is-fading");
    textEl.textContent = "— С каких пор ты носишь уголь?";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/lida/mom_2.mp3", 1.0);
  });
  after(67500, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
  });
  after(68500, () => inner.classList.remove("is-visible"));

  after(69000, () => {
    motherTalk.classList.remove("is-active");
    motherClosed.classList.add("is-active");
    textEl.classList.remove("is-fading");
    textEl.textContent = "— С сегодняшнего. Бабушка старая. Ей тяжело.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/lida/lida_13.mp3", 1.0);
  });
  after(73000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
    inner.classList.remove("is-visible");
  });

  after(74500, () => btn.classList.add("is-visible"));

  btn.addEventListener("click", () => {
    btn.classList.remove("is-visible");
    btn.classList.add("is-gone");
    motherClosed.classList.remove("is-active");
    motherTalk.classList.remove("is-active");
    hands.classList.add("is-active");

    after(1500, () => {
      textEl.classList.remove("is-fading");
      textEl.textContent = "— Будь осторожна.";
      inner.classList.add("is-visible");
      textEl.classList.add("is-visible");
      playVoice("assets/audio/lida/mom_3.mp3", 1.0);
    });
    after(5500, () => {
      textEl.textContent = "— Я всегда осторожна.";
      playVoice("assets/audio/lida/lida_14.mp3", 1.0);
    });
    after(10000, () => {
      textEl.classList.remove("is-visible");
      textEl.classList.add("is-fading");
      inner.classList.remove("is-visible");
    });

    after(12000, () => {
      btn.textContent = "ВЫЙТИ ИЗ ДОМА";
      btn.classList.remove("is-gone");
      btn.classList.add("is-visible");
    });

    const onLeaveClick = () => {
      btn.removeEventListener("click", onLeaveClick);
      btn.classList.remove("is-visible");
      btn.classList.add("is-gone");
      fade.classList.add("is-active");

      after(2500, () => {
        stopAmbient("home", 800);
        el.classList.remove("is-active");
        setTimeout(() => {
          el.remove();
          onDone && onDone();
        }, 1500);
      });
    };
    btn.addEventListener("click", onLeaveClick, { once: true });
  });
}

/* ============================================================
   ЛИДА — СЦЕНА 4. МОСТ
   ============================================================ */
function buildLidaBridge() {
  const el = document.createElement("section");
  el.className = "scene scene--lida-bridge";
  el.innerHTML = `
    <div class="lida-bridge__layer lida-bridge__layer--bridge is-active" id="lidaBridgeBg"></div>
    <div class="lida-bridge__layer lida-bridge__layer--police-young"      id="lidaBridgePoliceYoung"></div>
    <div class="lida-bridge__layer lida-bridge__layer--police-young-talk" id="lidaBridgePoliceYoungTalk"></div>
    <div class="lida-bridge__layer lida-bridge__layer--police-old"        id="lidaBridgePoliceOld"></div>
    <div class="lida-bridge__layer lida-bridge__layer--police-old-talk"   id="lidaBridgePoliceOldTalk"></div>
    <div class="lida-bridge__layer lida-bridge__layer--coal"              id="lidaBridgeCoal"></div>
    <div class="lida-bridge__layer lida-bridge__layer--past"              id="lidaBridgePast"></div>
    <div class="lida-bridge__choices" id="lidaBridgeChoices">
      <button class="lida-bridge__btn" id="lidaBridgeShow">ПОКАЗАТЬ СУМКУ</button>
      <button class="lida-bridge__btn" id="lidaBridgeHide">НЕ ПОКАЗЫВАТЬ</button>
    </div>
    <button class="lida-bridge__btn-single" id="lidaBridgeNext">ИДТИ ДАЛЬШЕ</button>
    <div class="road-grain"></div>
    <div class="road-vignette"></div>
    <div class="title-bar">
      <div class="title-bar__inner" id="lidaBridgeTitleInner">
        <p class="title-bar__text" id="lidaBridgeTitleText"></p>
        <span class="title-bar__bottom-line"></span>
      </div>
    </div>
    <div class="lida-bridge__fade" id="lidaBridgeFade"></div>
  `;
  return el;
}

export function playLidaScene4(onDone) {
  const el = buildLidaBridge();
  app.appendChild(el);
  void el.offsetWidth;
  el.classList.add("is-active");

  const bg = el.querySelector("#lidaBridgeBg");
  const policeYoung = el.querySelector("#lidaBridgePoliceYoung");
  const policeYoungTalk = el.querySelector("#lidaBridgePoliceYoungTalk");
  const policeOld = el.querySelector("#lidaBridgePoliceOld");
  const policeOldTalk = el.querySelector("#lidaBridgePoliceOldTalk");
  const coal = el.querySelector("#lidaBridgeCoal");
  const past = el.querySelector("#lidaBridgePast");
  const choices = el.querySelector("#lidaBridgeChoices");
  const btnShow = el.querySelector("#lidaBridgeShow");
  const btnHide = el.querySelector("#lidaBridgeHide");
  const btnNext = el.querySelector("#lidaBridgeNext");
  const fade = el.querySelector("#lidaBridgeFade");
  const inner = el.querySelector("#lidaBridgeTitleInner");
  const textEl = el.querySelector("#lidaBridgeTitleText");

  startAmbient("bridge", "assets/audio/lida/bridge.mp3", 0.25);

  after(1000, () => {
    bg.classList.remove("is-active");
    policeYoungTalk.classList.add("is-active");
    textEl.textContent = "— Стой. Куда идёшь?";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/lida/police_1.mp3", 1.0);
  });
  after(4500, () => {
    policeYoungTalk.classList.remove("is-active");
    policeYoung.classList.add("is-active");
    textEl.textContent = "— В лес. К тётке.";
    playVoice("assets/audio/lida/lida_15.mp3", 1.0);
  });
  after(8000, () => {
    policeYoung.classList.remove("is-active");
    policeYoungTalk.classList.add("is-active");
    textEl.textContent = "— Что в сумке?";
    playVoice("assets/audio/lida/police_2.mp3", 1.0);
  });
  after(11500, () => {
    policeYoungTalk.classList.remove("is-active");
    policeYoung.classList.add("is-active");
    textEl.textContent = "— Уголь.";
    playVoice("assets/audio/lida/lida_16.mp3", 1.0);
  });
  after(14500, () => {
    policeYoung.classList.remove("is-active");
    policeYoungTalk.classList.add("is-active");
    textEl.textContent = "— Покажи.";
    playVoice("assets/audio/lida/police_3.mp3", 1.0);
  });
  after(18000, () => {
    policeYoungTalk.classList.remove("is-active");
    policeOldTalk.classList.add("is-active");
    textEl.textContent = "— Оставь. Малолетка.";
    playVoice("assets/audio/lida/police_old_1.mp3", 1.0);
  });
  after(21500, () => {
    policeOldTalk.classList.remove("is-active");
    policeOld.classList.add("is-active");
    policeYoungTalk.classList.add("is-active");
    textEl.textContent = "— А если там не уголь?";
    playVoice("assets/audio/lida/police_4.mp3", 1.0);
  });
  after(25000, () => {
    policeYoungTalk.classList.remove("is-active");
    policeOldTalk.classList.add("is-active");
    textEl.textContent = "— А если там уголь? Что тогда?";
    playVoice("assets/audio/lida/police_оld.mp3", 1.0);
  });
  after(28000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
    inner.classList.remove("is-visible");
  });
  after(29000, () => choices.classList.add("is-visible"));

  // ВАРИАНТ 1
  btnShow.addEventListener(
    "click",
    () => {
      choices.classList.remove("is-visible");
      policeOldTalk.classList.remove("is-active");
      coal.classList.add("is-active");

      after(1500, () => {
        textEl.classList.remove("is-fading");
        textEl.textContent =
          "— Хотите — берите. Но мамка будет ругаться. Печку нечем топить";
        inner.classList.add("is-visible");
        textEl.classList.add("is-visible");
        playVoice("assets/audio/lida/lida_17.mp3", 1.0);
      });
      after(5000, () => {
        coal.classList.remove("is-active");
        policeOldTalk.classList.add("is-active");
        textEl.textContent = "— Иди.";
        playVoice("assets/audio/lida/police_old_2.mp3", 1.0);
      });
      after(7500, () => {
        textEl.classList.remove("is-visible");
        textEl.classList.add("is-fading");
        inner.classList.remove("is-visible");
      });
      after(9000, () => btnNext.classList.add("is-visible"));
    },
    { once: true },
  );

  // ВАРИАНТ 2
  btnHide.addEventListener(
    "click",
    () => {
      choices.classList.remove("is-visible");
      policeOldTalk.classList.remove("is-active");
      policeYoungTalk.classList.add("is-active");

      textEl.classList.remove("is-fading");
      textEl.textContent = "— Не имеете права. Я ребёнок.";
      inner.classList.add("is-visible");
      textEl.classList.add("is-visible");
      playVoice("assets/audio/lida/lida_18.mp3", 1.0);

      after(4000, () => {
        policeYoungTalk.classList.remove("is-active");
        policeOldTalk.classList.add("is-active");
        textEl.textContent = "— Иди, пока цела.";
        playVoice("assets/audio/lida/police_old_3.mp3", 1.0);
      });
      after(7000, () => {
        textEl.classList.remove("is-visible");
        textEl.classList.add("is-fading");
        inner.classList.remove("is-visible");
      });
      after(9000, () => btnNext.classList.add("is-visible"));
    },
    { once: true },
  );

  // ДАЛЬШЕ
  btnNext.addEventListener(
    "click",
    () => {
      btnNext.classList.remove("is-visible");
      btnNext.classList.add("is-gone");
      policeOld.classList.remove("is-active");
      policeOldTalk.classList.remove("is-active");
      policeYoung.classList.remove("is-active");
      policeYoungTalk.classList.remove("is-active");
      past.classList.add("is-active");

      after(1000, () => {
        textEl.classList.remove("is-fading");
        textEl.textContent = "— Эй, девка!";
        inner.classList.add("is-visible");
        textEl.classList.add("is-visible");
        playVoice("assets/audio/lida/police_6.mp3", 1.0);
      });
      after(4000, () => {
        textEl.textContent = "— Ты это… осторожнее. Поняла?";
        playVoice("assets/audio/lida/police_7.mp3", 1.0);
      });
      after(7000, () => {
        textEl.classList.remove("is-visible");
        textEl.classList.add("is-fading");
        inner.classList.remove("is-visible");
      });

      after(8500, () => {
        textEl.classList.remove("is-fading");
        textEl.textContent = "Взрывчатку она донесла.";
        inner.classList.add("is-visible");
        textEl.classList.add("is-visible");
        playVoice("assets/audio/lida/she.mp3", 1.0);
      });

      after(11000, () => fade.classList.add("is-active"));
      after(13000, () => {
        stopAmbient("bridge", 500);
        el.classList.remove("is-active");
        setTimeout(() => {
          el.remove();
          onDone && onDone();
        }, 800);
      });
    },
    { once: true },
  );
}

/* ============================================================
   ЛИДА — СЦЕНА 5. ВЗРЫВ
   ============================================================ */
function buildLidaExplosion() {
  const el = document.createElement("section");
  el.className = "scene scene--lida-explosion";
  el.innerHTML = `
    <div class="lida-explosion__layer lida-explosion__layer--bag is-active" id="lidaExpBag"></div>
    <div class="lida-explosion__layer lida-explosion__layer--boom"          id="lidaExpBoom"></div>
    <div class="lida-explosion__layer lida-explosion__layer--father"        id="lidaExpFather"></div>
    <div class="lida-explosion__layer lida-explosion__layer--father-t"      id="lidaExpFatherTalk"></div>
    <div class="lida-explosion__layer lida-explosion__layer--room"          id="lidaExpRoom"></div>
    <div class="lida-explosion__layer lida-explosion__layer--lida"          id="lidaExpLida"></div>
    <div class="lida-explosion__flash" id="lidaExpFlash"></div>
    <button class="lida-explosion__btn" id="lidaExpBtn">ДАЛЬШЕ</button>
    <div class="road-grain"></div>
    <div class="road-vignette"></div>
    <div class="title-bar">
      <div class="title-bar__inner" id="lidaExpTitleInner">
        <p class="title-bar__text" id="lidaExpTitleText"></p>
        <span class="title-bar__bottom-line"></span>
      </div>
    </div>
    <div class="lida-explosion__fade" id="lidaExpFade"></div>
  `;
  return el;
}

export function playLidaScene5(onDone) {
  const el = buildLidaExplosion();
  app.appendChild(el);
  void el.offsetWidth;
  el.classList.add("is-active");

  const bag = el.querySelector("#lidaExpBag");
  const boom = el.querySelector("#lidaExpBoom");
  const father = el.querySelector("#lidaExpFather");
  const fatherT = el.querySelector("#lidaExpFatherTalk");
  const room = el.querySelector("#lidaExpRoom");
  const lida = el.querySelector("#lidaExpLida");
  const flash = el.querySelector("#lidaExpFlash");
  const btn = el.querySelector("#lidaExpBtn");
  const fade = el.querySelector("#lidaExpFade");
  const inner = el.querySelector("#lidaExpTitleInner");
  const textEl = el.querySelector("#lidaExpTitleText");

  startAmbient("night-war", "assets/audio/lida/night-war.mp3", 0.02);

  after(2000, () => {
    textEl.textContent = "Ночь. Она оставила сумку у стены и убежала.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
  });
  after(7000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
    inner.classList.remove("is-visible");
  });

  after(8500, () => flash.classList.add("is-active"));
  after(8800, () => {
    flash.classList.remove("is-active");
    bag.classList.remove("is-active");
    boom.classList.add("is-active");
  });

  after(11000, () => {
    textEl.classList.remove("is-fading");
    textEl.textContent = "Грохот. Эхо.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
  });
  after(15000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
    inner.classList.remove("is-visible");
  });

  after(17000, () => {
    boom.classList.remove("is-active");
    father.classList.add("is-active");
  });

  after(18000, () => {
    father.classList.remove("is-active");
    fatherT.classList.add("is-active");
    textEl.classList.remove("is-fading");
    textEl.textContent = "— Лида. Это ты сделала?";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/lida/dad_9.mp3", 1.0);
  });
  after(22000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
  });
  after(23000, () => inner.classList.remove("is-visible"));

  after(23500, () => {
    fatherT.classList.remove("is-active");
    father.classList.add("is-active");
    textEl.classList.remove("is-fading");
    textEl.textContent = "— Я. А что?";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/lida/lida_20.mp3", 1.0);
  });
  after(27500, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
  });
  after(28500, () => inner.classList.remove("is-visible"));

  after(29000, () => {
    father.classList.remove("is-active");
    fatherT.classList.add("is-active");
    textEl.classList.remove("is-fading");
    textEl.textContent = "— Ты понимаешь, что могла погибнуть?";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/lida/dad_10.mp3", 1.0);
  });
  after(34000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
  });
  after(35000, () => inner.classList.remove("is-visible"));

  after(35500, () => {
    fatherT.classList.remove("is-active");
    father.classList.add("is-active");
    textEl.classList.remove("is-fading");
    textEl.textContent = "— Понимаю. Но кто-то же должен.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/lida/lida_21.mp3", 1.0);
  });
  after(40500, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
  });
  after(41500, () => inner.classList.remove("is-visible"));

  after(42000, () => {
    father.classList.remove("is-active");
    fatherT.classList.add("is-active");
    textEl.classList.remove("is-fading");
    textEl.textContent = "— Ты — моя дочь. Моя.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/lida/dad_11.mp3", 1.0);
  });
  after(47000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
    inner.classList.remove("is-visible");
  });

  after(49000, () => {
    fatherT.classList.remove("is-active");
    room.classList.add("is-active");
    stopAmbient("night-war", 800);
    startAmbient("room-tension", "assets/audio/lida/room-tension.mp3", 0.2);
  });

  after(50500, () => {
    textEl.classList.remove("is-fading");
    textEl.textContent = "— Это правда? Малолетка пронесла?";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/lida/voice_4.mp3", 1.0);
  });
  after(55500, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
  });
  after(56500, () => inner.classList.remove("is-visible"));

  after(57000, () => {
    textEl.classList.remove("is-fading");
    textEl.textContent = "— Правда.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/lida/dad_12.mp3", 1.0);
  });
  after(61000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
  });
  after(62000, () => inner.classList.remove("is-visible"));

  after(62500, () => {
    textEl.classList.remove("is-fading");
    textEl.textContent = "— Сколько ей?";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/lida/voice_5.mp3", 1.0);
  });
  after(66500, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
  });
  after(67500, () => inner.classList.remove("is-visible"));

  after(68000, () => {
    textEl.classList.remove("is-fading");
    textEl.textContent = "— Одиннадцать.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/lida/dad_13.mp3", 1.0);
  });
  after(72000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
  });
  after(73000, () => inner.classList.remove("is-visible"));

  after(73500, () => {
    textEl.classList.remove("is-fading");
    textEl.textContent = "— Господи…";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/lida/voice_6.mp3", 1.0);
  });
  after(77500, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
    inner.classList.remove("is-visible");
  });

  after(79000, () => {
    room.classList.remove("is-active");
    lida.classList.add("is-active");
    textEl.classList.remove("is-fading");
    textEl.textContent = "— Что? Думали, не справлюсь?";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/lida/lida_22.mp3", 1.0);
  });
  after(84000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
  });
  after(85000, () => inner.classList.remove("is-visible"));

  after(85500, () => {
    textEl.classList.remove("is-fading");
    textEl.textContent = "— Ты… ты герой.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/lida/voice_7.mp3", 1.0);
  });
  after(89500, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
  });
  after(90500, () => inner.classList.remove("is-visible"));

  after(91000, () => {
    textEl.classList.remove("is-fading");
    textEl.textContent = "— Я просто делаю, что могу.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/lida/lida_23.mp3", 1.0);
  });
  after(96000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
    inner.classList.remove("is-visible");
  });

  after(98000, () => btn.classList.add("is-visible"));

  btn.addEventListener(
    "click",
    () => {
      btn.classList.remove("is-visible");
      btn.classList.add("is-gone");
      fade.classList.add("is-active");
      after(2500, () => {
        stopAmbient("room-tension", 800);
        el.classList.remove("is-active");
        setTimeout(() => {
          el.remove();
          onDone && onDone();
        }, 1500);
      });
    },
    { once: true },
  );
}

/* ============================================================
   ЛИДА — СЦЕНА 6. ОБЛАВА
   ============================================================ */
function buildLidaRaid() {
  const el = document.createElement("section");
  el.className = "scene scene--lida-raid";
  el.innerHTML = `
    <div class="lida-raid__layer lida-raid__layer--street is-active" id="lidaRaidStreet"></div>
    <div class="lida-raid__layer lida-raid__layer--door"             id="lidaRaidDoor"></div>
    <div class="lida-raid__layer lida-raid__layer--masha-closed"     id="lidaRaidMashaClosed"></div>
    <div class="lida-raid__layer lida-raid__layer--masha-talk"       id="lidaRaidMashaTalk"></div>
    <div class="lida-raid__layer lida-raid__layer--mother-grab"      id="lidaRaidMotherGrab"></div>
    <div class="lida-raid__layer lida-raid__layer--mother-talk"      id="lidaRaidMotherTalk"></div>
    <div class="lida-raid__layer lida-raid__layer--lida-closed"      id="lidaRaidLidaClosed"></div>
    <div class="lida-raid__layer lida-raid__layer--lida-talk"        id="lidaRaidLidaTalk"></div>
    <div class="lida-raid__layer lida-raid__layer--police-closed"    id="lidaRaidPoliceClosed"></div>
    <div class="lida-raid__layer lida-raid__layer--police-talk"      id="lidaRaidPoliceTalk"></div>
    <div class="lida-raid__layer lida-raid__layer--run"              id="lidaRaidRun"></div>
    <button class="lida-raid__btn" id="lidaRaidBtn">ВЕРНУТЬСЯ ДОМОЙ</button>
    <div class="road-grain"></div>
    <div class="road-vignette"></div>
    <div class="title-bar">
      <div class="title-bar__inner" id="lidaRaidTitleInner">
        <p class="title-bar__text" id="lidaRaidTitleText"></p>
        <span class="title-bar__bottom-line"></span>
      </div>
    </div>
    <div class="lida-raid__fade" id="lidaRaidFade"></div>
  `;
  return el;
}

export function playLidaScene6(onDone) {
  const el = buildLidaRaid();
  app.appendChild(el);
  void el.offsetWidth;
  el.classList.add("is-active");

  const street = el.querySelector("#lidaRaidStreet");
  const door = el.querySelector("#lidaRaidDoor");
  const mashaClosed = el.querySelector("#lidaRaidMashaClosed");
  const mashaTalk = el.querySelector("#lidaRaidMashaTalk");
  const motherGrab = el.querySelector("#lidaRaidMotherGrab");
  const motherTalk = el.querySelector("#lidaRaidMotherTalk");
  const lidaClosed = el.querySelector("#lidaRaidLidaClosed");
  const lidaTalk = el.querySelector("#lidaRaidLidaTalk");
  const policeClosed = el.querySelector("#lidaRaidPoliceClosed");
  const policeTalk = el.querySelector("#lidaRaidPoliceTalk");
  const run = el.querySelector("#lidaRaidRun");
  const btn = el.querySelector("#lidaRaidBtn");
  const fade = el.querySelector("#lidaRaidFade");
  const inner = el.querySelector("#lidaRaidTitleInner");
  const textEl = el.querySelector("#lidaRaidTitleText");

  stopAllAmbient(0);
  stopAllVoices();
  startAmbient("raid", "assets/audio/lida/raid.mp3", 0.25);

  after(1500, () => {
    textEl.textContent = "Начались облавы. Подпольщикам грозила смерть.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/lida/voice_8.mp3", 1.0);
  });
  after(8000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
    inner.classList.remove("is-visible");
  });

  after(9500, () => {
    street.classList.remove("is-active");
    door.classList.add("is-active");
    textEl.classList.remove("is-fading");
    textEl.textContent = "— Тётя Маша! Открывайте! Облава!";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/lida/lida_24.mp3", 1.0);
  });
  after(14000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
  });
  after(15000, () => inner.classList.remove("is-visible"));

  after(15500, () => {
    door.classList.remove("is-active");
    mashaClosed.classList.add("is-active");
    textEl.classList.remove("is-fading");
    textEl.textContent = "— Кто там?";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/lida/masha_1.mp3", 1.0);
  });
  after(19000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
  });
  after(20000, () => inner.classList.remove("is-visible"));

  after(20500, () => {
    textEl.classList.remove("is-fading");
    textEl.textContent = "— Это я, Лида! Вашкевич! Уходите! Через задний двор!";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/lida/lida_25.mp3", 1.0);
  });
  after(25500, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
  });
  after(26500, () => inner.classList.remove("is-visible"));

  after(27000, () => {
    mashaClosed.classList.remove("is-active");
    mashaTalk.classList.add("is-active");
    textEl.classList.remove("is-fading");
    textEl.textContent = "— А ты? Ты как?";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/lida/masha_2.mp3", 1.0);
  });
  after(30500, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
  });
  after(31500, () => inner.classList.remove("is-visible"));

  after(32000, () => {
    mashaTalk.classList.remove("is-active");
    mashaClosed.classList.add("is-active");
    textEl.classList.remove("is-fading");
    textEl.textContent = "— У меня ещё дела. Бегите!";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/lida/lida_26.mp3", 1.0);
  });
  after(36000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
    inner.classList.remove("is-visible");
  });

  after(37500, () => {
    mashaClosed.classList.remove("is-active");
    motherGrab.classList.add("is-active");
    textEl.classList.remove("is-fading");
    textEl.textContent = "— Лида! Ты с ума сошла!";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/lida/mom_4.mp3", 1.0);
  });
  after(43000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
  });
  after(44000, () => inner.classList.remove("is-visible"));

  after(44500, () => {
    motherGrab.classList.remove("is-active");
    motherTalk.classList.add("is-active");
    textEl.classList.remove("is-fading");
    textEl.textContent = "— Ты ребёнок!";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/lida/mom_5.mp3", 1.0);
  });
  after(48500, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
  });
  after(49500, () => inner.classList.remove("is-visible"));

  after(50000, () => {
    motherTalk.classList.remove("is-active");
    lidaClosed.classList.add("is-active");
  });

  after(51000, () => {
    lidaClosed.classList.remove("is-active");
    lidaTalk.classList.add("is-active");
    textEl.classList.remove("is-fading");
    textEl.textContent =
      "— Мама. Если поймают меня — спасётся десять. Если я спрячусь — погибнут все.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/lida/lida_27.mp3", 1.0);
  });
  after(59000, () => {
    lidaTalk.classList.remove("is-active");
    lidaClosed.classList.add("is-active");
    textEl.textContent = "— Уже нет.";
    playVoice("assets/audio/lida/lida_28.mp3", 1.0);
  });
  after(63000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
    inner.classList.remove("is-visible");
  });

  after(64500, () => {
    lidaClosed.classList.remove("is-active");
    policeClosed.classList.add("is-active");
    textEl.classList.remove("is-fading");
    textEl.textContent = "— Стой! Куда бежишь?";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/lida/police_8.mp3", 1.0);
  });
  after(69000, () => {
    textEl.textContent = "— Домой. Мама послала за хлебом.";
    playVoice("assets/audio/lida/lida_29.mp3", 1.0);
  });

  after(73000, () => {
    policeClosed.classList.remove("is-active");
    policeTalk.classList.add("is-active");
    textEl.textContent = "— Хлеб? В комендантский час?";
    playVoice("assets/audio/lida/police_9.mp3", 1.0);
  });
  after(77500, () => {
    policeTalk.classList.remove("is-active");
    policeClosed.classList.add("is-active");
    textEl.textContent = "— Мама не знает, что час. Она больная. Лежит.";
    playVoice("assets/audio/lida/lida_30.mp3", 1.0);
  });
  after(83000, () => {
    policeClosed.classList.remove("is-active");
    policeTalk.classList.add("is-active");
    textEl.textContent = "— Иди. И быстро.";
    playVoice("assets/audio/lida/police_10.mp3", 1.0);
  });
  after(87500, () => {
    textEl.textContent = "— Спасибо.";
    playVoice("assets/audio/lida/lida_31_thanks.mp3", 1.0);
  });
  after(91500, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
    inner.classList.remove("is-visible");
  });

  after(93500, () => {
    policeTalk.classList.remove("is-active");
    run.classList.add("is-active");
    textEl.classList.remove("is-fading");
    textEl.textContent =
      "Лида обошла пять квартир. Пять раз постучала. Пять раз успела.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/lida/voice_9.mp3", 1.0);
  });
  after(102500, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
    inner.classList.remove("is-visible");
  });

  after(104500, () => btn.classList.add("is-visible"));

  btn.addEventListener(
    "click",
    () => {
      btn.classList.remove("is-visible");
      btn.classList.add("is-gone");
      fade.classList.add("is-active");
      after(2500, () => {
        stopAllAmbient(500);
        stopAllVoices();
        el.classList.remove("is-active");
        setTimeout(() => {
          el.remove();
          onDone && onDone();
        }, 1500);
      });
    },
    { once: true },
  );
}

/* ============================================================
   ЛИДА — СЦЕНА 7. ТИШИНА
   ============================================================ */
function buildLidaSilence() {
  const el = document.createElement("section");
  el.className = "scene scene--lida-silence";
  el.innerHTML = `
    <div class="lida-silence__layer lida-silence__layer--empty is-active" id="lidaSilEmpty"></div>
    <div class="lida-silence__layer lida-silence__layer--bag-tie"          id="lidaSilBagTie"></div>
    <div class="lida-silence__layer lida-silence__layer--memory"           id="lidaSilMemory"></div>
    <div class="lida-silence__layer lida-silence__layer--heart"            id="lidaSilHeart"></div>
    <div class="lida-silence__layer lida-silence__layer--lida-tie"         id="lidaSilLidaTie"></div>
    <div class="lida-silence__layer lida-silence__layer--zoya"             id="lidaSilZoya"></div>
    <div class="lida-silence__layer lida-silence__layer--zoya-talk"        id="lidaSilZoyaTalk"></div>
    <button class="lida-silence__btn" id="lidaSilBtn">ВЗЯТЬ СУМКУ</button>
    <div class="road-grain"></div>
    <div class="road-vignette"></div>
    <div class="title-bar">
      <div class="title-bar__inner" id="lidaSilTitleInner">
        <p class="title-bar__text" id="lidaSilTitleText"></p>
        <span class="title-bar__bottom-line"></span>
      </div>
    </div>
    <div class="lida-silence__fade" id="lidaSilFade"></div>
  `;
  return el;
}

export function playLidaScene7(onDone) {
  const el = buildLidaSilence();
  app.appendChild(el);
  void el.offsetWidth;
  el.classList.add("is-active");

  const empty = el.querySelector("#lidaSilEmpty");
  const bagTie = el.querySelector("#lidaSilBagTie");
  const memory = el.querySelector("#lidaSilMemory");
  const heart = el.querySelector("#lidaSilHeart");
  const lidaTie = el.querySelector("#lidaSilLidaTie");
  const zoya = el.querySelector("#lidaSilZoya");
  const zoyaTalk = el.querySelector("#lidaSilZoyaTalk");
  const btn = el.querySelector("#lidaSilBtn");
  const fade = el.querySelector("#lidaSilFade");
  const inner = el.querySelector("#lidaSilTitleInner");
  const textEl = el.querySelector("#lidaSilTitleText");

  stopAllAmbient(0);
  stopAllVoices();
  startAmbient("clock", "assets/audio/lida/clock.mp3", 0.2);

  after(2000, () => {
    textEl.textContent =
      "Её отца, брата и сестру схватили. Казнили. Лида осталась одна.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/lida/voice_10.mp3", 1.0);
  });
  after(11000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
    inner.classList.remove("is-visible");
  });

  after(12500, () => {
    textEl.classList.remove("is-fading");
    textEl.textContent = "Ей было десять. Одна. Но не сдалась.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/lida/10.mp3", 1.0);
  });
  after(19000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
    inner.classList.remove("is-visible");
  });

  after(20500, () => {
    empty.classList.remove("is-active");
    bagTie.classList.add("is-active");
  });

  after(22000, () => {
    bagTie.classList.remove("is-active");
    memory.classList.add("is-active");
    textEl.classList.remove("is-fading");
    textEl.textContent =
      "— Лида. Если со мной что-то случится — ты должна продолжить. Понимаешь?";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/lida/dad_14.mp3", 1.0);
  });
  after(30000, () => {
    textEl.textContent = "— Понимаю.";
    playVoice("assets/audio/lida/lida_32.mp3", 1.0);
  });
  after(33000, () => {
    textEl.textContent = "— Ты сильная. Сильнее, чем думаешь.";
    playVoice("assets/audio/lida/dad_15.mp3", 1.0);
  });
  after(38500, () => {
    textEl.textContent =
      "— Я не хочу быть сильной. Я хочу, чтобы ты был рядом.";
    playVoice("assets/audio/lida/lida_33.mp3", 1.0);
  });

  after(45000, () => {
    memory.classList.remove("is-active");
    heart.classList.add("is-active");
    textEl.textContent = "— Я всегда буду рядом. Здесь. Здесь.";
    playVoice("assets/audio/lida/dad_16.mp3", 1.0);
  });
  after(52000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
    inner.classList.remove("is-visible");
  });

  after(53500, () => {
    heart.classList.remove("is-active");
    lidaTie.classList.add("is-active");
    textEl.classList.remove("is-fading");
    textEl.textContent = "Я продолжу, папа. Обещаю.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/lida/lida_34.mp3", 1.0);
  });
  after(59500, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
    inner.classList.remove("is-visible");
  });

  after(61000, () => btn.classList.add("is-visible"));

  btn.addEventListener(
    "click",
    () => {
      btn.classList.remove("is-visible");
      btn.classList.add("is-gone");
      lidaTie.classList.remove("is-active");
      zoya.classList.add("is-active");

      after(1500, () => {
        textEl.classList.remove("is-fading");
        textEl.textContent = "— Лидочка… Ты одна теперь?";
        inner.classList.add("is-visible");
        textEl.classList.add("is-visible");
        playVoice("assets/audio/lida/zoya_1.mp3", 1.0);
      });
      after(6000, () => {
        textEl.textContent = "— Одна.";
        playVoice("assets/audio/lida/lida_35.mp3", 1.0);
      });

      after(8000, () => {
        zoya.classList.remove("is-active");
        zoyaTalk.classList.add("is-active");
        textEl.textContent = "— Может, ко мне переедешь? Я присмотрю.";
        playVoice("assets/audio/lida/zoya_2.mp3", 1.0);
      });
      after(14000, () => {
        textEl.textContent = "— Спасибо, тётя Зоя. Но я справлюсь.";
        playVoice("assets/audio/lida/lida_36.mp3", 1.0);
      });
      after(19000, () => {
        textEl.textContent = "— Ты же ребёнок! Как ты справишься?";
        playVoice("assets/audio/lida/voice_14.mp3", 1.0);
      });
      after(24000, () => {
        textEl.textContent =
          "— Так же, как справлялась раньше. Только теперь — одна.";
        playVoice("assets/audio/lida/lida_37.mp3", 1.0);
      });
      after(30000, () => {
        textEl.classList.remove("is-visible");
        textEl.classList.add("is-fading");
        inner.classList.remove("is-visible");
      });

      after(32000, () => {
        zoyaTalk.classList.remove("is-active");
        empty.classList.add("is-active");
        textEl.classList.remove("is-fading");
        textEl.textContent =
          "Лида взяла сумку и вышла. Ей было десять. Одна. Но не сдалась.";
        inner.classList.add("is-visible");
        textEl.classList.add("is-visible");
      });
      after(41000, () => {
        textEl.classList.remove("is-visible");
        textEl.classList.add("is-fading");
        inner.classList.remove("is-visible");
      });

      after(43000, () => fade.classList.add("is-active"));
      after(45500, () => {
        stopAllAmbient(500);
        stopAllVoices();
        el.classList.remove("is-active");
        setTimeout(() => {
          el.remove();
          onDone && onDone();
        }, 1500);
      });
    },
    { once: true },
  );
}

/* ============================================================
   ЛИДА — СЦЕНА 8. ГОДЫ
   ============================================================ */
function buildLidaYears() {
  const el = document.createElement("section");
  el.className = "scene scene--lida-years";
  el.innerHTML = `
    <div class="lida-years__layer lida-years__layer--winter is-active" id="lidaYearWinter"></div>
    <div class="lida-years__layer lida-years__layer--summer"            id="lidaYearSummer"></div>
    <div class="lida-years__layer lida-years__layer--winter-again"      id="lidaYearWinter2"></div>
    <div class="lida-years__layer lida-years__layer--camp"              id="lidaYearCamp"></div>
    <div class="lida-years__layer lida-years__layer--cmd-closed"        id="lidaYearCmdClosed"></div>
    <div class="lida-years__layer lida-years__layer--cmd-talk"          id="lidaYearCmdTalk"></div>
    <div class="lida-years__layer lida-years__layer--lida-listen"       id="lidaYearLidaListen"></div>
    <div class="lida-years__layer lida-years__layer--lida-talk"         id="lidaYearLidaTalk"></div>
    <div class="lida-years__layer lida-years__layer--rookie"            id="lidaYearRookie"></div>
    <button class="lida-years__btn" id="lidaYearBtn">ДАЛЬШЕ</button>
    <div class="road-grain"></div>
    <div class="road-vignette"></div>
    <div class="title-bar">
      <div class="title-bar__inner" id="lidaYearTitleInner">
        <p class="title-bar__text" id="lidaYearTitleText"></p>
        <span class="title-bar__bottom-line"></span>
      </div>
    </div>
    <div class="lida-years__fade" id="lidaYearFade"></div>
  `;
  return el;
}

export function playLidaScene8(onDone) {
  const el = buildLidaYears();
  app.appendChild(el);
  void el.offsetWidth;
  el.classList.add("is-active");

  const winter = el.querySelector("#lidaYearWinter");
  const summer = el.querySelector("#lidaYearSummer");
  const winter2 = el.querySelector("#lidaYearWinter2");
  const camp = el.querySelector("#lidaYearCamp");
  const cmdClosed = el.querySelector("#lidaYearCmdClosed");
  const cmdTalk = el.querySelector("#lidaYearCmdTalk");
  const lidaListen = el.querySelector("#lidaYearLidaListen");
  const lidaTalk = el.querySelector("#lidaYearLidaTalk");
  const rookie = el.querySelector("#lidaYearRookie");
  const btn = el.querySelector("#lidaYearBtn");
  const fade = el.querySelector("#lidaYearFade");
  const inner = el.querySelector("#lidaYearTitleInner");
  const textEl = el.querySelector("#lidaYearTitleText");

  stopAllAmbient(0);
  stopAllVoices();
  startAmbient("metronome", "assets/audio/lida/metronome.mp3", 0.25);

  after(2000, () => {
    textEl.textContent = "Год за годом. 1942. 1943. 1944.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/lida/voice_12.mp3", 1.0);
  });
  after(7000, () => {
    winter.classList.remove("is-active");
    summer.classList.add("is-active");
  });
  after(11000, () => {
    summer.classList.remove("is-active");
    winter2.classList.add("is-active");
  });
  after(15000, () => {
    textEl.textContent = "Связная партизанского отряда имени Матросова.";
    playVoice("assets/audio/lida/voice_13.mp3", 1.0);
  });
  after(21000, () => {
    textEl.textContent = "Разведчица. Подпольщица. Девочка с чёрной сумкой.";
  });
  after(27000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
    inner.classList.remove("is-visible");
  });

  after(29000, () => {
    winter2.classList.remove("is-active");
    camp.classList.add("is-active");
    stopAmbient("metronome", 800);
    startAmbient("forest-fire", "assets/audio/lida/forest-fire.mp3", 0.2);
    textEl.classList.remove("is-fading");
    textEl.textContent =
      "Город жил. Город боролся. Потому что дети не сдавались.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/lida/city_life1.mp3", 1.0);
  });
  after(37000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
    inner.classList.remove("is-visible");
  });

  after(39000, () => {
    camp.classList.remove("is-active");
    cmdClosed.classList.add("is-active");
  });

  after(40000, () => {
    cmdClosed.classList.remove("is-active");
    cmdTalk.classList.add("is-active");
    textEl.classList.remove("is-fading");
    textEl.textContent = "— Вашкевич. Задание. Опасное.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/lida/cmd_1.mp3", 1.0);
  });
  after(45000, () => {
    cmdTalk.classList.remove("is-active");
    lidaListen.classList.add("is-active");
    textEl.textContent = "— Я слушаю.";
    playVoice("assets/audio/lida/lida_40.mp3", 1.0);
  });
  after(48500, () => {
    lidaListen.classList.remove("is-active");
    cmdTalk.classList.add("is-active");
    textEl.textContent =
      "— Нужно пронести взрывчатку через Неман. Мимо постов.";
    playVoice("assets/audio/lida/cmd_1.mp3", 1.0);
  });
  after(56000, () => {
    cmdTalk.classList.remove("is-active");
    lidaTalk.classList.add("is-active");
    textEl.textContent = "— Когда?";
    playVoice("assets/audio/lida/lida_40.mp3", 1.0);
  });
  after(59000, () => {
    lidaTalk.classList.remove("is-active");
    cmdTalk.classList.add("is-active");
    textEl.textContent = "— Ты даже не спросишь, зачем?";
    playVoice("assets/audio/lida/cmd_1.mp3", 1.0);
  });
  after(64500, () => {
    cmdTalk.classList.remove("is-active");
    lidaTalk.classList.add("is-active");
    textEl.textContent = "— Я знаю, зачем. Чтобы победить.";
    playVoice("assets/audio/lida/lida_41.mp3", 1.0);
  });
  after(70000, () => {
    lidaTalk.classList.remove("is-active");
    cmdTalk.classList.add("is-active");
    textEl.textContent = "— Сколько тебе лет?";
    playVoice("assets/audio/lida/cmd_1.mp3", 1.0);
  });
  after(74000, () => {
    cmdTalk.classList.remove("is-active");
    lidaTalk.classList.add("is-active");
    textEl.textContent = "— Двенадцать.";
    playVoice("assets/audio/lida/12.mp3", 1.0);
  });
  after(78000, () => {
    lidaTalk.classList.remove("is-active");
    cmdTalk.classList.add("is-active");
    textEl.textContent = "— Двенадцать… А говоришь, как взрослая.";
    playVoice("assets/audio/lida/cmd_1.mp3", 1.0);
  });
  after(85000, () => {
    cmdTalk.classList.remove("is-active");
    lidaTalk.classList.add("is-active");
    textEl.textContent = "— Война быстро взрослеет.";
    playVoice("assets/audio/lida/lida_39.mp3", 1.0);
  });
  after(90000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
    inner.classList.remove("is-visible");
  });

  after(92000, () => {
    lidaTalk.classList.remove("is-active");
    rookie.classList.add("is-active");
    textEl.classList.remove("is-fading");
    textEl.textContent = "— Ты… ты правда Вашкевич?";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/lida/boy_5.mp3", 1.0);
  });
  after(96500, () => {
    textEl.textContent = "— Правда.";
    playVoice("assets/audio/lida/true.mp3", 1.0);
  });
  after(98500, () => {
    textEl.textContent = "— Мне говорили, ты с десяти лет в подполье.";
    playVoice("assets/audio/lida/boy_5.mp3", 1.0);
  });
  after(104000, () => {
    textEl.textContent = "— С десяти.";
    playVoice("assets/audio/lida/lida_42.mp3", 1.0);
  });
  after(106500, () => {
    textEl.textContent = "— Как ты не боишься?";
    playVoice("assets/audio/lida/boy_3.mp3", 1.0);
  });
  after(110000, () => {
    textEl.textContent =
      "— Боюсь. Каждый день. Но страх — это не то, что должно тебя останавливать.";
    playVoice("assets/audio/lida/lida_44.mp3", 1.0);
  });
  after(118000, () => {
    textEl.textContent = "— А что должно?";
    playVoice("assets/audio/lida/boy_4.mp3", 1.0);
  });
  after(121000, () => {
    textEl.textContent =
      "— Память. О тех, кого уже нет. И о тех, кто ещё может жить. Если мы победим.";
    playVoice("assets/audio/lida/lida_45.mp3", 1.0);
  });
  after(130000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
    inner.classList.remove("is-visible");
  });

  after(132000, () => btn.classList.add("is-visible"));

  btn.addEventListener(
    "click",
    () => {
      btn.classList.remove("is-visible");
      btn.classList.add("is-gone");
      fade.classList.add("is-active");
      after(2500, () => {
        stopAllAmbient(500);
        stopAllVoices();
        el.classList.remove("is-active");
        setTimeout(() => {
          el.remove();
          onDone && onDone();
        }, 1500);
      });
    },
    { once: true },
  );
}

/* ============================================================
   ЛИДА — СЦЕНА 9. МОЛЧАНИЕ
   ============================================================ */
function buildLidaSilence2() {
  const el = document.createElement("section");
  el.className = "scene scene--lida-silence2";
  el.innerHTML = `
    <div class="lida-silence2__layer lida-silence2__layer--adult is-active" id="lidaSil2Adult"></div>
    <div class="lida-silence2__layer lida-silence2__layer--girl"            id="lidaSil2Girl"></div>
    <div class="lida-silence2__layer lida-silence2__layer--two"             id="lidaSil2Two"></div>
    <div class="lida-silence2__layer lida-silence2__layer--mother-old"      id="lidaSil2MotherOld"></div>
    <div class="lida-silence2__layer lida-silence2__layer--hug"             id="lidaSil2Hug"></div>
    <button class="lida-silence2__btn" id="lidaSil2Btn">ДАЛЬШЕ</button>
    <div class="road-grain"></div>
    <div class="road-vignette"></div>
    <div class="title-bar">
      <div class="title-bar__inner" id="lidaSil2TitleInner">
        <p class="title-bar__text" id="lidaSil2TitleText"></p>
        <span class="title-bar__bottom-line"></span>
      </div>
    </div>
    <div class="lida-silence2__fade" id="lidaSil2Fade"></div>
  `;
  return el;
}

export function playLidaScene9(onDone) {
  const el = buildLidaSilence2();
  app.appendChild(el);
  void el.offsetWidth;
  el.classList.add("is-active");

  const adult = el.querySelector("#lidaSil2Adult");
  const girl = el.querySelector("#lidaSil2Girl");
  const two = el.querySelector("#lidaSil2Two");
  const motherOld = el.querySelector("#lidaSil2MotherOld");
  const hug = el.querySelector("#lidaSil2Hug");
  const btn = el.querySelector("#lidaSil2Btn");
  const fade = el.querySelector("#lidaSil2Fade");
  const inner = el.querySelector("#lidaSil2TitleInner");
  const textEl = el.querySelector("#lidaSil2TitleText");

  stopAllAmbient(0);
  stopAllVoices();
  startAmbient("silence-room", "assets/audio/lida/silence-room.mp3", 0.15);
  startAmbient("clock", "assets/audio/lida/clock.mp3", 0.1);

  after(2000, () => {
    textEl.textContent =
      "Я не помню тот день. Помню только сумку. Она была тяжёлая. Но я не могла её бросить.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/lida/lida_46.mp3", 1.0);
  });
  after(13000, () => {
    textEl.textContent =
      "Я не знала, выживу ли. Я просто шла. Каждый день — шла.";
    playVoice("assets/audio/lida/lida_47.mp3", 1.0);
  });
  after(24000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
    inner.classList.remove("is-visible");
  });

  after(26000, () => {
    adult.classList.remove("is-active");
    girl.classList.add("is-active");
    textEl.classList.remove("is-fading");
    textEl.textContent = "— Ты боялась?";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/lida/old_lida_1.mp3", 1.0);
  });
  after(31000, () => {
    textEl.textContent = "— Боялась. Каждый раз.";
    playVoice("assets/audio/lida/lida_48.mp3", 1.0);
  });
  after(35500, () => {
    textEl.textContent = "— Почему не остановилась?";
    playVoice("assets/audio/lida/old_lida_2.mp3", 1.0);
  });
  after(40000, () => {
    textEl.textContent = "— Потому что если бы остановилась — кто бы пошёл?";
    playVoice("assets/audio/lida/lida_49.mp3", 1.0);
  });
  after(46000, () => {
    textEl.textContent = "— Я горжусь тобой.";
    playVoice("assets/audio/lida/old_lida_3.mp3", 1.0);
  });
  after(50000, () => {
    textEl.textContent = "— Я знаю.";
    playVoice("assets/audio/lida/lida_50.mp3", 1.0);
  });

  after(54000, () => {
    girl.classList.remove("is-active");
    two.classList.add("is-active");
  });
  after(56000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
    inner.classList.remove("is-visible");
  });

  after(59000, () => {
    two.classList.remove("is-active");
    motherOld.classList.add("is-active");
    textEl.classList.remove("is-fading");
    textEl.textContent = "— Лида… Ты жива…";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/lida/mom_7.mp3", 1.0);
  });
  after(64000, () => {
    textEl.textContent = "— Жива, мама. Жива.";
    playVoice("assets/audio/lida/lida_51.mp3", 1.0);
  });
  after(68500, () => {
    textEl.textContent = "— Я думала… я думала, тебя тоже…";
    playVoice("assets/audio/lida/mom_6.mp3", 1.0);
  });
  after(74000, () => {
    textEl.textContent = "— Нет. Я обещала — не потеряешь.";
    playVoice("assets/audio/lida/lida_52.mp3", 1.0);
  });

  after(80000, () => {
    motherOld.classList.remove("is-active");
    hug.classList.add("is-active");
    textEl.textContent = "— Как ты выжила? Как?";
    playVoice("assets/audio/lida/mom_8.mp3", 1.0);
  });
  after(85000, () => {
    textEl.textContent = "— Я просто шла. Каждый день. И не оглядывалась.";
    playVoice("assets/audio/lida/iw.mp3", 1.0);
  });
  after(93000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
    inner.classList.remove("is-visible");
  });

  after(95000, () => btn.classList.add("is-visible"));

  btn.addEventListener(
    "click",
    () => {
      btn.classList.remove("is-visible");
      btn.classList.add("is-gone");
      fade.classList.add("is-active");
      after(2500, () => {
        stopAllAmbient(500);
        stopAllVoices();
        el.classList.remove("is-active");
        setTimeout(() => {
          el.remove();
          onDone && onDone();
        }, 1500);
      });
    },
    { once: true },
  );
}

/* ============================================================
   ЛИДА — СЦЕНА 10. УТРО (финал)
   ============================================================ */
function buildLidaMorning() {
  const el = document.createElement("section");
  el.className = "scene scene--lida-morning";
  el.innerHTML = `
    <div class="lida-morning__layer lida-morning__layer--classroom is-active" id="lidaMorClassroom"></div>
    <div class="lida-morning__layer lida-morning__layer--student"            id="lidaMorStudent"></div>
    <div class="lida-morning__layer lida-morning__layer--colleague"          id="lidaMorColleague"></div>
    <div class="road-grain"></div>
    <div class="road-vignette"></div>
    <div class="title-bar">
      <div class="title-bar__inner" id="lidaMorTitleInner">
        <p class="title-bar__text" id="lidaMorTitleText"></p>
        <span class="title-bar__bottom-line"></span>
      </div>
    </div>
    <div class="lida-morning__white" id="lidaMorWhite">
      <img class="lida-morning__portrait" id="lidaMorPortrait" src="assets/images/lida/scene50-final-portrait.jpg" alt="">
      <p class="lida-morning__credits" id="lidaMorCredits"></p>
      <p class="lida-morning__whisper" id="lidaMorWhisper"></p>
      <button class="lida-morning__btn" id="lidaMorBtn">ЗАКОНЧИТЬ ИСТОРИЮ</button>
    </div>
    <div class="lida-morning__final" id="lidaMorFinal">
      <div class="lida-morning__final-inner">
        <p class="lida-morning__final-p" id="lidaMorP1"></p>
        <p class="lida-morning__final-p" id="lidaMorP2"></p>
        <p class="lida-morning__final-p" id="lidaMorP3"></p>
      </div>
    </div>
  `;
  return el;
}

export function playLidaScene10(onDone) {
  const el = buildLidaMorning();
  app.appendChild(el);
  void el.offsetWidth;
  el.classList.add("is-active");

  const classroom = el.querySelector("#lidaMorClassroom");
  const student = el.querySelector("#lidaMorStudent");
  const colleague = el.querySelector("#lidaMorColleague");
  const white = el.querySelector("#lidaMorWhite");
  const portrait = el.querySelector("#lidaMorPortrait");
  const credits = el.querySelector("#lidaMorCredits");
  const whisper = el.querySelector("#lidaMorWhisper");
  const btn = el.querySelector("#lidaMorBtn");
  const finalBox = el.querySelector("#lidaMorFinal");
  const p1 = el.querySelector("#lidaMorP1");
  const p2 = el.querySelector("#lidaMorP2");
  const p3 = el.querySelector("#lidaMorP3");
  const inner = el.querySelector("#lidaMorTitleInner");
  const textEl = el.querySelector("#lidaMorTitleText");

  stopAllAmbient(0);
  stopAllVoices();
  startAmbient("classroom", "assets/audio/lida/classroom.mp3", 0.15);

  after(2000, () => {
    textEl.textContent = "Война закончилась. Я выжила.";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/lida/lida_53.mp3", 1.0);
  });
  after(7000, () => {
    textEl.textContent =
      "Я закончила школу. Поступила в педагогический. Стала учительницей.";
    playVoice("assets/audio/lida/lida_54.mp3", 1.0);
  });
  after(14000, () => {
    textEl.textContent = "Работала в школе №17 в Гродно. Учила детей.";
    playVoice("assets/audio/lida/lida_55.mp3", 1.0);
  });
  after(20000, () => {
    textEl.textContent = "Детей, у которых было детство.";
    playVoice("assets/audio/lida/lida_56.mp3", 1.0);
  });
  after(26000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
    inner.classList.remove("is-visible");
  });

  after(28000, () => {
    classroom.classList.remove("is-active");
    student.classList.add("is-active");
    textEl.classList.remove("is-fading");
    textEl.textContent = "— Лидия Михайловна, а вы были на войне?";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/lida/лидия_михайловна_а_вы_были_на_войне.mp3", 1.0);
  });
  after(34000, () => {
    textEl.textContent = "— Была.";
    playVoice("assets/audio/lida/lida_58.mp3", 1.0);
  });
  after(37000, () => {
    textEl.textContent = "— А что вы делали?";
    playVoice("assets/audio/lida/а_что_вы_делали.mp3", 1.0);
  });
  after(40500, () => {
    textEl.textContent = "— Носила уголь. Топила печки.";
    playVoice("assets/audio/lida/lida_59.mp3", 1.0);
  });
  after(46000, () => {
    textEl.textContent = "— И всё?";
    playVoice("assets/audio/lida/и_все.mp3", 1.0);
  });
  after(49000, () => {
    textEl.textContent =
      "— И всё. А теперь — открывайте тетради. Тема урока: «Мир».";
    playVoice("assets/audio/lida/а_теперь_открывайте_тетради.mp3", 1.0);
  });
  after(57000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
    inner.classList.remove("is-visible");
  });

  after(59000, () => {
    student.classList.remove("is-active");
    colleague.classList.add("is-active");
    textEl.classList.remove("is-fading");
    textEl.textContent =
      "— Лидия Михайловна, почему вы никогда не рассказываете о войне?";
    inner.classList.add("is-visible");
    textEl.classList.add("is-visible");
    playVoice("assets/audio/lida/почему_вы_никогда_не_рассказываете.mp3", 1.0);
  });
  after(66000, () => {
    textEl.textContent = "— А зачем?";
    playVoice("assets/audio/lida/AndWhy.mp3", 1.0);
  });
  after(69000, () => {
    textEl.textContent = "— Вы же герой. Дети должны знать.";
    playVoice("assets/audio/lida/вы_же_герой.mp3", 1.0);
  });
  after(74000, () => {
    textEl.textContent =
      "— Дети должны знать не о войне. Они должны знать, что война — это плохо. Что её не должно быть. Чтобы они никогда не носили чёрные сумки.";
    playVoice("assets/audio/lida/дети_должны_знать_не_о_войне.mp3", 1.0);
  });
  after(88000, () => {
    textEl.textContent = "— Простите.";
    playVoice("assets/audio/lida/простите.mp3", 1.0);
  });
  after(91000, () => {
    textEl.textContent = "— Ничего. Просто… помните. Это всё, что нужно.";
    playVoice("assets/audio/lida/lida_61.mp3", 1.0);
  });
  after(98000, () => {
    textEl.classList.remove("is-visible");
    textEl.classList.add("is-fading");
    inner.classList.remove("is-visible");
  });

  after(101000, () => {
    colleague.classList.remove("is-active");
    white.classList.add("is-active");
    portrait.classList.add("is-visible");
  });

  after(104000, () => {
    typeText(
      credits,
      "Лидия Михайловна Вашкевич.\n1932–2023.\nПионер-герой. Связная. Учительница.",
      55,
      () => {
        after(1500, () => {
          whisper.textContent = "Ей было десять, когда она начала бороться.";
          whisper.classList.add("is-visible");
        });
        after(6000, () => {
          whisper.textContent =
            "Ей было десять, когда она начала бороться.\nЕй было тринадцать, когда война закончилась.";
        });
        after(12000, () => btn.classList.add("is-visible"));
      },
    );
  });

  btn.addEventListener(
    "click",
    () => {
      btn.classList.remove("is-visible");
      btn.classList.add("is-gone");
      white.classList.remove("is-active");
      finalBox.classList.add("is-visible");

      after(500, () => {
        p1.textContent =
          "История Лиды Вашкевич — это история о девочке, которая не испугалась. О чёрной сумке, которую она пронесла через всю войну. О памяти, которую она сохранила для нас.";
        p1.classList.add("is-visible");
        playVoice("assets/audio/lida/история_лиды_вашкевич.mp3", 1.0);
      });
      after(12000, () => {
        p2.textContent =
          "Я — Лида. Лидия Михайловна Вашкевич. Пионер-герой. Связная. Учительница.";
        p2.classList.add("is-visible");
      });
      after(21000, () => {
        p3.textContent = "Я не жалею. Я была счастлива.";
        p3.classList.add("is-visible");
      });

      after(30000, () => {
        finalBox.style.transition = "opacity 4s ease";
        finalBox.style.opacity = "0";
      });
      after(35000, () => {
        stopAllAmbient(1200);
        stopAllVoices();
        el.classList.remove("is-active");
        setTimeout(() => {
          el.remove();
          onDone && onDone();
        }, 2000);
      });
    },
    { once: true },
  );
}

/* ============================================================
   НАДЕЖДА — СЦЕНА 0. ЧЁРНЫЙ. ИМЯ.
   ============================================================ */
function buildNadezhdaIntro() {
  const el = document.createElement("section");
  el.className = "scene scene--nadezhda-intro";
  el.innerHTML = `
    <img class="nadezhda-intro__accent" id="nadezhdaIntroAccent"
         src="assets/images/nadezhda/accent-flag.png" alt="">

    <div class="nadezhda-intro__word" id="nadezhdaIntroWord">
      <span>Н</span>
      <span>А</span>
      <span>Д</span>
      <span>Е</span>
      <span>Ж</span>
      <span>Д</span>
      <span>А</span>
    </div>

    <div class="nadezhda-intro__fade" id="nadezhdaIntroFade"></div>
  `;
  return el;
}

export function playNadezhdaScene0(onDone) {
  const el = buildNadezhdaIntro();
  app.appendChild(el);
  void el.offsetWidth;
  el.classList.add("is-active");

  const accent = el.querySelector("#nadezhdaIntroAccent");
  const letters = el.querySelectorAll("#nadezhdaIntroWord span");
  const fade = el.querySelector("#nadezhdaIntroFade");

  stopAllAmbient(0);
  stopAllVoices();

  after(300, () => {
    accent.classList.add("is-visible");
  });

  letters.forEach((letter, i) => {
    after(1200 + i * 300, () => {
      letter.classList.add("is-visible");
    });
  });

  after(9000, () => {
    accent.classList.remove("is-visible");
    letters.forEach((l) => l.classList.remove("is-visible"));
  });

  after(9500, () => {
    fade.classList.add("is-active");
  });

  after(11000, () => {
    el.classList.remove("is-active");
    setTimeout(() => {
      el.remove();
      onDone && onDone();
    }, 1500);
  });
}
