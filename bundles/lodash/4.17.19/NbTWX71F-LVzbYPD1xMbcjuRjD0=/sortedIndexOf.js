import { default as baseSortedIndex } from "./dist/30.js";
import { default as eq } from "./eq.js";
function sortedIndexOf(array, value) {
  var length = array == null ? 0 : array.length;

  if (length) {
    var index = baseSortedIndex(array, value);

    if (index < length && eq(array[index], value)) {
      return index;
    }
  }

  return -1;
}
export { sortedIndexOf as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvMzAuanMDwsCVwqcuL2VxLmpzBsLAgadkZWZhdWx0lKFsrXNvcnRlZEluZGV4T2YNwJ+XoW8AAAPAkQjAmaFkCQACwJECwMKYoWmvYmFzZVNvcnRlZEluZGV4kgIKwACnZGVmYXVsdMDAmKFyCw/AwJEBwMKcoWkAFwEGkMDCAMLAwJmhZAkABcCRBcDCmKFpomVxkgULwAGnZGVmYXVsdMDAmKFyCwLAwJEEwMKcoWkBEgQHkMDCAcLAwJehbwEACAyQwJmhZABGCcCTCgsJwMKYoWytc29ydGVkSW5kZXhPZpIJDsDAwMDZTVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9zb3J0ZWRJbmRleE9mLmpzmKFyCQ3ACpEIwMKYoXJjD8ALkQHAwpihcisCwMCRBMDCmKFnAQMNwJDAwpihZwkLDsCRDsDCmKFyAA3AwJEIwMI=
====catalogjs annotation end====*/