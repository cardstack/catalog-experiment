import { default as createWrap } from "./dist/23.js";
var WRAP_CURRY_RIGHT_FLAG = 16;
function curryRight(func, arity, guard) {
  arity = guard ? undefined : arity;
  var result = createWrap(func, WRAP_CURRY_RIGHT_FLAG, undefined, undefined, undefined, undefined, undefined, arity);
  result.placeholder = curryRight.placeholder;
  return result;
}
curryRight.placeholder = {};
export { curryRight as default };
/*====catalogjs annotation start====
k5GVwqwuL2Rpc3QvMjMuanMDwsCBp2RlZmF1bHSVoWyqY3VycnlSaWdodBDAwNwAEpehbwAAA8CRDcCZoWQJAALAkQLAwpmhaapjcmVhdGVXcmFwkgIKwACnZGVmYXVsdMDAwJihcgsKwMCRAcDCnKFpABcBBJDAwgDCwMCXoW8BAAUPkMCYoWcAAQYIkMDCmaFkBAUHwJIHBcDCmaFstVdSQVBfQ1VSUllfUklHSFRfRkxBR5IHC8DAwAWQ2UpXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvY3VycnlSaWdodC5qc5ihcgAVwMCRBsDCmaFkASAJDZUKCwkMBsDCmaFsqmN1cnJ5UmlnaHSUCQwOEcDAwMCRDdlKV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2N1cnJ5UmlnaHQuanOYoXIJCsAKkQjAwpihcksKwAuRAcDCmKFyBxXADJEGwMKYoXJYCsDAkQjAwpihZwESDsCRDsDDmKFyAArAwJEIwMKYoWcBAxDAkMDCmKFnCQsRwJERwMKYoXIACsDAkQjAwg==
====catalogjs annotation end====*/