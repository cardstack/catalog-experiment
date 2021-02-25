import { default as realNames } from "./116.js";
var objectProto = Object.prototype;
var hasOwnProperty0 = objectProto.hasOwnProperty;
function getFuncName(func) {
  var result = func.name + '',
      array = realNames[result],
      length = hasOwnProperty0.call(realNames, result) ? array.length : 0;

  while (length--) {
    var data = array[length],
        otherFunc = data.func;

    if (otherFunc == null || otherFunc == func) {
      return data.name;
    }
  }

  return result;
}
export { getFuncName as default };
/*====catalogjs annotation start====
k5GVwqguLzExNi5qcwPCwIGnZGVmYXVsdJWhbKtnZXRGdW5jTmFtZRPAwNwAFZehbwAAA8CQwJmhZAkAAgSRAsDCmaFpqXJlYWxOYW1lc5MCDxHAAKdkZWZhdWx0wMDAmKFyCwnAwJEBwMKcoWkAAQEFkQTAwgDCwMCYoWcICsDAkMDCl6FvAQAGEpDAmKFnAAEHCZDAwpmhZAQTCMCSCAbAwpmhbKtvYmplY3RQcm90b5IIDMDAwAaQ2UxXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2dldEZ1bmNOYW1lLmpzmKFyAAvAwJEHwMKYoWcBAQoNkMDCmaFkBA8LwJQMCwkHwMKZoWyvaGFzT3duUHJvcGVydHkwkgsQwMDACZDZTFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fZ2V0RnVuY05hbWUuanOYoXIAD8AMkQrAwpihcgMLwMCRB8DCmaFkAczZDsCVDxARDgrAwpmhbKtnZXRGdW5jTmFtZZIOFMDAwMCQ2UxXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2dldEZ1bmNOYW1lLmpzmKFyCQvAD5ENwMKYoXI2CcAQkQHAwpihchkPwBGRCsDCmKFyBgnAwJEBwMKYoWcBAxPAkMDCmKFnCQsUwJEUwMKYoXIAC8DAkQ3Awg==
====catalogjs annotation end====*/