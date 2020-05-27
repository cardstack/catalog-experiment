const esmRequire = require("esm")(module, { cjs: true });
const testHandler = esmRequire("./test-support/test-request-handler");
module.exports = esmRequire("./daemon").start(testHandler.makeTestHandler);
