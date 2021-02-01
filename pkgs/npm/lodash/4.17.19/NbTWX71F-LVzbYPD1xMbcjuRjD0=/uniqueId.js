import { default as toString } from "./toString.js";
var idCounter = 0;
function uniqueId(prefix) {
  var id = ++idCounter;
  return toString(prefix) + id;
}
export { uniqueId as default };
/*====catalogjs annotation start====
k5GVwq0uL3RvU3RyaW5nLmpzA8LAgadkZWZhdWx0lKFsqHVuaXF1ZUlkDcCfl6FvAAADwJDAmaFkCQACwJECwMKYoWmodG9TdHJpbmeSAgvAAKdkZWZhdWx0wMCYoXILCMDAkQHAwpyhaQAYAQSQwMIAwsDAl6FvAQAFDJDAmKFnAAEGCJDAwpmhZAQEB8CSBwXAwpihbKlpZENvdW50ZXKSBwrAwMAF2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvdW5pcXVlSWQuanOYoXIACcDAkQbAwpmhZAEQCcCUCgsJBsDCmKFsqHVuaXF1ZUlkkgkOwMDAwNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3VuaXF1ZUlkLmpzmKFyCQjACpEIwMKYoXIYCcALkQbAwpihcgsIwMCRAcDCmKFnAQMNwJDAwpihZwkLDsCRDsDCmKFyAAjAwJEIwMI=
====catalogjs annotation end====*/