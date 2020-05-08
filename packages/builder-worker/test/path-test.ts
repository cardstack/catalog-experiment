import { relativeURL } from "../src/path";

const { test } = QUnit;

QUnit.module("path utils", function () {
  QUnit.module("relativeURL", function () {
    test("cross origin", async function (assert) {
      assert.equal(
        relativeURL(
          new URL("http://example.com/foo"),
          new URL("http://elsewhere.com/index.html")
        ),
        undefined
      );
    });
    test("relative to a file in root", async function (assert) {
      assert.equal(
        relativeURL(
          new URL("http://example.com/foo"),
          new URL("http://example.com/index.html")
        ),
        "/foo"
      );
    });
    test("relative to root itself", async function (assert) {
      assert.equal(
        relativeURL(
          new URL("http://example.com/foo"),
          new URL("http://example.com/")
        ),
        "/foo"
      );
    });
    test("siblings", async function (assert) {
      assert.equal(
        relativeURL(
          new URL("http://example.com/foo/bar"),
          new URL("http://example.com/foo/baz")
        ),
        "./bar"
      );
    });
    test("longer source", async function (assert) {
      assert.equal(
        relativeURL(
          new URL("http://example.com/foo/bar"),
          new URL("http://example.com/foo/baz/a/b/c")
        ),
        "../../../bar"
      );
    });
    test("longer destination, source has trailing slash", async function (assert) {
      assert.equal(
        relativeURL(
          new URL("http://example.com/foo/bar/a/b/c"),
          new URL("http://example.com/foo/baz/")
        ),
        "../bar/a/b/c"
      );
    });
    test("longer destination, source has no trailing slash", async function (assert) {
      assert.equal(
        relativeURL(
          new URL("http://example.com/foo/bar/a/b/c"),
          new URL("http://example.com/foo/baz")
        ),
        "./bar/a/b/c"
      );
    });
    test("traverse up to root", async function (assert) {
      assert.equal(
        relativeURL(
          new URL("http://example.com/a/b"),
          new URL("http://example.com/foo/baz")
        ),
        "/a/b"
      );
    });
    test("partially shared path", async function (assert) {
      assert.equal(
        relativeURL(
          new URL("http://example.com/a/b/c"),
          new URL("http://example.com/a/y/z")
        ),
        "../b/c"
      );
    });
  });
});
