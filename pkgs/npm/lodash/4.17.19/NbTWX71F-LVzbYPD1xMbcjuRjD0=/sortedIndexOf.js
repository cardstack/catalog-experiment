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
k5KVwqwuL2Rpc3QvMzAuanMDwsCVwqcuL2VxLmpzBsLAgadkZWZhdWx0lKFsrXNvcnRlZEluZGV4T2YNwJ+XoW8AAAPAkMCZoWQJAALAkQLAwpihaa9iYXNlU29ydGVkSW5kZXiSAgrAAKdkZWZhdWx0wMCYoXILD8DAkQHAwpyhaQAXAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmiZXGSBQvAAadkZWZhdWx0wMCYoXILAsDAkQTAwpyhaQESBAeQwMIBwsDAl6FvAQAIDJDAmaFkAEYJwJMKCwnAwpihbK1zb3J0ZWRJbmRleE9mkgkOwMDAwNlNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3NvcnRlZEluZGV4T2YuanOYoXIJDcAKkQjAwpihcmMPwAuRAcDCmKFyKwLAwJEEwMKYoWcBAw3AkMDCmKFnCQsOwJEOwMKYoXIADcDAkQjAwg==
====catalogjs annotation end====*/