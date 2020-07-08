import { server } from "../daemon";
import request from "supertest";
const { test } = QUnit;

QUnit.module("liveness endpoint", function () {
  test("responds", async function (assert) {
    let app = server({ directories: [] });
    let response = await request(app.callback()).get("/catalogjs/alive");
    assert.equal(response.status, 200);
    assert.equal(response.get("access-control-allow-origin"), "*");
  });
});
