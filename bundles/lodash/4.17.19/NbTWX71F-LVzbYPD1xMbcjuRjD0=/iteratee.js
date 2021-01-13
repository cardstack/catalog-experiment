import { default as baseClone } from "./dist/40.js";
import { default as baseIteratee } from "./dist/6.js";
var CLONE_DEEP_FLAG = 1;
function iteratee(func) {
  return baseIteratee(typeof func == 'function' ? func : baseClone(func, CLONE_DEEP_FLAG));
}
export { iteratee as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvNDAuanMDwsCVwqsuL2Rpc3QvNi5qcwbCwIGnZGVmYXVsdJShbKhpdGVyYXRlZRHA3AATl6FvAAADwJELwJmhZAkAAsCRAsDCmKFpqWJhc2VDbG9uZZICDsAAp2RlZmF1bHTAwJihcgsJwMCRAcDCnKFpABcBBpDAwgDCwMCZoWQJAAXAkQXAwpihaaxiYXNlSXRlcmF0ZWWSBQ3AAadkZWZhdWx0wMCYoXILDMDAkQTAwpyhaQEWBAeQwMIBwsDAl6FvAQAIEJDAmKFnAAEJC5DAwpmhZAQECsCSCgjAwpihbK9DTE9ORV9ERUVQX0ZMQUeSCg/AwMAI2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvaXRlcmF0ZWUuanOYoXIAD8DAkQnAwpmhZAEFDMCVDQ4PDAnAwpihbKhpdGVyYXRlZZIMEsDAwMDZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9pdGVyYXRlZS5qc5ihcgkIwA2RC8DCmKFyEgzADpEEwMKYoXIkCcAPkQHAwpihcgcPwMCRCcDCmKFnAQMRwJDAwpihZwkLEsCREsDCmKFyAAjAwJELwMI=
====catalogjs annotation end====*/