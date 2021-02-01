import { default as baseFlatten } from "./dist/85.js";
function flatten(array) {
  var length = array == null ? 0 : array.length;
  return length ? baseFlatten(array, 1) : [];
}
export { flatten as default };
/*====catalogjs annotation start====
k5GVwqwuL2Rpc3QvODUuanMDwsCBp2RlZmF1bHSUoWynZmxhdHRlbgnAm5ehbwAAA8CQwJmhZAkAAsCRAsDCmKFpq2Jhc2VGbGF0dGVukgIHwACnZGVmYXVsdMDAmKFyCwvAwJEBwMKcoWkAFwEEkMDCAMLAwJehbwEABQiQwJmhZAASBsCSBwbAwpihbKdmbGF0dGVukgYKwMDAwNlHV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2ZsYXR0ZW4uanOYoXIJB8AHkQXAwpihck0LwMCRAcDCmKFnAQMJwJDAwpihZwkLCsCRCsDCmKFyAAfAwJEFwMI=
====catalogjs annotation end====*/