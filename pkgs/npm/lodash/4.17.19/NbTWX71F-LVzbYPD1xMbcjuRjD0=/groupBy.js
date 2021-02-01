import { default as baseAssignValue } from "./dist/56.js";
import { default as createAggregator } from "./dist/2.js";
var objectProto = Object.prototype;
var hasOwnProperty = objectProto.hasOwnProperty;
var groupBy = createAggregator(function (result, value, key) {
  if (hasOwnProperty.call(result, key)) {
    result[key].push(value);
  } else {
    baseAssignValue(result, key, [value]);
  }
});
export { groupBy as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvNTYuanMDwsCVwqsuL2Rpc3QvMi5qcwbCwIGnZGVmYXVsdJShbKdncm91cEJ5F8DcABmXoW8AAAPAkRDAmaFkCQACwJECwMKYoWmvYmFzZUFzc2lnblZhbHVlkgIVwACnZGVmYXVsdMDAmKFyCw/AwJEBwMKcoWkAFwEGkMDCAMLAwJmhZAkABcCRBcDCmKFpsGNyZWF0ZUFnZ3JlZ2F0b3KSBRPAAadkZWZhdWx0wMCYoXILEMDAkQTAwpyhaQEWBAeQwMIBwsDAl6FvAQAIFpDAmKFnAAEJC5DAwpmhZAQTCsCSCgjAwpihbKtvYmplY3RQcm90b5IKDsDAwAjZR1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9ncm91cEJ5LmpzmKFyAAvAwJEJwMKYoWcBAQwPkMDCmaFkBA8NwJQODQsJwMKYoWyuaGFzT3duUHJvcGVydHmSDRTAwMAL2UdXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvZ3JvdXBCeS5qc5ihcgAOwA6RDMDCmKFyAwvAwJEJwMKYoWcBARDAkMDCmaFkBAARwJQRDxIMwMKYoWynZ3JvdXBCeZIRGMDAwA/ZR1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9ncm91cEJ5LmpzmKFyAAfAEpEQwMKYoWcDHhPAkxMUFcDCmKFyABDAFJEEwMKYoXInDsAVkQzAwpihckIPwMCRAcDCmKFnAQMXwJDAwpihZwkLGMCRGMDCmKFyAAfAwJEQwMI=
====catalogjs annotation end====*/