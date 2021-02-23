import { default as apply } from "./dist/111.js";
import { default as arrayMap } from "./dist/98.js";
import { default as baseIteratee } from "./dist/6.js";
import { default as baseRest } from "./dist/49.js";
var FUNC_ERROR_TEXT = 'Expected a function';
function cond(pairs) {
  var length = pairs == null ? 0 : pairs.length,
      toIteratee = baseIteratee;
  pairs = !length ? [] : arrayMap(pairs, function (pair) {
    if (typeof pair[1] != 'function') {
      throw new TypeError(FUNC_ERROR_TEXT);
    }

    return [toIteratee(pair[0]), pair[1]];
  });
  return baseRest(function (args) {
    var index = -1;

    while (++index < length) {
      var pair = pairs[index];

      if (apply(pair[0], this, args)) {
        return apply(pair[1], this, args);
      }
    }
  });
}
export { cond as default };
/*====catalogjs annotation start====
k5SVwq0uL2Rpc3QvMTExLmpzA8LAlcKsLi9kaXN0Lzk4LmpzB8LAlcKrLi9kaXN0LzYuanMLwsCVwqwuL2Rpc3QvNDkuanMPwsCBp2RlZmF1bHSVoWykY29uZB7AwNwAIJehbwAAA8CQwJmhZAkAAgSRAsDCmaFppWFwcGx5kwIbHMAAp2RlZmF1bHTAwMCYoXILBcDAkQHAwpyhaQABAQeRBMDCAMLAwJihZwgPwMCQwMKZoWQJAAYIkQbAwpmhaahhcnJheU1hcJIGGMABp2RlZmF1bHTAwMCYoXILCMDAkQXAwpyhaQEBBQuRCMDCAcLAwJihZwgOwMCQwMKZoWQJAAoMkQrAwpmhaaxiYXNlSXRlcmF0ZWWSChfAAqdkZWZhdWx0wMDAmKFyCwzAwJEJwMKcoWkBAQkPkQzAwgLCwMCYoWcIDcDAkMDCmaFkCQAOEJEOwMKZoWmoYmFzZVJlc3SSDhrAA6dkZWZhdWx0wMDAmKFyCwjAwJENwMKcoWkBAQ0RkRDAwgPCwMCYoWcIDsDAkMDCl6FvAQASHZDAmKFnAAETFZDAwpmhZAQYFMCSFBLAwpmhbK9GVU5DX0VSUk9SX1RFWFSSFBnAwMASkNlEV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2NvbmQuanOYoXIAD8DAkRPAwpmhZAEsFsCYFxgZGhscFhPAwpmhbKRjb25kkhYfwMDAwJDZRFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9jb25kLmpzmKFyCQTAF5EVwMKYoXJODMAYkQnAwpihchsIwBmRBcDCmKFyXA/AGpETwMKYoXJECMAbkQ3AwpihcnEFwByRAcDCmKFyKAXAwJEBwMKYoWcBAx7AkMDCmKFnCQsfwJEfwMKYoXIABMDAkRXAwg==
====catalogjs annotation end====*/