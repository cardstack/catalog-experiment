import { default as baseClone } from "./dist/40.js";
var CLONE_SYMBOLS_FLAG = 4;
function cloneWith(value, customizer) {
  customizer = typeof customizer == 'function' ? customizer : undefined;
  return baseClone(value, CLONE_SYMBOLS_FLAG, customizer);
}
export { cloneWith as default };
/*====catalogjs annotation start====
k5GVwqwuL2Rpc3QvNDAuanMDwsCBp2RlZmF1bHSVoWypY2xvbmVXaXRoDcDAn5ehbwAAA8CQwJmhZAkAAsCRAsDCmaFpqWJhc2VDbG9uZZICCsAAp2RlZmF1bHTAwMCYoXILCcDAkQHAwpyhaQAXAQSQwMIAwsDAl6FvAQAFDJDAmKFnAAEGCJDAwpmhZAQEB8CSBwXAwpmhbLJDTE9ORV9TWU1CT0xTX0ZMQUeSBwvAwMAFkNlJV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2Nsb25lV2l0aC5qc5ihcgASwMCRBsDCmaFkARAJwJQKCwkGwMKZoWypY2xvbmVXaXRokgkOwMDAwJDZSVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9jbG9uZVdpdGguanOYoXIJCcAKkQjAwpihcmgJwAuRAcDCmKFyCBLAwJEGwMKYoWcBAw3AkMDCmKFnCQsOwJEOwMKYoXIACcDAkQjAwg==
====catalogjs annotation end====*/