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
  playNadezhdaScene1,  
  playNadezhdaScene2,
  playNadezhdaScene3,
  playNadezhdaScene4,
  playNadezhdaScene5,
  playNadezhdaScene6,
  playNadezhdaScene7,
  playNadezhdaScene8,
  playNadezhdaScene9,
  playNadezhdaScene10,
  playNadezhdaScene11,
  playNadezhdaScene12,
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
  // playLidaScene0(() => {
  //   playLidaScene1(() => {
  //     playLidaScene2(() => {
        // playLidaScene3(() => {
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
        // });
  //     });
  //   });
  // });
}
function startNadezhdaStory() {
  playNadezhdaScene0(() => {
    playNadezhdaScene1(() => {
      playNadezhdaScene2(() => {       // ← сцена 2 «Витебск. Подвал»
        playNadezhdaScene3(() => {     // ← сцена 3 «Партизанский отряд»
          playNadezhdaScene4(() => {     // ← добавить
            playNadezhdaScene5(() => {     // ← добавить
              playNadezhdaScene6(() => {
                playNadezhdaScene7(() => {
                  playNadezhdaScene8(() => {
                    playNadezhdaScene9(() => {
                      playNadezhdaScene10(() => {
                        playNadezhdaScene11(() => {
                          playNadezhdaScene12(() => {
                            backToMenu(); // Финал! Возврат в меню
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