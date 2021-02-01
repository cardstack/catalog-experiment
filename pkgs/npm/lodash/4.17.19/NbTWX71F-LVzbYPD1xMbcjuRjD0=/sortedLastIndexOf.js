import { default as baseSortedIndex } from "./dist/30.js";
import { default as eq } from "./eq.js";
function sortedLastIndexOf(array, value) {
  var length = array == null ? 0 : array.length;

  if (length) {
    var index = baseSortedIndex(array, value, true) - 1;

    if (eq(array[index], value)) {
      return index;
    }
  }

  return -1;
}
export { sortedLastIndexOf as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvMzAuanMDwsCVwqcuL2VxLmpzBsLAgadkZWZhdWx0lKFssXNvcnRlZExhc3RJbmRleE9mDcCfl6FvAAADwJDAmaFkCQACwJECwMKYoWmvYmFzZVNvcnRlZEluZGV4kgIKwACnZGVmYXVsdMDAmKFyCw/AwJEBwMKcoWkAFwEGkMDCAMLAwJmhZAkABcCRBcDCmKFpomVxkgULwAGnZGVmYXVsdMDAmKFyCwLAwJEEwMKcoWkBEgQHkMDCAcLAwJehbwEACAyQwJmhZABGCcCTCgsJwMKYoWyxc29ydGVkTGFzdEluZGV4T2aSCQ7AwMDA2VFXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvc29ydGVkTGFzdEluZGV4T2YuanOYoXIJEcAKkQjAwpihcmMPwAuRAcDCmKFyIwLAwJEEwMKYoWcBAw3AkMDCmKFnCQsOwJEOwMKYoXIAEcDAkQjAwg==
====catalogjs annotation end====*/