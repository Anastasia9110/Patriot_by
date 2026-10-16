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
  playLidaScene5,
  playLidaScene6,
  playLidaScene7,
  playLidaScene8,
  playLidaScene9,
  playLidaScene10,
  playNadezhdaScene0,
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
            playLidaScene5(() => {     // ← добавить
              playLidaScene6(() => {     // ← добавить
                playLidaScene7(() => {     // ← добавить
                  playLidaScene8(() => {     // ← добавить
                    playLidaScene9(() => {     // ← добавить
                      playLidaScene10(() => {     // ← добавить
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
}
function startNadezhdaStory() {
  playNadezhdaScene0(() => {
    // дальше — playNadezhdaScene1 и т.д.
    backToMenu();
  });
}
/* ============================================================
   ИНИЦИАЛИЗАЦИЯ МЕНЮ
   ============================================================ */
initMenu((story) => {
  if (story === "zina") startZinaStory();
  if (story === "lida") startLidaStory();
  if (story === "nadezhda") startNadezhdaStory();
});