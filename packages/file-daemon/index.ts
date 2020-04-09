#!/usr/bin/env node

/* eslint-disable node/shebang */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */

// web-streams polyfill
const webStreams = require("../../vendor/web-streams");
global = Object.assign(global, webStreams);

const esmRequire = require("esm")(module, { cjs: true });
module.exports = esmRequire("./daemon").start();
