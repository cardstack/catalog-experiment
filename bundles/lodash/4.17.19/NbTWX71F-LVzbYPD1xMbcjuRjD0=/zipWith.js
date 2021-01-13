import { default as baseRest } from "./dist/49.js";
import { default as unzipWith } from "./unzipWith.js";
var zipWith = baseRest(function (arrays) {
  var length = arrays.length,
      iteratee = length > 1 ? arrays[length - 1] : undefined;
  iteratee = typeof iteratee == 'function' ? (arrays.pop(), iteratee) : undefined;
  return unzipWith(arrays, iteratee);
});
export { zipWith as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvNDkuanMDwsCVwq4uL3VuemlwV2l0aC5qcwbCwIGnZGVmYXVsdJShbKd6aXBXaXRoD8DcABGXoW8AAAPAkQnAmaFkCQACwJECwMKYoWmoYmFzZVJlc3SSAgzAAKdkZWZhdWx0wMCYoXILCMDAkQHAwpyhaQAXAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmpdW56aXBXaXRokgUNwAGnZGVmYXVsdMDAmKFyCwnAwJEEwMKcoWkBGQQHkMDCAcLAwJehbwEACA6QwJihZwABCcCQwMKZoWQEAArAkwoIC8DCmKFsp3ppcFdpdGiSChDAwMAI2UdXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvemlwV2l0aC5qc5ihcgAHwAuRCcDCmKFnAxYMwJMMDQnAwpihcgAIwA2RAcDCmKFyzM0JwMCRBMDCmKFnAQMPwJDAwpihZwkLEMCREMDCmKFyAAfAwJEJwMI=
====catalogjs annotation end====*/