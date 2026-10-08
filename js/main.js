import { runPreloader, playScene0, playScene1, playScene2 } from "./app.js";
import { clearAll } from "./utils.js";

function start() {
  runPreloader(() => {
    playScene0(() => {
      playScene1(() => {
        playScene2();   // ← сюда позже добавим playScene3, playScene4 …
      });
    });
  });
}

// Кнопка «НАЧАТЬ» на стартовом экране
const startBtn = document.getElementById("startBtn");
if (startBtn) {
  startBtn.addEventListener("click", () => {
    const s = document.getElementById("startScreen");
    if (s) {
      s.classList.add("is-gone");
      setTimeout(() => s.remove(), 1500);
    }
    start();
  });
}

// Space — перезапуск
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    clearAll();
    location.reload();
  }
});