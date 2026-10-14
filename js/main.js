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
  playLidaScene2,
  playLidaScene3,
  playLidaScene4,
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
   ЗАПУСК ИСТОРИИ «ЛИДА»
   ============================================================ */
function startLidaStory() {
  playLidaScene0(() => {
    playLidaScene1(() => {
      playLidaScene2(() => {
        playLidaScene3(() => {
          playLidaScene4(() => {
          backToMenu();
          });
        });
      });
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