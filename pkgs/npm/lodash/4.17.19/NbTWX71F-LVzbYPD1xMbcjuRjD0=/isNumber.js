import { default as baseGetTag } from "./dist/86.js";
import { default as isObjectLike } from "./isObjectLike.js";
var numberTag = '[object Number]';
function isNumber(value) {
  return typeof value == 'number' || isObjectLike(value) && baseGetTag(value) == numberTag;
}
export { isNumber as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvODYuanMDwsCVwrEuL2lzT2JqZWN0TGlrZS5qcwbCwIGnZGVmYXVsdJShbKhpc051bWJlchHA3AATl6FvAAADwJDAmaFkCQACwJECwMKYoWmqYmFzZUdldFRhZ5ICDsAAp2RlZmF1bHTAwJihcgsKwMCRAcDCnKFpABcBBpDAwgDCwMCZoWQJAAXAkQXAwpihaaxpc09iamVjdExpa2WSBQ3AAadkZWZhdWx0wMCYoXILDMDAkQTAwpyhaQEcBAeQwMIBwsDAl6FvAQAIEJDAmKFnAAEJC5DAwpmhZAQUCsCSCgjAwpihbKludW1iZXJUYWeSCg/AwMAI2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvaXNOdW1iZXIuanOYoXIACcDAkQnAwpmhZAEDDMCVDQ4PDAnAwpihbKhpc051bWJlcpIMEsDAwMDZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9pc051bWJlci5qc5ihcgkIwA2RC8DCmKFyLwzADpEEwMKYoXILCsAPkQHAwpihcgsJwMCRCcDCmKFnAQMRwJDAwpihZwkLEsCREsDCmKFyAAjAwJELwMI=
====catalogjs annotation end====*/