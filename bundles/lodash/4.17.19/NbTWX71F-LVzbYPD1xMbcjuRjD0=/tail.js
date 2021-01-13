import { default as baseSlice } from "./dist/142.js";
function tail(array) {
  var length = array == null ? 0 : array.length;
  return length ? baseSlice(array, 1, length) : [];
}
export { tail as default };
/*====catalogjs annotation start====
k5GVwq0uL2Rpc3QvMTQyLmpzA8LAgadkZWZhdWx0lKFspHRhaWwJwJuXoW8AAAPAkQXAmaFkCQACwJECwMKYoWmpYmFzZVNsaWNlkgIHwACnZGVmYXVsdMDAmKFyCwnAwJEBwMKcoWkAGAEEkMDCAMLAwJehbwEABQiQwJmhZAAaBsCSBwbAwpihbKR0YWlskgYKwMDAwNlEV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3RhaWwuanOYoXIJBMAHkQXAwpihck0JwMCRAcDCmKFnAQMJwJDAwpihZwkLCsCRCsDCmKFyAATAwJEFwMI=
====catalogjs annotation end====*/