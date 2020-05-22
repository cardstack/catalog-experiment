export function helloWorld() {
  let elt = document.createElement("h1");
  elt.setAttribute("id", "test-1");
  elt.textContent = "Hello world";
  return elt;
}
