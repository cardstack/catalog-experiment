import { default as toString0 } from "./toString.js";
var idCounter = 0;
function uniqueId(prefix) {
  var id = ++idCounter;
  return toString0(prefix) + id;
}
export { uniqueId as default };
/*====catalogjs annotation start====
k5GVwq0uL3RvU3RyaW5nLmpzA8LAgadkZWZhdWx0laFsqHVuaXF1ZUlkDcDAn5ehbwAAA8CQwJmhZAkAAsCRAsDCmaFpqXRvU3RyaW5nMJICC8AAp2RlZmF1bHTAwMCYoXILCcDAkQHAwpyhaQAYAQSQwMIAwsDAl6FvAQAFDJDAmKFnAAEGCJDAwpmhZAQEB8CSBwXAwpmhbKlpZENvdW50ZXKSBwrAwMAFkNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3VuaXF1ZUlkLmpzmKFyAAnAwJEGwMKZoWQBEAnAlAoLCQbAwpmhbKh1bmlxdWVJZJIJDsDAwMCQ2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvdW5pcXVlSWQuanOYoXIJCMAKkQjAwpihchgJwAuRBsDCmKFyCwnAwJEBwMKYoWcBAw3AkMDCmKFnCQsOwJEOwMKYoXIACMDAkQjAwg==
====catalogjs annotation end====*/