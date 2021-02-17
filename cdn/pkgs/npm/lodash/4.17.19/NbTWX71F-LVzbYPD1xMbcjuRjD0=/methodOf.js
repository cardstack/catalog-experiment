import { default as baseInvoke } from "./dist/8.js";
import { default as baseRest } from "./dist/49.js";
var methodOf = baseRest(function (object, args) {
  return function (path) {
    return baseInvoke(object, path, args);
  };
});
export { methodOf as default };
/*====catalogjs annotation start====
k5KVwqsuL2Rpc3QvOC5qcwPCwJXCrC4vZGlzdC80OS5qcwfCwIGnZGVmYXVsdJWhbKhtZXRob2RPZhHAwNwAE5ehbwAAA8CRC8CZoWQJAAIEkQLAwpmhaapiYXNlSW52b2tlkgIPwACnZGVmYXVsdMDAwJihcgsKwMCRAcDCnKFpAAEBB5EEwMIAwsDAmKFnCA3AwJDAwpmhZAkABgiRBsDCmaFpqGJhc2VSZXN0kgYOwAGnZGVmYXVsdMDAwJihcgsIwMCRBcDCnKFpAQEFCZEIwMIBwsDAmKFnCA7AwJDAwpehbwEAChCQwJihZwABC8CQwMKZoWQEAAzAkwwKDcDCmaFsqG1ldGhvZE9mkgwSwMDACpDZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9tZXRob2RPZi5qc5ihcgAIwA2RC8DCmKFnAx0OwJIOD8DCmKFyAAjAD5EFwMKYoXJBCsDAkQHAwpihZwEDEcCQwMKYoWcJCxLAkRLAwpihcgAIwMCRC8DC
====catalogjs annotation end====*/