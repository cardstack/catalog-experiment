import { helloWorld } from "./ui.js";

export async function boot(rootElement) {
  rootElement.append(helloWorld());

  let img = document.createElement("img");
  img.setAttribute("src", "./images/bike.jpg");
  img.setAttribute("width", "300px");
  rootElement.append(img);
}

if (window.testing) {
  window.bootApp = boot;
} else {
  boot(document.body);
}
