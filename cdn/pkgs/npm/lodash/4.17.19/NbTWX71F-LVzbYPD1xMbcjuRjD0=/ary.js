import { default as createWrap } from "./dist/23.js";
var WRAP_ARY_FLAG = 128;
function ary(func, n, guard) {
  n = guard ? undefined : n;
  n = func && n == null ? func.length : n;
  return createWrap(func, WRAP_ARY_FLAG, undefined, undefined, undefined, undefined, n);
}
export { ary as default };
/*====catalogjs annotation start====
k5GVwqwuL2Rpc3QvMjMuanMDwsCBp2RlZmF1bHSVoWyjYXJ5DcDAn5ehbwAAA8CQwJmhZAkAAsCRAsDCmaFpqmNyZWF0ZVdyYXCSAgrAAKdkZWZhdWx0wMDAmKFyCwrAwJEBwMKcoWkAFwEEkMDCAMLAwJehbwEABQyQwJihZwABBgiQwMKZoWQEBgfAkgcFwMKZoWytV1JBUF9BUllfRkxBR5IHC8DAwAWQ2UNXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvYXJ5LmpzmKFyAA3AwJEGwMKZoWQBMwnAlAoLCQbAwpmhbKNhcnmSCQ7AwMDAkNlDV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2FyeS5qc5ihcgkDwAqRCMDCmKFyZArAC5EBwMKYoXIHDcDAkQbAwpihZwEDDcCQwMKYoWcJCw7AkQ7AwpihcgADwMCRCMDC
====catalogjs annotation end====*/