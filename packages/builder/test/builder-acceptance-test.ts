// This is an acceptance test and it leverages the service worker to provide
// it's initial test state

import { Scenario } from "../src/test-request-handler";
import { testOrigin } from "./origins";

const { skip } = QUnit;
const testContainerId = "test-container";

// @ts-ignore: we are actually in main thread, not worker.
const win: any = window;

QUnit.module("acceptance builder", function (hooks) {
  function getTestDOM() {
    // @ts-ignore: we are actually in main thread, not worker.
    return document.getElementById(testContainerId);
  }

  function clearTestDOM() {
    // @ts-ignore: we are actually in main thread, not worker.
    let testContainer = document.getElementById(testContainerId);
    while (testContainer.firstChild) {
      testContainer.removeChild(testContainer.firstChild);
    }
  }

  async function testFetch(path: string, origin: string = testOrigin) {
    return fetch(new URL(path, origin).href, { mode: "no-cors" });
  }

  async function setupScenario(scenario: Scenario = {}) {
    await fetch(`/setup-fs`, {
      method: "POST",
      body: JSON.stringify(scenario),
    });
  }

  async function runModule(url: string) {
    let s = win.document.createElement("script");
    s.type = "module";
    s.src = new URL(url, testOrigin).href;
    let p = new Promise((resolve, reject) => {
      s.addEventListener("load", resolve);
      s.addEventListener("error", reject);
    });
    win.document.body.appendChild(s);
    await p;
    win.document.body.removeChild(s);
  }

  hooks.beforeEach(async () => {
    win.testContext = {};
    clearTestDOM();
  });

  hooks.afterEach(async () => {
    delete win.testContext;
    clearTestDOM();
    await fetch("/teardown-fs", { method: "POST" });
  });

  skip("can process a single module that has no imports", async function (assert) {
    await setupScenario({
      "entrypoints.json": `{"src-index.html": "index.html"}`,
      "src-index.html": `
        <!DOCTYPE html>
        <script type="module" src="./index.js"></script>
      `,
      "index.js": `
        (function() {
          let container = document.getElementById('test-container');
          let elt = document.createElement("h1");
          elt.textContent = "Hello world";
          container.append(elt);
        })();
      `,
    });
    let js = await (await testFetch("/built-index.js")).text();
    eval(js);

    let container = getTestDOM();
    assert.equal(
      container.querySelector("h1").textContent,
      "Hello world",
      "the javascript executed successfully"
    );
  });

  skip("a module with a dependency within the app runs correctly", async function (assert) {
    await setupScenario({
      "entrypoints.json": `{"src-index.html": "index.html"}`,
      "src-index.html": `
        <!DOCTYPE html>
        <script type="module" src="./index.js"></script>`,
      "index.js": `
        import { message } from './ui.js';
        window.testContext.message = message;
      `,
      "ui.js": `export const message = "Hello world";`,
    });

    await runModule("/built-index.js");
    assert.equal(win.testContext.message, "Hello world");
  });
});
