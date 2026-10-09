import { runPreloader, playScene0, playScene1, playScene2, playScene3, playScene4, } from "./app.js";
import { clearAll } from "./utils.js";

function start() {
  runPreloader(() => {
    playScene0(() => {
      playScene1(() => {
        playScene2(() => {
          playScene3(() => {
            playScene4();          // ← сцена 4 «Столовая»
          });  // ← сцена 3 «Листовки»
        });   // ← сюда позже добавим playScene3, playScene4 …
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