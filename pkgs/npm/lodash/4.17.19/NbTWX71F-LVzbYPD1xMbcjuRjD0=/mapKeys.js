import { default as baseAssignValue } from "./dist/56.js";
import { default as baseForOwn } from "./dist/77.js";
import { default as baseIteratee } from "./dist/6.js";
function mapKeys(object, iteratee) {
  var result = {};
  iteratee = baseIteratee(iteratee, 3);
  baseForOwn(object, function (value, key, object) {
    baseAssignValue(result, iteratee(value, key, object), value);
  });
  return result;
}
export { mapKeys as default };
/*====catalogjs annotation start====
k5OVwqwuL2Rpc3QvNTYuanMDwsCVwqwuL2Rpc3QvNzcuanMGwsCVwqsuL2Rpc3QvNi5qcwnCwIGnZGVmYXVsdJShbKdtYXBLZXlzEcDcABOXoW8AAAPAkMCZoWQJAALAkQLAwpihaa9iYXNlQXNzaWduVmFsdWWSAg/AAKdkZWZhdWx0wMCYoXILD8DAkQHAwpyhaQAXAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmqYmFzZUZvck93bpIFDsABp2RlZmF1bHTAwJihcgsKwMCRBMDCnKFpARcECZDAwgHCwMCZoWQJAAjAkQjAwpihaaxiYXNlSXRlcmF0ZWWSCA3AAqdkZWZhdWx0wMCYoXILDMDAkQfAwpyhaQEWBwqQwMICwsDAl6FvAQALEJDAmaFkAEcMwJQNDg8MwMKYoWynbWFwS2V5c5IMEsDAwMDZR1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9tYXBLZXlzLmpzmKFyCQfADZELwMKYoXI1DMAOkQfAwpihchEKwA+RBMDCmKFyLQ/AwJEBwMKYoWcBAxHAkMDCmKFnCQsSwJESwMKYoXIAB8DAkQvAwg==
====catalogjs annotation end====*/