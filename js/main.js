import {
  runPreloader,
  playScene0,
  playScene1,
  playScene2,
  playScene3,
  playScene4,
  playScene5,
  playScene6,
  playScene7,
  playScene8,
  playScene9,
  playScene10,
  playLidaScene0,
  playLidaScene1,
} from "./app.js";
import { initMenu, backToMenu } from "./menu.js";

/* ============================================================
   ЗАПУСК ИСТОРИИ «ЗИНА»
   ============================================================ */
function startZinaStory() {
  runPreloader(() => {
    playScene0(() => {
      playScene1(() => {
        playScene2(() => {
          playScene3(() => {
            playScene4(() => {
              playScene5(() => {
                playScene6(() => {
                  playScene7(() => {
                    playScene8(() => {
                      playScene9(() => {
                        playScene10(() => {
                          backToMenu();
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
}
/* ============================================================
   ЗАПУСК ИСТОРИИ «ЛИДА» (пока временный — заглушка)
   ============================================================ */
function startLidaStory() {
  // Без прелоадера — сцена 0 сама выполняет роль заставки
  playLidaScene0(() => {
    playLidaScene1(() => {
      // Дальше — playLidaScene2 и т.д.
      backToMenu();
    });
  });
}
/* ============================================================
   ИНИЦИАЛИЗАЦИЯ МЕНЮ
   ============================================================ */
initMenu((story) => {
  if (story === "zina") startZinaStory();
  if (story === "lida") startLidaStory();
});