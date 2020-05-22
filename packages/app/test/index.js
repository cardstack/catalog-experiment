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

    let el1 = document.getElementById("test-1");
    assert.equal(el1.textContent, "Hello world", "text content is correct");
  });
});
