import { default as baseFindIndex } from "./dist/124.js";
import { default as baseIteratee } from "./dist/6.js";
import { default as toInteger } from "./toInteger.js";
var nativeMax = Math.max;
function findIndex(array, predicate, fromIndex) {
  var length = array == null ? 0 : array.length;

  if (!length) {
    return -1;
  }

  var index = fromIndex == null ? 0 : toInteger(fromIndex);

  if (index < 0) {
    index = nativeMax(length + index, 0);
  }

  return baseFindIndex(array, baseIteratee(predicate, 3), index);
}
export { findIndex as default };
/*====catalogjs annotation start====
k5OVwq0uL2Rpc3QvMTI0LmpzA8LAlcKrLi9kaXN0LzYuanMGwsCVwq4uL3RvSW50ZWdlci5qcwnCwIGnZGVmYXVsdJShbKlmaW5kSW5kZXgVwNwAF5ehbwAAA8CRDsCZoWQJAALAkQLAwpihaa1iYXNlRmluZEluZGV4kgISwACnZGVmYXVsdMDAmKFyCw3AwJEBwMKcoWkAGAEGkMDCAMLAwJmhZAkABcCRBcDCmKFprGJhc2VJdGVyYXRlZZIFE8ABp2RlZmF1bHTAwJihcgsMwMCRBMDCnKFpARYECZDAwgHCwMCZoWQJAAjAkQjAwpihaal0b0ludGVnZXKSCBDAAqdkZWZhdWx0wMCYoXILCcDAkQfAwpyhaQEZBwqQwMICwsDAl6FvAQALFJDAmKFnAAEMDpDAwpmhZAQLDcCSDQvAwpihbKluYXRpdmVNYXiSDRHAwMAL2UlXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvZmluZEluZGV4LmpzmKFyAAnAwJEMwMKZoWQBGQ/AlhAREhMPDMDCmKFsqWZpbmRJbmRleJIPFsDAwMDZSVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9maW5kSW5kZXguanOYoXIJCcAQkQ7AwpihcsydCcARkQfAwpihci0JwBKRDMDCmKFyIw3AE5EBwMKYoXIIDMDAkQTAwpihZwEDFcCQwMKYoWcJCxbAkRbAwpihcgAJwMCRDsDC
====catalogjs annotation end====*/