const { module, test } = QUnit;
import { getPuppies, getRats } from "../lib.js";

module("lib test bed", function (hooks) {
  test("entrypoint exports are exports of the bundle", async function (assert) {
    // Since this JS is a dep of an HTMLEntrypoint (because it's part of the
    // test.html's deps) importing the all bundle's exports doesn't necessarily
    // prove that the JSEntrypoint logic is working (where all exports of the js
    // entrypoint module are also exports of the bundle). In this case we are
    // importing 2 of the 3 exports. By visual inspection of the built bundle we
    // can see that all the exports are indeed included in the bundle--but I'm
    // unclear how to actually test that and be sure that we aren't actually
    // seeing HTML Entrypoint logic being tested.
    assert.deepEqual(getPuppies(), ["mango", "van gogh"]);
    assert.deepEqual(getRats(), ["pizza rat"]);
  });
});
