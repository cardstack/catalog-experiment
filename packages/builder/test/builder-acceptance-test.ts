// This is an acceptance test and it leverages the service worker to provide
// it's initial test state

import { Scenario } from "../src/test-request-handler";
import { testOrigin } from "./origin";

const { test } = QUnit;
const testContainerId = "test-container";

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
    return fetch(new URL(path, origin).toString(), { mode: "no-cors" });
  }

  async function setupScenario(scenario: Scenario = {}) {
    await fetch(`/setup-fs`, {
      method: "POST",
      body: JSON.stringify(scenario),
    });
  }

  hooks.beforeEach(async () => {
    clearTestDOM();
  });

  hooks.afterEach(async () => {
    clearTestDOM();
    await fetch("/teardown-fs", { method: "POST" });
  });

  test("can process a single module that has no imports", async function (assert) {
    await setupScenario({
      "index.js": `
        (function() {
          let container = document.getElementById('test-container');
          let elt = document.createElement("h1");
          elt.textContent = "Hello world";
          container.append(elt);
        })();
      `,
    });
    let js = await (await testFetch("/index.js")).text();
    eval(js);

    let container = getTestDOM();
    assert.equal(
      container.querySelector("h1").textContent,
      "Hello world",
      "the javascript executed successfully"
    );
  });
});
