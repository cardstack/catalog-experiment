import { default as hasPath } from "./dist/15.js";
function baseHasIn(object, key) {
  return object != null && key in Object(object);
}
function hasIn(object, path) {
  return object != null && hasPath(object, path, baseHasIn);
}
export { hasIn as default };
/*====catalogjs annotation start====
k5GVwqwuL2Rpc3QvMTUuanMDwsCBp2RlZmF1bHSUoWylaGFzSW4NwJ+XoW8AAAPAkMCZoWQJAALAkQLAwpihaadoYXNQYXRokgIKwACnZGVmYXVsdMDAmKFyCwfAwJEBwMKcoWkAFwEEkMDCAMLAwJehbwEABQeQwJmhZABDBsCRBsDCmKFsqWJhc2VIYXNJbpIGC8DAwMDZSlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZUhhc0luLmpzmKFyCQnAwJEFwMKXoW8BAAgMkMCZoWQABAnAkwoLCcDCmKFspWhhc0lukgkOwMDAwNlFV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2hhc0luLmpzmKFyCQXACpEIwMKYoXIsB8ALkQHAwpihcg8JwMCRBcDCmKFnAQMNwJDAwpihZwkLDsCRDsDCmKFyAAXAwJEIwMI=
====catalogjs annotation end====*/