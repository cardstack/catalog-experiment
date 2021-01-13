import { default as createWrap } from "./dist/23.js";
var WRAP_ARY_FLAG = 128;
function ary(func, n, guard) {
  n = guard ? undefined : n;
  n = func && n == null ? func.length : n;
  return createWrap(func, WRAP_ARY_FLAG, undefined, undefined, undefined, undefined, n);
}
export { ary as default };
/*====catalogjs annotation start====
k5GVwqwuL2Rpc3QvMjMuanMDwsCBp2RlZmF1bHSUoWyjYXJ5DcCfl6FvAAADwJEIwJmhZAkAAsCRAsDCmKFpqmNyZWF0ZVdyYXCSAgrAAKdkZWZhdWx0wMCYoXILCsDAkQHAwpyhaQAXAQSQwMIAwsDAl6FvAQAFDJDAmKFnAAEGCJDAwpmhZAQGB8CSBwXAwpihbK1XUkFQX0FSWV9GTEFHkgcLwMDABdlDV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2FyeS5qc5ihcgANwMCRBsDCmaFkATMJwJQKCwkGwMKYoWyjYXJ5kgkOwMDAwNlDV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2FyeS5qc5ihcgkDwAqRCMDCmKFyZArAC5EBwMKYoXIHDcDAkQbAwpihZwEDDcCQwMKYoWcJCw7AkQ7AwpihcgADwMCRCMDC
====catalogjs annotation end====*/