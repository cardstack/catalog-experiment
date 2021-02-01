import { default as baseGetTag } from "./dist/86.js";
import { default as isObjectLike } from "./isObjectLike.js";
var symbolTag = '[object Symbol]';
function isSymbol(value) {
  return typeof value == 'symbol' || isObjectLike(value) && baseGetTag(value) == symbolTag;
}
export { isSymbol as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvODYuanMDwsCVwrEuL2lzT2JqZWN0TGlrZS5qcwbCwIGnZGVmYXVsdJShbKhpc1N5bWJvbBHA3AATl6FvAAADwJDAmaFkCQACwJECwMKYoWmqYmFzZUdldFRhZ5ICDsAAp2RlZmF1bHTAwJihcgsKwMCRAcDCnKFpABcBBpDAwgDCwMCZoWQJAAXAkQXAwpihaaxpc09iamVjdExpa2WSBQ3AAadkZWZhdWx0wMCYoXILDMDAkQTAwpyhaQEcBAeQwMIBwsDAl6FvAQAIEJDAmKFnAAEJC5DAwpmhZAQUCsCSCgjAwpihbKlzeW1ib2xUYWeSCg/AwMAI2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvaXNTeW1ib2wuanOYoXIACcDAkQnAwpmhZAEDDMCVDQ4PDAnAwpihbKhpc1N5bWJvbJIMEsDAwMDZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9pc1N5bWJvbC5qc5ihcgkIwA2RC8DCmKFyLwzADpEEwMKYoXILCsAPkQHAwpihcgsJwMCRCcDCmKFnAQMRwJDAwpihZwkLEsCREsDCmKFyAAjAwJELwMI=
====catalogjs annotation end====*/