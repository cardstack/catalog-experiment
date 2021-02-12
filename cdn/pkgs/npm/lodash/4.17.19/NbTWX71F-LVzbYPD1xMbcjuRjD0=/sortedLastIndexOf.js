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
k5KVwqwuL2Rpc3QvMzAuanMDwsCVwqcuL2VxLmpzBsLAgadkZWZhdWx0laFssXNvcnRlZExhc3RJbmRleE9mDcDAn5ehbwAAA8CQwJmhZAkAAsCRAsDCmaFpr2Jhc2VTb3J0ZWRJbmRleJICCsAAp2RlZmF1bHTAwMCYoXILD8DAkQHAwpyhaQAXAQaQwMIAwsDAmaFkCQAFwJEFwMKZoWmiZXGSBQvAAadkZWZhdWx0wMDAmKFyCwLAwJEEwMKcoWkBEgQHkMDCAcLAwJehbwEACAyQwJmhZABGCcCTCgsJwMKZoWyxc29ydGVkTGFzdEluZGV4T2aSCQ7AwMDAkNlRV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3NvcnRlZExhc3RJbmRleE9mLmpzmKFyCRHACpEIwMKYoXJjD8ALkQHAwpihciMCwMCRBMDCmKFnAQMNwJDAwpihZwkLDsCRDsDCmKFyABHAwJEIwMI=
====catalogjs annotation end====*/