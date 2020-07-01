import { boot } from "../index.js";
const { module, test } = QUnit;

async function renderApp() {
  let container = document.getElementById("test-container");
  await boot(container);
}

module("application test bed", function (hooks) {
  hooks.beforeEach(() => {
    let container = document.getElementById("test-container");
    container.innerHTML = "";
  });

  test("renders app", async function (assert) {
    await renderApp();

    let el = document.getElementById("test-1");
    assert.equal(el.textContent, "Hello world", "text content is correct");
  });

  test("can use exports from specified dependency", async function (assert) {
    await renderApp();

    let el = document.getElementById("test-2");
    assert.equal(
      el.textContent,
      "The cutest puppies are mango and van gogh",
      "text content is correct"
    );
  });
});
