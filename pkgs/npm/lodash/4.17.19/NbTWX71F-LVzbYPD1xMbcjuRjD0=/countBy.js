import { default as baseAssignValue } from "./dist/56.js";
import { default as createAggregator } from "./dist/2.js";
var objectProto = Object.prototype;
var hasOwnProperty = objectProto.hasOwnProperty;
var countBy = createAggregator(function (result, value, key) {
  if (hasOwnProperty.call(result, key)) {
    ++result[key];
  } else {
    baseAssignValue(result, key, 1);
  }
});
export { countBy as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvNTYuanMDwsCVwqsuL2Rpc3QvMi5qcwbCwIGnZGVmYXVsdJShbKdjb3VudEJ5F8DcABmXoW8AAAPAkRDAmaFkCQACwJECwMKYoWmvYmFzZUFzc2lnblZhbHVlkgIVwACnZGVmYXVsdMDAmKFyCw/AwJEBwMKcoWkAFwEGkMDCAMLAwJmhZAkABcCRBcDCmKFpsGNyZWF0ZUFnZ3JlZ2F0b3KSBRPAAadkZWZhdWx0wMCYoXILEMDAkQTAwpyhaQEWBAeQwMIBwsDAl6FvAQAIFpDAmKFnAAEJC5DAwpmhZAQTCsCSCgjAwpihbKtvYmplY3RQcm90b5IKDsDAwAjZR1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9jb3VudEJ5LmpzmKFyAAvAwJEJwMKYoWcBAQwPkMDCmaFkBA8NwJQODQsJwMKYoWyuaGFzT3duUHJvcGVydHmSDRTAwMAL2UdXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvY291bnRCeS5qc5ihcgAOwA6RDMDCmKFyAwvAwJEJwMKYoWcBARDAkMDCmaFkBAARwJQRDxIMwMKYoWynY291bnRCeZIRGMDAwA/ZR1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9jb3VudEJ5LmpzmKFyAAfAEpEQwMKYoWcDGBPAkxMUFcDCmKFyABDAFJEEwMKYoXInDsAVkQzAwpihcjgPwMCRAcDCmKFnAQMXwJDAwpihZwkLGMCRGMDCmKFyAAfAwJEQwMI=
====catalogjs annotation end====*/