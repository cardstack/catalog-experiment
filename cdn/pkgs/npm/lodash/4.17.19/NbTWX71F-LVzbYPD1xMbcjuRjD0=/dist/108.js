import { default as identity } from "../identity.js";
function castFunction(value) {
  return typeof value == 'function' ? value : identity;
}
export { castFunction as default };
/*====catalogjs annotation start====
k5GVwq4uLi9pZGVudGl0eS5qcwPCwIGnZGVmYXVsdJWhbKxjYXN0RnVuY3Rpb24JwMCbl6FvAAADwJDAmaFkCQACwJECwMKZoWmoaWRlbnRpdHmSAgfAAKdkZWZhdWx0wMDAmKFyCwjAwJEBwMKcoWkAGQEEkMDCAMLAwJehbwEABQiQwJmhZAADBsCSBwbAwpmhbKxjYXN0RnVuY3Rpb26SBgrAwMDAkNlNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19jYXN0RnVuY3Rpb24uanOYoXIJDMAHkQXAwpihcjgIwMCRAcDCmKFnAQMJwJDAwpihZwkLCsCRCsDCmKFyAAzAwJEFwMI=
====catalogjs annotation end====*/