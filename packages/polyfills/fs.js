// This is intended to just throw if any of the node fs API functions are
// evaluated. For an actual working node fs polyfill, refer to the polyfill that
// rollup and browserify use: https://github.com/mafintosh/browserify-fs
function throwWhenCalled() {
  throw new Error(`node 'fs' module is not available in the browser context`);
}
export default {
  readFileSync: throwWhenCalled,
  readFile: throwWhenCalled,
  readdirSync: throwWhenCalled,
  readdir: throwWhenCalled,
  readlinkSync: throwWhenCalled,
  readlink: throwWhenCalled,
  read: throwWhenCalled,
  exists: throwWhenCalled,
  existsSync: throwWhenCalled,
  write: throwWhenCalled,
  writeFile: throwWhenCalled,
  writeFileSync: throwWhenCalled,
  stat: throwWhenCalled,
  statSync: throwWhenCalled,
  open: throwWhenCalled,
  openSync: throwWhenCalled,
  opendir: throwWhenCalled,
  opendirSync: throwWhenCalled,
};
