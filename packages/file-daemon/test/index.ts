//@ts-ignore not actually redefining block-scoped var, the esmRequire in bin/build.ts  is not used in the testing context
const esmRequire = require("esm")(module, { cjs: true });
esmRequire("./liveness-test");
esmRequire("./file-hosting-test");
