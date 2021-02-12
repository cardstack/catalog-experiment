import { default as baseFlatten } from "./dist/85.js";
var INFINITY = 1 / 0;
function flattenDeep(array) {
  var length = array == null ? 0 : array.length;
  return length ? baseFlatten(array, INFINITY) : [];
}
export { flattenDeep as default };
/*====catalogjs annotation start====
k5GVwqwuL2Rpc3QvODUuanMDwsCBp2RlZmF1bHSVoWyrZmxhdHRlbkRlZXANwMCfl6FvAAADwJDAmaFkCQACwJECwMKZoWmrYmFzZUZsYXR0ZW6SAgrAAKdkZWZhdWx0wMDAmKFyCwvAwJEBwMKcoWkAFwEEkMDCAMLAwJehbwEABQyQwJihZwABBgiQwMKZoWQECAfAkgcFwMKZoWyoSU5GSU5JVFmSBwvAwMAFkNlLV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2ZsYXR0ZW5EZWVwLmpzmKFyAAjAwJEGwMKZoWQBCQnAlAoLCQbAwpmhbKtmbGF0dGVuRGVlcJIJDsDAwMCQ2UtXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvZmxhdHRlbkRlZXAuanOYoXIJC8AKkQjAwpihck0LwAuRAcDCmKFyCAjAwJEGwMKYoWcBAw3AkMDCmKFnCQsOwJEOwMKYoXIAC8DAkQjAwg==
====catalogjs annotation end====*/