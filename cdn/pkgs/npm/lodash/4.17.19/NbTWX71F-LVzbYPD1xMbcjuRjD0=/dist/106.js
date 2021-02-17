import { default as isObject } from "../isObject.js";
var objectCreate = Object.create;
var baseCreate = function () {
  function object() {}

  return function (proto) {
    if (!isObject(proto)) {
      return {};
    }

    if (objectCreate) {
      return objectCreate(proto);
    }

    object.prototype = proto;
    var result = new object();
    object.prototype = undefined;
    return result;
  };
}();
export { baseCreate as default };
/*====catalogjs annotation start====
k5GVwq4uLi9pc09iamVjdC5qcwPCwIGnZGVmYXVsdJWhbKpiYXNlQ3JlYXRlEcDA3AATl6FvAAADwJEKwJmhZAkAAgSRAsDCmaFpqGlzT2JqZWN0kgINwACnZGVmYXVsdMDAwJihcgsIwMCRAcDCnKFpAAEBBZEEwMIAwsDAmKFnCBDAwJDAwpehbwEABhCQwJihZwABBwmQwMKZoWQEEAjAkggGwMKZoWysb2JqZWN0Q3JlYXRlkwgOD8DAwAaQ2UtXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VDcmVhdGUuanOYoXIADMDAkQfAwpihZwEBCsCQwMKZoWQEAAvAlAsJDAfAwpmhbKpiYXNlQ3JlYXRlkgsSwMDACZDZS1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZUNyZWF0ZS5qc5ihcgAKwAyRCsDCmKFnA8yKDcCTDQ4PwMKYoXJLCMAOkQHAwpihcisMwA+RB8DCmKFyEQzAwJEHwMKYoWcBAxHAkMDCmKFnCQsSwJESwMKYoXIACsDAkQrAwg==
====catalogjs annotation end====*/