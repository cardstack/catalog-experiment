import { default as baseSlice } from "./dist/142.js";
import { default as isIterateeCall } from "./dist/70.js";
import { default as toInteger } from "./toInteger.js";
function slice(array, start, end) {
  var length = array == null ? 0 : array.length;

  if (!length) {
    return [];
  }

  if (end && typeof end != 'number' && isIterateeCall(array, start, end)) {
    start = 0;
    end = length;
  } else {
    start = start == null ? 0 : toInteger(start);
    end = end === undefined ? length : toInteger(end);
  }

  return baseSlice(array, start, end);
}
export { slice as default };
/*====catalogjs annotation start====
k5OVwq0uL2Rpc3QvMTQyLmpzA8LAlcKsLi9kaXN0LzcwLmpzB8LAlcKuLi90b0ludGVnZXIuanMLwsCBp2RlZmF1bHSVoWylc2xpY2UVwMDcABeXoW8AAAPAkMCZoWQJAAIEkQLAwpmhaaliYXNlU2xpY2WSAhPAAKdkZWZhdWx0wMDAmKFyCwnAwJEBwMKcoWkAAQEHkQTAwgDCwMCYoWcID8DAkMDCmaFkCQAGCJEGwMKZoWmuaXNJdGVyYXRlZUNhbGySBhDAAadkZWZhdWx0wMDAmKFyCw7AwJEFwMKcoWkBAQULkQjAwgHCwMCYoWcIDsDAkMDCmaFkCQAKDJEKwMKZoWmpdG9JbnRlZ2VykwoREsACp2RlZmF1bHTAwMCYoXILCcDAkQnAwpyhaQEBCQ2RDMDCAsLAwJihZwgQwMCQwMKXoW8BAA4UkMCZoWQAFg/AlRAREhMPwMKZoWylc2xpY2WSDxbAwMDAkNlFV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3NsaWNlLmpzmKFyCQXAEJEOwMKYoXLMlA7AEZEFwMKYoXJjCcASkQnAwpihcjAJwBORCcDCmKFyFQnAwJEBwMKYoWcBAxXAkMDCmKFnCQsWwJEWwMKYoXIABcDAkQ7Awg==
====catalogjs annotation end====*/