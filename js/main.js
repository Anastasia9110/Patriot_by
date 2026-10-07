import { runPreloader, playScene0 } from "./core/app.js";

window.addEventListener("load", () => {
  runPreloader(() => playScene0());
});

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    location.reload();
  }
});
