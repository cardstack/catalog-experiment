import { default as createWrap } from "./dist/23.js";
var WRAP_CURRY_FLAG = 8;
function curry(func, arity, guard) {
  arity = guard ? undefined : arity;
  var result = createWrap(func, WRAP_CURRY_FLAG, undefined, undefined, undefined, undefined, undefined, arity);
  result.placeholder = curry.placeholder;
  return result;
}
curry.placeholder = {};
export { curry as default };
/*====catalogjs annotation start====
k5GVwqwuL2Rpc3QvMjMuanMDwsCBp2RlZmF1bHSVoWylY3VycnkQwMDcABKXoW8AAAPAkQ3AmaFkCQACwJECwMKZoWmqY3JlYXRlV3JhcJICCsAAp2RlZmF1bHTAwMCYoXILCsDAkQHAwpyhaQAXAQSQwMIAwsDAl6FvAQAFD5DAmKFnAAEGCJDAwpmhZAQEB8CSBwXAwpmhbK9XUkFQX0NVUlJZX0ZMQUeSBwvAwMAFkNlFV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2N1cnJ5LmpzmKFyAA/AwJEGwMKZoWQBIAkNlQoLCQwGwMKZoWylY3VycnmUCQwOEcDAwMCRDdlFV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2N1cnJ5LmpzmKFyCQXACpEIwMKYoXJLCsALkQHAwpihcgcPwAyRBsDCmKFyWAXAwJEIwMKYoWcBEg7AkQ7Aw5ihcgAFwMCRCMDCmKFnAQMQwJDAwpihZwkLEcCREcDCmKFyAAXAwJEIwMI=
====catalogjs annotation end====*/