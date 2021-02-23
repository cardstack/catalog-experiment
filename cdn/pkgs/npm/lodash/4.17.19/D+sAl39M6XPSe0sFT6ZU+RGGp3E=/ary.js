import { default as createWrap } from "./dist/23.js";
var WRAP_ARY_FLAG = 128;
function ary(func, n, guard) {
  n = guard ? undefined : n;
  n = func && n == null ? func.length : n;
  return createWrap(func, WRAP_ARY_FLAG, undefined, undefined, undefined, undefined, n);
}
export { ary as default };
/*====catalogjs annotation start====
k5GVwqwuL2Rpc3QvMjMuanMDwsCBp2RlZmF1bHSVoWyjYXJ5DsDA3AAQl6FvAAADwJDAmaFkCQACBJECwMKZoWmqY3JlYXRlV3JhcJICC8AAp2RlZmF1bHTAwMCYoXILCsDAkQHAwpyhaQABAQWRBMDCAMLAwJihZwgOwMCQwMKXoW8BAAYNkMCYoWcAAQcJkMDCmaFkBAYIwJIIBsDCmaFsrVdSQVBfQVJZX0ZMQUeSCAzAwMAGkNlDV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2FyeS5qc5ihcgANwMCRB8DCmaFkATMKwJQLDAoHwMKZoWyjYXJ5kgoPwMDAwJDZQ1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9hcnkuanOYoXIJA8ALkQnAwpihcmQKwAyRAcDCmKFyBw3AwJEHwMKYoWcBAw7AkMDCmKFnCQsPwJEPwMKYoXIAA8DAkQnAwg==
====catalogjs annotation end====*/