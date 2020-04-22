#!/usr/bin/env node
const { outputFileSync } = require("fs-extra");
const { existsSync } = require("fs");
const { join } = require("path");
const { randomBytes } = require("crypto");

let keyFile = join(__dirname, "..", ".file-daemon-key");
process.env.FILE_DAEMON_KEY = keyFile;
if (!existsSync(keyFile)) {
  outputFileSync(keyFile, randomBytes(32).toString("base64"));
}
