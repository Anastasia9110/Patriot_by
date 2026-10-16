/* ============================================================
   ЗАСТАВКА + МЕНЮ + СТАРТОВЫЙ ЭКРАН ИСТОРИИ + КНОПКА ВЫХОДА
   ============================================================ */
let menuEl = null;
let exitBtn = null;
let onStoryStart = null;

export function initMenu(onStorySelected) {
  onStoryStart = onStorySelected;

  const intro     = document.getElementById("intro");
  const introBg   = intro.querySelector(".intro__bg");
  const title     = intro.querySelector(".intro__title");
  const subtitle  = intro.querySelector(".intro__subtitle");
  const introBtn  = document.getElementById("introBtn");

  const flash     = document.getElementById("flash");
  menuEl          = document.getElementById("menu");
  exitBtn         = document.getElementById("exitBtn");

  const cardZina     = document.getElementById("cardZina");
  const cardLida     = document.getElementById("cardLida");
  const cardNadezhda = document.getElementById("cardNadezhda");
  const storyStart   = document.getElementById("storyStart");

  /* ============================================================
     1. ПОЯВЛЕНИЕ ЗАСТАВКИ
     ============================================================ */
  setTimeout(() => introBg.classList.add("is-visible"), 100);
  setTimeout(() => title.classList.add("is-visible"), 400);
  setTimeout(() => subtitle.classList.add("is-visible"), 900);
  setTimeout(() => introBtn.classList.add("is-visible"), 1500);

  /* ============================================================
     2. КЛИК «ВОЙТИ»
     ============================================================ */
  introBtn.addEventListener("click", () => {
    flash.classList.add("is-active");

    setTimeout(() => intro.classList.add("is-gone"), 500);
    setTimeout(() => menuEl.classList.add("is-active"), 900);
    setTimeout(() => flash.classList.remove("is-active"), 1400);
    setTimeout(() => intro.remove(), 2500);
  });

  /* ============================================================
     3. КЛИК ПО КАРТОЧКЕ ЗИНЫ (с титулом «ЗИНА / ПОРТНОВА»)
     ============================================================ */
  cardZina.addEventListener("click", () => {
    if (cardZina.classList.contains("is-soon")) return;

    flash.classList.add("is-active");
    setTimeout(() => menuEl.classList.remove("is-active"), 400);
    setTimeout(() => flash.classList.remove("is-active"), 1200);

    setTimeout(() => {
      menuEl.style.display = "none";
      storyStart.classList.add("is-active");

      setTimeout(() => {
        storyStart.classList.add("is-gone");

        setTimeout(() => {
          storyStart.style.display = "none";
          exitBtn.classList.add("is-visible");
          onStoryStart && onStoryStart("zina");
        }, 1000);
      }, 2000);
    }, 1400);
  });

  /* ============================================================
     4. КЛИК ПО КАРТОЧКЕ ЛИДЫ (без титула)
     ============================================================ */
  cardLida.addEventListener("click", () => {
    if (cardLida.classList.contains("is-soon")) return;

    flash.classList.add("is-active");
    setTimeout(() => menuEl.classList.remove("is-active"), 400);
    setTimeout(() => flash.classList.remove("is-active"), 1200);

    setTimeout(() => {
      menuEl.style.display = "none";
      exitBtn.classList.add("is-visible");
      onStoryStart && onStoryStart("lida");
    }, 1400);
  });

  /* ============================================================
     5. КЛИК ПО КАРТОЧКЕ НАДЕЖДЫ (без титула)
     ============================================================ */
  cardNadezhda.addEventListener("click", () => {
    if (cardNadezhda.classList.contains("is-soon")) return;

    flash.classList.add("is-active");
    setTimeout(() => menuEl.classList.remove("is-active"), 400);
    setTimeout(() => flash.classList.remove("is-active"), 1200);

    setTimeout(() => {
      menuEl.style.display = "none";
      exitBtn.classList.add("is-visible");
      onStoryStart && onStoryStart("nadezhda");
    }, 1400);
  });

  if (aboutWrap && brandBtn && aboutPanel && menuDim) {
    const isTouch = window.matchMedia("(hover: none)").matches;

    let closeTimer = null;

    const openPanel = () => {
      clearTimeout(closeTimer);
      aboutPanel.classList.add("is-open");
      menuDim.classList.add("is-active");
    };

    const closePanel = () => {
      aboutPanel.classList.remove("is-open");
      menuDim.classList.remove("is-active");
      aboutWrap
        .querySelectorAll(".about-item.is-open")
        .forEach((it) => it.classList.remove("is-open"));
    };

    /* Закрываем НЕ сразу, а через 250 мс.
       Если за это время мышь вернётся — закрытие отменяется. */
    const scheduleClose = () => {
      clearTimeout(closeTimer);
      closeTimer = setTimeout(closePanel, 250);
    };

    if (!isTouch) {
      /* Открытие/отмена закрытия */
      brandBtn.addEventListener("mouseenter", openPanel);
      aboutWrap.addEventListener("mouseenter", openPanel);

      /* Мышь ушла с бренда/панели — планируем закрытие */
      aboutWrap.addEventListener("mouseleave", scheduleClose);

      /* Курсор вернулся на панель — отменяем закрытие */
      aboutPanel.addEventListener("mouseenter", openPanel);

      /* Доп. страховка: если мышь ушла на карточки или в футер —
         закрываем сразу, без ожидания */
      if (menuGrid) {
        menuGrid.addEventListener("mouseenter", () => {
          clearTimeout(closeTimer);
          closePanel();
        });
      }
      if (menuFooter) {
        menuFooter.addEventListener("mouseenter", () => {
          clearTimeout(closeTimer);
          closePanel();
        });
      }
    } else {
      /* Тач: тап по бренду — открыть/закрыть */
      brandBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (aboutPanel.classList.contains("is-open")) closePanel();
        else openPanel();
      });

      /* Тап вне панели — закрыть */
      document.addEventListener("click", (e) => {
        if (!aboutWrap.contains(e.target)) closePanel();
      });
    }

    /* Клик по пункту — раскрыть подсказку */
    aboutWrap.querySelectorAll(".about-item").forEach((item) => {
      item.addEventListener("click", (e) => {
        e.stopPropagation();
        const wasOpen = item.classList.contains("is-open");
        aboutWrap
          .querySelectorAll(".about-item.is-open")
          .forEach((it) => it.classList.remove("is-open"));
        if (!wasOpen) item.classList.add("is-open");
      });
    });

    /* Esc — закрыть панель */
    document.addEventListener("keyup", (e) => {
      if (e.key === "Escape") closePanel();
    });
  }

  /* ============================================================
     7. КНОПКА «МЕНЮ» ВЫХОД
     ============================================================ */
  exitBtn.addEventListener("click", backToMenu);

  /* ============================================================
     8. Esc — возврат в меню (только в игре, а не в меню)
     ============================================================ */
  document.addEventListener("keydown", (e) => {
    if (e.code === "Escape") {
      /* Если сейчас игра, а не меню — возвращаемся */
      if (menuEl && menuEl.style.display === "none") {
        e.preventDefault();
        backToMenu();
      }
    }
  });
}

/* ============================================================
   ВОЗВРАТ В МЕНЮ
   ============================================================ */
export function backToMenu() {
  import("./utils.js").then(({ clearAll }) => clearAll());
  import("./app.js")
    .then(({ stopAllVoices }) => stopAllVoices())
    .catch(() => {});

  document.querySelectorAll("video, audio").forEach((media) => {
    try {
      media.pause();
      media.currentTime = 0;
    } catch (e) {}
  });

  const app = document.getElementById("app");
  if (app) app.innerHTML = "";

  const pre = document.getElementById("preloader");
  if (pre && pre.parentNode) pre.remove();

  if (exitBtn) exitBtn.classList.remove("is-visible");

  const storyStart = document.getElementById("storyStart");
  if (storyStart) {
    storyStart.classList.remove("is-active");
    storyStart.style.display = "none";
  }

  if (menuEl) {
    menuEl.style.display = "";
    requestAnimationFrame(() => menuEl.classList.add("is-active"));
  }
}