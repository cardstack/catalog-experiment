import { default as arrayMap } from "./dist/98.js";
import { default as baseIntersection } from "./dist/62.js";
import { default as baseRest } from "./dist/49.js";
import { default as castArrayLikeObject } from "./dist/82.js";
import { default as last } from "./last.js";
var intersectionWith = baseRest(function (arrays) {
  var comparator = last(arrays),
      mapped = arrayMap(arrays, castArrayLikeObject);
  comparator = typeof comparator == 'function' ? comparator : undefined;

  if (comparator) {
    mapped.pop();
  }

  return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped, undefined, comparator) : [];
});
export { intersectionWith as default };
/*====catalogjs annotation start====
k5WVwqwuL2Rpc3QvOTguanMDwsCVwqwuL2Rpc3QvNjIuanMHwsCVwqwuL2Rpc3QvNDkuanMLwsCVwqwuL2Rpc3QvODIuanMPwsCVwqkuL2xhc3QuanMTwsCBp2RlZmF1bHSVoWywaW50ZXJzZWN0aW9uV2l0aCDAwNwAIpehbwAAA8CRF8CZoWQJAAIEkQLAwpmhaahhcnJheU1hcJICHMAAp2RlZmF1bHTAwMCYoXILCMDAkQHAwpyhaQABAQeRBMDCAMLAwJihZwgOwMCQwMKZoWQJAAYIkQbAwpmhabBiYXNlSW50ZXJzZWN0aW9ukgYewAGnZGVmYXVsdMDAwJihcgsQwMCRBcDCnKFpAQEFC5EIwMIBwsDAmKFnCA7AwJDAwpmhZAkACgyRCsDCmaFpqGJhc2VSZXN0kgoawAKnZGVmYXVsdMDAwJihcgsIwMCRCcDCnKFpAQEJD5EMwMICwsDAmKFnCA7AwJDAwpmhZAkADhCRDsDCmaFps2Nhc3RBcnJheUxpa2VPYmplY3SSDh3AA6dkZWZhdWx0wMDAmKFyCxPAwJENwMKcoWkBAQ0TkRDAwgPCwMCYoWcIDsDAkMDCmaFkCQASFJESwMKZoWmkbGFzdJISG8AEp2RlZmF1bHTAwMCYoXILBMDAkRHAwpyhaQEBERWRFMDCBMLAwJihZwgLwMCQwMKXoW8BABYfkMCYoWcAARfAkMDCmaFkBAAYwJMYFhnAwpmhbLBpbnRlcnNlY3Rpb25XaXRokhghwMDAFpDZUFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9pbnRlcnNlY3Rpb25XaXRoLmpzmKFyABDAGZEXwMKYoWcDKBrAlRobHB0ewMKYoXIACMAbkQnAwpihcigEwByREcDCmKFyGQjAHZEBwMKYoXIJE8AekQ3AwpihcsysEMDAkQXAwpihZwEDIMCQwMKYoWcJCyHAkSHAwpihcgAQwMCRF8DC
====catalogjs annotation end====*/