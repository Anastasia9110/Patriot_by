/* ============================================================
   ЗАСТАВКА + МЕНЮ + СТАРТОВЫЙ ЭКРАН ИСТОРИИ + КНОПКА ВЫХОДА
   ============================================================ */
import { clearAll, unlockAudio } from "./utils.js";
import { stopAllVoices } from "./app.js";

let menuEl = null;
let exitBtn = null;
let onStoryStart = null;

export function initMenu(onStorySelected) {
  ["pointerdown", "click", "touchstart", "keydown"].forEach((evt) => {
    document.addEventListener(evt, unlockAudio, { passive: true });
  });
  onStoryStart = onStorySelected;

  const intro     = document.getElementById("intro");
  const introBg   = intro.querySelector(".intro__bg");
  const title     = intro.querySelector(".intro__title");
  const subtitle  = intro.querySelector(".intro__subtitle");
  const introBtn  = document.getElementById("introBtn");

  const flash     = document.getElementById("flash");
  menuEl          = document.getElementById("menu");
  exitBtn         = document.getElementById("exitBtn");
  const storyStart = document.getElementById("storyStart");

  /* ============================================================
     ЗАГРУЗКА КАРТОЧЕК ИЗ JSON-БАЗЫ
     ============================================================ */
  const menuGrid = document.querySelector(".menu__grid");

  async function loadStories() {
    try {
      const response = await fetch("database.json");
      const data = await response.json();
      
      menuGrid.innerHTML = ""; // Очищаем сетку перед заполнением

      data.stories.forEach(story => {
        const card = document.createElement("button");
        card.className = "card is-available";
        card.dataset.story = story.id;
        
        card.innerHTML = `
          <div class="card__photo" style="background-image: url('${story.image}')"></div>
          <div class="card__line"></div>
          <div class="card__name">${story.name}</div>
          <div class="card__years">${story.years}</div>
        `;

        // Обработчик клика для каждой карточки
        card.addEventListener("click", () => {
          unlockAudio();
          flash.classList.add("is-active");
          setTimeout(() => menuEl.classList.remove("is-active"), 400);
          setTimeout(() => flash.classList.remove("is-active"), 1200);

          setTimeout(() => {
            menuEl.style.display = "none";
            
            // Если это Зина, показываем стартовый экран с её именем
            if (story.id === "zina") {
              storyStart.classList.add("is-active");
              setTimeout(() => {
                storyStart.classList.add("is-gone");
                setTimeout(() => {
                  storyStart.style.display = "none";
                  exitBtn.classList.add("is-visible");
                  onStoryStart && onStoryStart(story.id);
                }, 1000);
              }, 2000);
            } else {
              // Для остальных историй сразу запускаем
              exitBtn.classList.add("is-visible");
              onStoryStart && onStoryStart(story.id);
            }
          }, 1400);
        });

        menuGrid.appendChild(card);
      });
    } catch (error) {
      console.error("Ошибка загрузки базы данных:", error);
    }
  }

  loadStories();

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
    unlockAudio();
    flash.classList.add("is-active");
    setTimeout(() => intro.classList.add("is-gone"), 500);
    setTimeout(() => menuEl.classList.add("is-active"), 900);
    setTimeout(() => flash.classList.remove("is-active"), 1400);
    setTimeout(() => intro.remove(), 2500);
  });

  /* ============================================================
     ПАНЕЛЬ «О ПРОЕКТЕ»
     ============================================================ */
  const aboutWrap  = document.getElementById("aboutWrap");
  const brandBtn   = document.getElementById("brandBtn");
  const aboutPanel = document.getElementById("aboutPanel");
  const menuDim    = document.getElementById("menuDim");
  const menuFooter = document.querySelector(".menu__footer");
  
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
      aboutWrap.querySelectorAll(".about-item.is-open").forEach((it) => it.classList.remove("is-open"));
    };

    const scheduleClose = () => {
      clearTimeout(closeTimer);
      closeTimer = setTimeout(closePanel, 250);
    };

    if (!isTouch) {
      brandBtn.addEventListener("mouseenter", openPanel);
      aboutWrap.addEventListener("mouseenter", openPanel);
      aboutWrap.addEventListener("mouseleave", scheduleClose);
      aboutPanel.addEventListener("mouseenter", openPanel);
      if (menuGrid) menuGrid.addEventListener("mouseenter", () => { clearTimeout(closeTimer); closePanel(); });
      if (menuFooter) menuFooter.addEventListener("mouseenter", () => { clearTimeout(closeTimer); closePanel(); });
    } else {
      brandBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (aboutPanel.classList.contains("is-open")) closePanel();
        else openPanel();
      });
      document.addEventListener("click", (e) => {
        if (!aboutWrap.contains(e.target)) closePanel();
      });
    }

    aboutWrap.querySelectorAll(".about-item").forEach((item) => {
      item.addEventListener("click", (e) => {
        e.stopPropagation();
        const wasOpen = item.classList.contains("is-open");
        aboutWrap.querySelectorAll(".about-item.is-open").forEach((it) => it.classList.remove("is-open"));
        if (!wasOpen) item.classList.add("is-open");
      });
    });

    document.addEventListener("keyup", (e) => {
      if (e.key === "Escape") closePanel();
    });
  }

  /* ============================================================
     7. КНОПКА «МЕНЮ» ВЫХОД
     ============================================================ */
  exitBtn.addEventListener("click", backToMenu);

  /* ============================================================
     8. Esc — возврат в меню
     ============================================================ */
  document.addEventListener("keydown", (e) => {
    if (e.code === "Escape") {
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
  clearAll();
  stopAllVoices();
  document.querySelectorAll("video, audio").forEach((media) => {
    try { media.pause(); media.currentTime = 0; } catch (e) {}
  });

  const app = document.getElementById("app");
  if (app) app.innerHTML = "";

  const pre = document.getElementById("preloader");
  if (pre && pre.parentNode) pre.remove();

  if (exitBtn) exitBtn.classList.remove("is-visible");

  const storyStart = document.getElementById("storyStart");
  if (storyStart) {
    storyStart.classList.remove("is-active");
    storyStart.classList.remove("is-gone");
    storyStart.style.display = "none";
  }

  if (menuEl) {
    menuEl.style.display = "";
    requestAnimationFrame(() => menuEl.classList.add("is-active"));
  }
}