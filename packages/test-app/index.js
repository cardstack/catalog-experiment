import { helloWorld, cutestPuppies } from "./ui.js";

export async function boot(rootElement) {
  rootElement.append(helloWorld());
  rootElement.append(cutestPuppies());

  let img = document.createElement("img");
  img.setAttribute("src", "/images/bike.jpg");
  img.setAttribute("width", "300px");
  rootElement.append(img);
}

if (!window.testing) {
  boot(document.body);
}
