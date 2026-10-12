/* ============================================================
   ЗАСТАВКА + МЕНЮ + СТАРТОВЫЙ ЭКРАН ИСТОРИИ + КНОПКА ВЫХОДА
   ============================================================ */
let menuEl = null;
let exitBtn = null;
let onStoryStart = null;

export function initMenu(onStorySelected) {
  onStoryStart = onStorySelected;

  const intro = document.getElementById("intro");
  const introBg = intro.querySelector(".intro__bg");
  const title = intro.querySelector(".intro__title");
  const subtitle = intro.querySelector(".intro__subtitle");
  const introBtn = document.getElementById("introBtn");

  const flash = document.getElementById("flash");
  menuEl = document.getElementById("menu");
  exitBtn = document.getElementById("exitBtn");

  const cardZina = document.getElementById("cardZina");
  const cardLida = document.getElementById("cardLida");

  const storyStart = document.getElementById("storyStart");

  /* --- 1. Появление заставки (ускорено) --- */
  setTimeout(() => introBg.classList.add("is-visible"), 100);
  setTimeout(() => title.classList.add("is-visible"), 400);
  setTimeout(() => subtitle.classList.add("is-visible"), 900);
  setTimeout(() => introBtn.classList.add("is-visible"), 1500);

  /* --- 2. Клик «ВОЙТИ»: вспышка → меню --- */
  introBtn.addEventListener("click", () => {
    flash.classList.add("is-active");

    setTimeout(() => intro.classList.add("is-gone"), 500);
    setTimeout(() => menuEl.classList.add("is-active"), 900);
    setTimeout(() => flash.classList.remove("is-active"), 1400);
    setTimeout(() => intro.remove(), 2500);
  });

  /* --- 3. Клик по карточке Зины: меню уходит → стартовый экран «ЗИНА» --- */
  cardZina.addEventListener("click", () => {
    if (cardZina.classList.contains("is-soon")) return;

    flash.classList.add("is-active");
    setTimeout(() => menuEl.classList.remove("is-active"), 400);
    setTimeout(() => flash.classList.remove("is-active"), 1200);

    setTimeout(() => {
      menuEl.style.display = "none";
      storyStart.classList.add("is-active");

      /* --- 4. Автозапуск истории через 2 секунды (без кнопки) --- */
      setTimeout(() => {
        storyStart.classList.add("is-gone");

        setTimeout(() => {
          storyStart.style.display = "none";
          exitBtn.classList.add("is-visible");
          onStoryStart && onStoryStart("zina");
        }, 1000); // пауза, чтобы экран «ЗИНА» плавно погас
      }, 2000); // показываем «ЗИНА ПОРТНОВА» 2 секунды
    }, 1400);
  });

  cardLida.addEventListener("click", (e) => e.preventDefault());

  /* --- 5. Кнопка «МЕНЮ» в углу --- */
  exitBtn.addEventListener("click", backToMenu);

  /* --- 6. Esc — возврат в меню --- */
  document.addEventListener("keydown", (e) => {
    if (e.code === "Escape") {
      e.preventDefault();
      backToMenu();
    }
  });
}

/* ============================================================
   ВОЗВРАТ В МЕНЮ ИЗ ИГРЫ
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
