import * as sinon from "sinon";
import { stubFetch } from "./helpers/mock-fetch";
import {
  installFileAssertions,
  FileAssert,
  origin,
  url,
} from "./helpers/file-assertions";
import { readStream } from "./filesystem-test";
import { withListener } from "./helpers/event-helpers";
import {
  HttpFileSystemDriver,
  HttpFileDescriptor,
  HttpDirectoryDescriptor,
} from "../src/filesystem-drivers/http-driver";
import { FileSystem } from "../src/filesystem";
import { flushEvents, removeAllEventListeners, Event } from "../src/event-bus";
import moment from "moment";
import { FileDescriptor } from "../src/filesystem-drivers/filesystem-driver";
import isEqual from "lodash/isEqual";

const utf8 = new TextDecoder("utf8");
const textEncoder = new TextEncoder();
const webServerHref = "http://test.com";

QUnit.module("filesystem - http driver", function (origHooks) {
  let { test, hooks } = installFileAssertions(origHooks);
  let stubbedFetch: sinon.SinonStub;

  hooks.beforeEach(function (assert) {
    assert.resetFilesystem();
  });

  origHooks.afterEach(async () => {
    removeAllEventListeners();
    stubbedFetch.restore();
  });

  origHooks.beforeEach(async (assert) => {
    let fileAssert = (assert as unknown) as FileAssert;
    await fileAssert.setupFiles();
    removeAllEventListeners();

    await fileAssert.fs.mount(
      url("/"),
      new HttpFileSystemDriver(url(webServerHref))
    );
  });

  QUnit.module("mock fetch", function (hooks) {
    let dynamicContents: string;
    hooks.beforeEach(async () => {
      dynamicContents = "bar";
      stubbedFetch = stubFetch([
        {
          method: "GET",
          url: webServerHref,
          response: {
            status: 200,
            body: "Hello World",
          },
        },
        {
          method: "GET",
          url: `${webServerHref}/dynamic`,
          async response() {
            return {
              status: 200,
              body: dynamicContents,
            };
          },
        },
      ]);
    });

    test("can mock http server for static response", async function (assert) {
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

    test("can mock http server for dynamic response", async function (assert) {
      dynamicContents = "foo";
      let res = await fetch(`${webServerHref}/dynamic`);
      assert.equal(res.status, 200, "status is correct");
      assert.equal(res.ok, true, "request is successful");
      let body = await res.text();
      assert.equal(body, "foo", "mocked response is returned to request");
    });

    test("can mock http server for 404 response", async function (assert) {
      let res = await fetch("http://nowhere");
      assert.equal(res.status, 404, "status is correct");
      assert.equal(res.ok, false, "request is not successful");
      let body = await res.text();
      assert.equal(body, "Not Found", "mocked response is returned to request");
    });
  });

  QUnit.module("open", function (hooks) {
    hooks.beforeEach(async () => {
      stubbedFetch = stubFetch([
        {
          method: "GET",
          url: `${webServerHref}`,
          response: {
            status: 200,
            body: "foo",
          },
        },
        {
          method: "GET",
          url: `${webServerHref}/`,
          response: {
            status: 200,
            body: "foo",
          },
        },
        {
          method: "GET",
          url: `${webServerHref}/test/foo.txt`,
          response: {
            status: 200,
            body: "bar",
          },
        },
      ]);
    });

    test("can get an existing file when create mode is not specified", async function (assert) {
      let file = await assert.fs.open(url("/test/foo.txt"));
      assert.equal((await file.stat()).type, "file", "type is correct");
    });

    test("can get the webserver root as a file", async function (assert) {
      let file = await assert.fs.open(new URL(origin));
      assert.equal((await file.stat()).type, "file", "type is correct");
    });

    test("throws when path does not exist and create mode is not specified", async function (assert) {
      try {
        await assert.fs.open(url("/not-there"));
        throw new Error(`should not be able to open file`);
      } catch (e) {
        assert.equal(e.code, "NOT_FOUND", "error code is correct");
      }
    });

    test("throws when trying to create a file", async function (assert) {
      try {
        await assert.fs.open(url("/not-there"), true);
        throw new Error(`should not be able to create a file`);
      } catch (e) {
        assert.equal(
          Boolean(e.message.match(/Unimplemented/)),
          true,
          "error message is correct"
        );
      }
    });

    test("creates a directory in memory only", async function (assert) {
      let dir = (await assert.fs.open(
        url("/not-there/"),
        true
      )) as HttpDirectoryDescriptor;
      assert.equal(dir.url.href, `${origin}/not-there/`);
      assert.equal(dir.underlyingURL.href, `${webServerHref}/not-there/`);
      assert.equal(
        stubbedFetch.callCount,
        0,
        "no requests were made to the HTTP server"
      );
    });
  });

  QUnit.module("file descriptor", function (hooks) {
    let testFileContents: Uint8Array;
    let readCount: number;

    hooks.beforeEach(async () => {
      readCount = 0;
      const initialValue = "Hello World";
      testFileContents = textEncoder.encode(initialValue);

      stubbedFetch = stubFetch([
        {
          method: "GET",
          url: `${webServerHref}`,
          response: {
            status: 200,
            body: "foo",
          },
        },
        {
          method: "GET",
          url: `${webServerHref}/`,
          response: {
            status: 200,
            body: "foo",
          },
        },
        {
          method: "GET",
          url: `${webServerHref}/foo/bar`,
          response(_url, init) {
            let isUpdated = !isEqual(
              testFileContents,
              textEncoder.encode(initialValue)
            );
            let ifNoneMatch = init?.headers?.["If-None-Match"];
            if (
              ifNoneMatch &&
              ((ifNoneMatch === "abc123" && !isUpdated) ||
                (ifNoneMatch === "updated" && isUpdated))
            ) {
              return Promise.resolve({
                status: 304,
              });
            } else {
              return Promise.resolve({
                status: 200,
                body: testFileContents,
                headers: {
                  ETag: isUpdated ? "updated" : "abc123",
                  "Last-Modified": `${moment("2020-05-16T18:50:00 Z")
                    .utc()
                    .format("ddd, DD MMM YYYY HH:mm:ss")} GMT`,
                },
              });
            }
          },
        },
        {
          method: "GET",
          url: `${webServerHref}/foo/volatile`,
          response() {
            readCount++;
            return Promise.resolve({
              status: 200,
              body: `fetch ${readCount}`,
              headers: {
                ETag: readCount,
                "Last-Modified": `${moment()
                  .utc()
                  .format("ddd, DD MMM YYYY HH:mm:ss")} GMT`,
              },
            });
          },
        },
        {
          method: "PUT",
          url: `${webServerHref}/foo/bar`,
          async response(_url, request) {
            if (!request?.body) {
              throw new Error(`request missing body`);
            }
            let bodyBuffer = (request.body as unknown) as Uint8Array;
            let body = utf8.decode(bodyBuffer);
            testFileContents = bodyBuffer;
            return {
              status: 200,
              body,
            };
          },
        },
        {
          method: "GET",
          url: `${webServerHref}/test`,
          response: {
            status: 200,
            body: "bye mars",
          },
        },
      ]);
    });

    async function openFile(fs: FileSystem) {
      return (await fs.open(url("/foo/bar"))) as HttpFileDescriptor;
    }

    async function openVolatileFile(fs: FileSystem) {
      return (await fs.open(url("/foo/volatile"))) as HttpFileDescriptor;
    }

    QUnit.module("read", function () {
      test("can read a string from a file", async function (assert) {
        let file = await openFile(assert.fs);
        assert.equal(
          await file.readText(),
          "Hello World",
          "the file was read correctly"
        );
      });

      test("can use HTTP etag header caching when reading from a file", async function (assert) {
        let file = await openFile(assert.fs);
        assert.equal(
          await file.readText(),
          "Hello World",
          "the file was read correctly"
        );

        // all the following reads will be from the cache
        assert.equal(
          await file.readText(),
          "Hello World",
          "the file was read correctly"
        );
        assert.deepEqual(
          await file.read(),
          new TextEncoder().encode("Hello World"),
          "the file was read correctly"
        );
        let buffer = await readStream(await file.getReadbleStream());
        assert.deepEqual(
          buffer,
          new TextEncoder().encode("Hello World"),
          "the file was read correctly"
        );
        assert.equal(
          (stubbedFetch as any).bodyReadCount,
          1,
          "the body is never read more than once"
        );
      });

      test("can return updated response when etag changes", async function (assert) {
        let file = await openVolatileFile(assert.fs);
        // our logic to test if a file exists results in some initial HTTP
        // GET's. there is opportunity for improvement where we can collapse
        // "has file" with "get file".
        let initialReadCount = readCount;
        assert.equal(
          await file.readText(),
          `fetch ${initialReadCount + 1}`,
          "the file was read correctly"
        );

        // each fetch returns a different value
        assert.equal(
          await file.readText(),
          `fetch ${initialReadCount + 2}`,
          "the file was read correctly"
        );
        assert.deepEqual(
          await file.read(),
          new TextEncoder().encode(`fetch ${initialReadCount + 3}`),
          "the file was read correctly"
        );
        let buffer = await readStream(await file.getReadbleStream());
        assert.deepEqual(
          buffer,
          new TextEncoder().encode(`fetch ${initialReadCount + 4}`),
          "the file was read correctly"
        );
        assert.equal(
          (stubbedFetch as any).bodyReadCount,
          4,
          "the file is read the correct amount of times"
        );
      });

      test("can read the web server root as a file", async function (assert) {
        let file = (await await assert.fs.open(
          new URL(origin)
        )) as FileDescriptor;
        assert.equal(
          await file.readText(),
          "foo",
          "the file was read correctly"
        );
      });

      test("can read a buffer from a file", async function (assert) {
        let file = await openFile(assert.fs);
        assert.deepEqual(
          await file.read(),
          new TextEncoder().encode("Hello World"),
          "the file was read correctly"
        );
      });

      test("can read a stream from a file", async function (assert) {
        let file = await openFile(assert.fs);
        let buffer = await readStream(await file.getReadbleStream());
        assert.deepEqual(
          buffer,
          new TextEncoder().encode("Hello World"),
          "the file was read correctly"
        );
      });
    });

    QUnit.module("write", function () {
      test("can write to a file with a string", async function (assert) {
        let file = await openFile(assert.fs);
        await file.write("blah");
        assert.file("/foo/bar").matches(/blah/);
      });

      test("can write to a file with a buffer", async function (assert) {
        let file = await openFile(assert.fs);
        let buffer = new TextEncoder().encode("bleep");
        await file.write(buffer);
        assert.file("/foo/bar").matches(/bleep/);
      });

      test("can write to a file with a stream", async function (assert) {
        let file = await openFile(assert.fs);
        let buffer = new TextEncoder().encode("blurp");
        let stream = new ReadableStream({
          async start(controller: ReadableStreamDefaultController) {
            if (!buffer) {
              controller.close();
            } else {
              controller.enqueue(new Uint8Array(buffer));
              controller.close();
            }
          },
        });

        await file.write(stream);
        assert.file("/foo/bar").matches(/blurp/);
      });
    });

    QUnit.module("stat", function () {
      test("can get type from stat of file", async function (assert) {
        let file = await openFile(assert.fs);
        assert.equal((await file.stat()).type, "file", "stat value is correct");
      });

      test("can get etag from stat of file", async function (assert) {
        let file = await openFile(assert.fs);
        let stat = await file.stat();
        assert.equal(stat.etag, `abc123`, "stat value is correct");
      });

      test("can get size from stat of file", async function (assert) {
        let file = await openFile(assert.fs);
        assert.equal((await file.stat()).size, 11, "stat value is correct");
      });

      test("can get mtime from stat of file", async function (assert) {
        let file = await openFile(assert.fs);
        assert.equal(
          (await file.stat()).mtime,
          1589655000000,
          "mtime is correct"
        );
      });
    });
  });

  QUnit.module("remove", function (hooks) {
    let isDeleted: boolean;
    hooks.beforeEach(async () => {
      isDeleted = false;

      stubbedFetch = stubFetch([
        {
          method: "GET",
          url: `${webServerHref}/test/a.txt`,
          async response() {
            return {
              status: isDeleted ? 404 : 200,
              body: isDeleted ? "Not Found" : "Hello World",
            };
          },
        },
        {
          method: "DELETE",
          url: `${webServerHref}/test/a.txt`,
          async response() {
            isDeleted = true;
            return {
              status: 204,
            };
          },
        },
      ]);
    });

    test("it throws when removing a file", async function (assert) {
      try {
        await assert.fs.remove(url("/test/a.txt"));
      } catch (e) {
        assert.equal(
          Boolean(e.message.match(/Unimplemented/)),
          true,
          "error message is correct"
        );
      }
      await assert.file("/test/a.txt").exists();
    });
  });

  QUnit.module("mounting", function (hooks) {
    let webA = "http://a.org";
    let webB = "http://b.org";

    hooks.beforeEach(async () => {
      stubbedFetch = stubFetch([
        {
          method: "GET",
          url: `${webA}/foo/bar`,
          response: {
            status: 200,
            body: "bar",
          },
        },
        {
          method: "GET",
          url: `${webB}/bleep/blurp`,
          response: {
            status: 200,
            body: "blurp",
          },
        },
      ]);
    });

    test("it can mount a volume within another volume", async function (assert) {
      let driverA = new HttpFileSystemDriver(url(webA));
      let driverB = new HttpFileSystemDriver(url(webB));
      await assert.fs.mount(url("/driverA/"), driverA);
      await assert.fs.mount(url("/driverA/foo/driverB/"), driverB);

      await assert.file("/driverA/foo/bar").matches("bar");
      await assert.file("/driverA/foo/driverB/bleep/blurp").matches("blurp");
    });
  });

  QUnit.module("events", function (hooks) {
    let isDeleted: boolean;
    let testFileContents: string;

    hooks.beforeEach(async () => {
      testFileContents = "Hello World";
      isDeleted = false;

      stubbedFetch = stubFetch([
        {
          method: "GET",
          url: `${webServerHref}/test`,
          async response() {
            return {
              status: isDeleted ? 404 : 200,
              body: isDeleted ? "Not Found" : "Hello World",
            };
          },
        },
        {
          method: "DELETE",
          url: `${webServerHref}/test`,
          async response() {
            isDeleted = true;
            return {
              status: 204,
            };
          },
        },
        {
          method: "GET",
          url: `${webServerHref}/foo/bar`,
          response() {
            return Promise.resolve({
              status: 200,
              body: testFileContents,
              headers: {
                ETag: "abc123",
                "Last-Modified": `${moment("2020-05-16T18:50:00 Z")
                  .utc()
                  .format("ddd, DD MMM YYYY HH:mm:ss")} GMT`,
              },
            });
          },
        },
        {
          method: "PUT",
          url: `${webServerHref}/foo/bar`,
          async response(_url, request) {
            if (!request?.body) {
              throw new Error(`request missing body`);
            }
            let body = utf8.decode((request.body as unknown) as Uint8Array);
            testFileContents = body;
            return {
              status: 200,
              body,
            };
          },
        },
      ]);
    });

    test("triggers a 'write' event when a file is written to", async function (assert) {
      assert.expect(2);
      let file = (await assert.fs.open(url("foo/bar"), true)) as FileDescriptor;
      let listener = (e: Event) => {
        if ("filesystem" in e) {
          assert.equal(
            e.filesystem!.href,
            `${origin}/foo/bar`,
            "the event url is correct"
          );
          assert.equal(
            e.filesystem!.type,
            "write",
            "the event type is correct"
          );
        }
      };
      await withListener(listener, async () => {
        await file.write("blah");
        await flushEvents();
      });
    });
  });
});
