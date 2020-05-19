import { boot } from "../index.js";
const { module, test } = QUnit;

async function renderApp() {
  let container = document.getElementById("test-container");
  // debugger;
  // await boot(container);
  // debugger;
}

module("application test bed", function (hooks) {
  hooks.beforeEach(() => {
    let container = document.getElementById("test-container");
    container.innerHTML = "";
  });

  test("hello test", async function (assert) {
    assert.ok(1 == "1", "Passed!");
  });

  test("renders app", async function (assert) {
    await renderApp();

    let el1 = document.getElementById("test-1");
    assert.equal(el1.textContent, "Hello world", "text content is correct");
  });
});
