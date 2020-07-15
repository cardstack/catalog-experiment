import { getPuppies } from "http://localhost:4200/test-lib/index.js";

export function helloWorld() {
  let elt = document.createElement("h1");
  elt.setAttribute("id", "test-1");
  elt.textContent = "Hello world";
  return elt;
}

export function cutestPuppies() {
  let elt = document.createElement("h2");
  elt.setAttribute("id", "test-2");
  elt.textContent = `The cutest puppies are ${getPuppies().join(" and ")}!`;
  return elt;
}
