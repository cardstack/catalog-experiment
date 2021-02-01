import { default as baseSlice } from "./dist/142.js";
import { default as toInteger } from "./toInteger.js";
function dropRight(array, n, guard) {
  var length = array == null ? 0 : array.length;

  if (!length) {
    return [];
  }

  n = guard || n === undefined ? 1 : toInteger(n);
  n = length - n;
  return baseSlice(array, 0, n < 0 ? 0 : n);
}
export { dropRight as default };
/*====catalogjs annotation start====
k5KVwq0uL2Rpc3QvMTQyLmpzA8LAlcKuLi90b0ludGVnZXIuanMGwsCBp2RlZmF1bHSUoWypZHJvcFJpZ2h0DcCfl6FvAAADwJDAmaFkCQACwJECwMKYoWmpYmFzZVNsaWNlkgILwACnZGVmYXVsdMDAmKFyCwnAwJEBwMKcoWkAGAEGkMDCAMLAwJmhZAkABcCRBcDCmKFpqXRvSW50ZWdlcpIFCsABp2RlZmF1bHTAwJihcgsJwMCRBMDCnKFpARkEB5DAwgHCwMCXoW8BAAgMkMCZoWQAHAnAkwoLCcDCmKFsqWRyb3BSaWdodJIJDsDAwMDZSVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9kcm9wUmlnaHQuanOYoXIJCcAKkQjAwpihcsyQCcALkQTAwpihciAJwMCRAcDCmKFnAQMNwJDAwpihZwkLDsCRDsDCmKFyAAnAwJEIwMI=
====catalogjs annotation end====*/