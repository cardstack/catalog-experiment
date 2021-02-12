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
      "The cutest puppies are mango and van gogh!",
      "text content is correct"
    );
  });

  test("application assets are included", async function (assert) {
    await renderApp();

    let response = await fetch("/images/bike.jpg");
    assert.ok(response.ok);
  });

  test("@babel/core and lodash bundles evaluate", async function (assert) {
    await renderApp();
    let [importsEl] = document.getElementsByClassName("named-imports");
    let [exportsEl] = document.getElementsByClassName("named-exports");
    assert.equal(importsEl.textContent, `Named imports: bar, bloop`);
    assert.equal(
      exportsEl.textContent,
      `Named exports: vanGogh, mango, cutestPuppies`
    );
  });
});
