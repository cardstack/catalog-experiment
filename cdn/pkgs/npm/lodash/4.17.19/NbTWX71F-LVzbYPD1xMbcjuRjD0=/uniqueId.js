import { default as toString0 } from "./toString.js";
var idCounter = 0;
function uniqueId(prefix) {
  var id = ++idCounter;
  return toString0(prefix) + id;
}
export { uniqueId as default };
/*====catalogjs annotation start====
k5GVwq0uL3RvU3RyaW5nLmpzA8LAgadkZWZhdWx0laFsqHVuaXF1ZUlkDsDA3AAQl6FvAAADwJDAmaFkCQACBJECwMKZoWmpdG9TdHJpbmcwkgIMwACnZGVmYXVsdMDAwJihcgsJwMCRAcDCnKFpAAEBBZEEwMIAwsDAmKFnCA/AwJDAwpehbwEABg2QwJihZwABBwmQwMKZoWQEBAjAkggGwMKZoWypaWRDb3VudGVykggLwMDABpDZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy91bmlxdWVJZC5qc5ihcgAJwMCRB8DCmaFkARAKwJQLDAoHwMKZoWyodW5pcXVlSWSSCg/AwMDAkNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3VuaXF1ZUlkLmpzmKFyCQjAC5EJwMKYoXIYCcAMkQfAwpihcgsJwMCRAcDCmKFnAQMOwJDAwpihZwkLD8CRD8DCmKFyAAjAwJEJwMI=
====catalogjs annotation end====*/