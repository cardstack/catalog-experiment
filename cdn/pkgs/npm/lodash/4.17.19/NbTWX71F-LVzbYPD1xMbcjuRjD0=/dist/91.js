import { default as Uint8Array0 } from "./92.js";
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array0(result).set(new Uint8Array0(arrayBuffer));
  return result;
}
export { cloneArrayBuffer as default };
/*====catalogjs annotation start====
k5GVwqcuLzkyLmpzA8LAgadkZWZhdWx0laFssGNsb25lQXJyYXlCdWZmZXIKwMCcl6FvAAADwJDAmaFkCQACwJECwMKZoWmrVWludDhBcnJheTCTAgcIwACnZGVmYXVsdMDAwJihcgsLwMCRAcDCnKFpABIBBJDAwgDCwMCXoW8BAAUJkMCZoWQAIgbAkwcIBsDCmaFssGNsb25lQXJyYXlCdWZmZXKSBgvAwMDAkNlRV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19jbG9uZUFycmF5QnVmZmVyLmpzmKFyCRDAB5EFwMKYoXJaC8AIkQHAwpihchELwMCRAcDCmKFnAQMKwJDAwpihZwkLC8CRC8DCmKFyABDAwJEFwMI=
====catalogjs annotation end====*/