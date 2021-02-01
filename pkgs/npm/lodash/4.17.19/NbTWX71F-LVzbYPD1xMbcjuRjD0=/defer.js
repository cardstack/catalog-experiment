import { default as baseDelay } from "./dist/161.js";
import { default as baseRest } from "./dist/49.js";
var defer = baseRest(function (func, args) {
  return baseDelay(func, 1, args);
});
export { defer as default };
/*====catalogjs annotation start====
k5KVwq0uL2Rpc3QvMTYxLmpzA8LAlcKsLi9kaXN0LzQ5LmpzBsLAgadkZWZhdWx0lKFspWRlZmVyD8DcABGXoW8AAAPAkQnAmaFkCQACwJECwMKYoWmpYmFzZURlbGF5kgINwACnZGVmYXVsdMDAmKFyCwnAwJEBwMKcoWkAGAEGkMDCAMLAwJmhZAkABcCRBcDCmKFpqGJhc2VSZXN0kgUMwAGnZGVmYXVsdMDAmKFyCwjAwJEEwMKcoWkBFwQHkMDCAcLAwJehbwEACA6QwJihZwABCcCQwMKZoWQEAArAkwoIC8DCmKFspWRlZmVykgoQwMDACNlFV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2RlZmVyLmpzmKFyAAXAC5EJwMKYoWcDEwzAkgwNwMKYoXIACMANkQTAwpihciIJwMCRAcDCmKFnAQMPwJDAwpihZwkLEMCREMDCmKFyAAXAwJEJwMI=
====catalogjs annotation end====*/