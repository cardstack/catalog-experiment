import { helloWorld } from "./ui.js";
document.body.append(helloWorld());

let img = document.createElement("img");
img.setAttribute("src", "./images/bike.jpg");
img.setAttribute("width", "300px");
document.body.append(img);
