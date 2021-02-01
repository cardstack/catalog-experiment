import { default as baseIndexOf } from "./dist/123.js";
import { default as toInteger } from "./toInteger.js";
var nativeMax = Math.max;
function indexOf(array, value, fromIndex) {
  var length = array == null ? 0 : array.length;

  if (!length) {
    return -1;
  }

  var index = fromIndex == null ? 0 : toInteger(fromIndex);

  if (index < 0) {
    index = nativeMax(length + index, 0);
  }

  return baseIndexOf(array, value, index);
}
export { indexOf as default };
/*====catalogjs annotation start====
k5KVwq0uL2Rpc3QvMTIzLmpzA8LAlcKuLi90b0ludGVnZXIuanMGwsCBp2RlZmF1bHSUoWynaW5kZXhPZhHA3AATl6FvAAADwJDAmaFkCQACwJECwMKYoWmrYmFzZUluZGV4T2aSAg/AAKdkZWZhdWx0wMCYoXILC8DAkQHAwpyhaQAYAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmpdG9JbnRlZ2VykgUNwAGnZGVmYXVsdMDAmKFyCwnAwJEEwMKcoWkBGQQHkMDCAcLAwJehbwEACBCQwJihZwABCQuQwMKZoWQECwrAkgoIwMKYoWypbmF0aXZlTWF4kgoOwMDACNlHV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2luZGV4T2YuanOYoXIACcDAkQnAwpmhZAEYDMCVDQ4PDAnAwpihbKdpbmRleE9mkgwSwMDAwNlHV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2luZGV4T2YuanOYoXIJB8ANkQvAwpihcsyZCcAOkQTAwpihci0JwA+RCcDCmKFyIwvAwJEBwMKYoWcBAxHAkMDCmKFnCQsSwJESwMKYoXIAB8DAkQvAwg==
====catalogjs annotation end====*/