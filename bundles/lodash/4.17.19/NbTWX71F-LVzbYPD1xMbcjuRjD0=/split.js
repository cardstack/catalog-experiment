import { default as baseToString } from "./dist/22.js";
import { default as castSlice } from "./dist/140.js";
import { default as hasUnicode } from "./dist/145.js";
import { default as isIterateeCall } from "./dist/70.js";
import { default as isRegExp } from "./isRegExp.js";
import { default as stringToArray } from "./dist/143.js";
import { default as toString } from "./toString.js";
var MAX_ARRAY_LENGTH = 4294967295;
function split(string, separator, limit) {
  if (limit && typeof limit != 'number' && isIterateeCall(string, separator, limit)) {
    separator = limit = undefined;
  }

  limit = limit === undefined ? MAX_ARRAY_LENGTH : limit >>> 0;

  if (!limit) {
    return [];
  }

  string = toString(string);

  if (string && (typeof separator == 'string' || separator != null && !isRegExp(separator))) {
    separator = baseToString(separator);

    if (!separator && hasUnicode(string)) {
      return castSlice(stringToArray(string), 0, limit);
    }
  }

  return string.split(separator, limit);
}
export { split as default };
/*====catalogjs annotation start====
k5eVwqwuL2Rpc3QvMjIuanMDwsCVwq0uL2Rpc3QvMTQwLmpzBsLAlcKtLi9kaXN0LzE0NS5qcwnCwJXCrC4vZGlzdC83MC5qcwzCwJXCrS4vaXNSZWdFeHAuanMPwsCVwq0uL2Rpc3QvMTQzLmpzEsLAlcKtLi90b1N0cmluZy5qcxXCwIGnZGVmYXVsdJShbKVzcGxpdCXA3AAnl6FvAAADwJEawJmhZAkAAsCRAsDCmKFprGJhc2VUb1N0cmluZ5ICIMAAp2RlZmF1bHTAwJihcgsMwMCRAcDCnKFpABcBBpDAwgDCwMCZoWQJAAXAkQXAwpihaaljYXN0U2xpY2WSBSLAAadkZWZhdWx0wMCYoXILCcDAkQTAwpyhaQEYBAmQwMIBwsDAmaFkCQAIwJEIwMKYoWmqaGFzVW5pY29kZZIIIcACp2RlZmF1bHTAwJihcgsKwMCRB8DCnKFpARgHDJDAwgLCwMCZoWQJAAvAkQvAwpihaa5pc0l0ZXJhdGVlQ2FsbJILHMADp2RlZmF1bHTAwJihcgsOwMCRCsDCnKFpARcKD5DAwgPCwMCZoWQJAA7AkQ7Awpihaahpc1JlZ0V4cJIOH8AEp2RlZmF1bHTAwJihcgsIwMCRDcDCnKFpARgNEpDAwgTCwMCZoWQJABHAkRHAwpihaa1zdHJpbmdUb0FycmF5khEjwAWnZGVmYXVsdMDAmKFyCw3AwJEQwMKcoWkBGBAVkMDCBcLAwJmhZAkAFMCRFMDCmKFpqHRvU3RyaW5nkhQewAanZGVmYXVsdMDAmKFyCwjAwJETwMKcoWkBGBMWkMDCBsLAwJehbwEAFySQwJihZwABGBqQwMKZoWQEDRnAkhkXwMKYoWywTUFYX0FSUkFZX0xFTkdUSJIZHcDAwBfZRVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9zcGxpdC5qc5ihcgAQwMCRGMDCmaFkAUobwJocHR4fICEiIxsYwMKYoWylc3BsaXSSGybAwMDA2UVXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvc3BsaXQuanOYoXIJBcAckRrAwpihckgOwB2RCsDCmKFyZhDAHpEYwMKYoXJACMAfkRPAwpihclIIwCCRDcDCmKFyIAzAIZEBwMKYoXIkCsAikQfAwpihchkJwCORBMDCmKFyAQ3AwJEQwMKYoWcBAyXAkMDCmKFnCQsmwJEmwMKYoXIABcDAkRrAwg==
====catalogjs annotation end====*/