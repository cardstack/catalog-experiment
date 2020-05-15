import * as sinon from "sinon";
import { stubFetch } from "./helpers/mock-fetch";
import {
  installFileAssertions,
  FileAssert,
  origin,
  url,
} from "./helpers/file-assertions";
import { testOrigin } from "./origins";

const webServerHref = "http://test.com";
//@ts-ignore tests are running in the main thread (ugh)...
const win = window;

QUnit.module("filesystem - http driver", function (origHooks) {
  let { test } = installFileAssertions(origHooks);
  let stubbedFetch: sinon.SinonStub;

  origHooks.beforeEach(async () => {
    stubbedFetch = stubFetch([
      {
        method: "GET",
        url: webServerHref,
        response: {
          status: 200,
          body: "Hello World",
        },
      },
    ]);
  });

  origHooks.afterEach(async () => {
    stubbedFetch.restore();
  });

  QUnit.module("mock fetch", function () {
    test("can mock http server for success response", async function (assert) {
      let res = await fetch(webServerHref);
      assert.equal(res.status, 200, "status is correct");
      assert.equal(res.ok, true, "request is successful");
      let body = await res.text();
      assert.equal(
        body,
        "Hello World",
        "mocked response is returned to request"
      );
    });

    test("can mock http server for 404 response", async function (assert) {
      let res = await fetch("http://nowhere");
      assert.equal(res.status, 404, "status is correct");
      assert.equal(res.ok, false, "request is not successful");
      let body = await res.text();
      assert.equal(body, "Not Found", "mocked response is returned to request");
    });
  });

  QUnit.module("open", function () {
    origHooks.beforeEach(async (assert) => {
      let fileAssert = (assert as unknown) as FileAssert;
      await fileAssert.setupFiles();
    });
  });
});
