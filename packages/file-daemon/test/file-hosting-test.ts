import { serveFiles } from "../file-hosting-server";
import request from "supertest";
import Project from "fixturify-project";
import merge from "lodash/merge";
import Koa from "koa";
import { ProjectMapping } from "../daemon";

const { test } = QUnit;

QUnit.module("file-hosting", function (hooks) {
  let project: Project;
  hooks.before(function () {
    project = new Project("fixtures");
    merge(project.files, {
      "test-app": {
        "index.html": "<html></html>",
      },
      vendor: {
        "test-lib": {
          src: {
            "index.js": "export {}",
          },
        },
      },
      "other.js": "//extra file",
    });
    project.writeSync();
  });

  hooks.after(function () {
    project.dispose();
  });

  test("serves files from your mounted directories", async function (assert) {
    let app = new Koa();
    app.use(
      serveFiles(
        new ProjectMapping([
          `${project.root}/fixtures/test-app`,
          `${project.root}/fixtures/vendor/test-lib`,
        ])
      )
    );
    let response = await request(app.callback()).get(
      "/catalogjs/files/test-lib/src/index.js"
    );
    assert.equal(response.status, 200);
    assert.equal(response.text, "export {}");
    response = await request(app.callback()).get(
      "/catalogjs/files/test-app/index.html"
    );
    assert.equal(response.status, 200);
    assert.equal(response.text, "<html></html>");
  });
});
