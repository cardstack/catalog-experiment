/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */

const esmRequire = require("esm")(module, { cjs: true });
module.exports = esmRequire("./daemon").start();
