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
k5KVwqwuL2Rpc3QvMzAuanMDwsCVwqcuL2VxLmpzB8LAgadkZWZhdWx0laFssXNvcnRlZExhc3RJbmRleE9mD8DA3AARl6FvAAADwJDAmaFkCQACBJECwMKZoWmvYmFzZVNvcnRlZEluZGV4kgIMwACnZGVmYXVsdMDAwJihcgsPwMCRAcDCnKFpAAEBB5EEwMIAwsDAmKFnCA7AwJDAwpmhZAkABgiRBsDCmaFpomVxkgYNwAGnZGVmYXVsdMDAwJihcgsCwMCRBcDCnKFpAQEFCZEIwMIBwsDAmKFnCAnAwJDAwpehbwEACg6QwJmhZABGC8CTDA0LwMKZoWyxc29ydGVkTGFzdEluZGV4T2aSCxDAwMDAkNlRV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3NvcnRlZExhc3RJbmRleE9mLmpzmKFyCRHADJEKwMKYoXJjD8ANkQHAwpihciMCwMCRBcDCmKFnAQMPwJDAwpihZwkLEMCREMDCmKFyABHAwJEKwMI=
====catalogjs annotation end====*/