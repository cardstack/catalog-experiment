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
k5SVwq0uL2Rpc3QvMTExLmpzA8LAlcKsLi9kaXN0Lzk4LmpzBsLAlcKrLi9kaXN0LzYuanMJwsCVwqwuL2Rpc3QvNDkuanMMwsCBp2RlZmF1bHSUoWykY29uZBrA3AAcl6FvAAADwJERwJmhZAkAAsCRAsDCmKFppWFwcGx5kwIXGMAAp2RlZmF1bHTAwJihcgsFwMCRAcDCnKFpABgBBpDAwgDCwMCZoWQJAAXAkQXAwpihaahhcnJheU1hcJIFFMABp2RlZmF1bHTAwJihcgsIwMCRBMDCnKFpARcECZDAwgHCwMCZoWQJAAjAkQjAwpihaaxiYXNlSXRlcmF0ZWWSCBPAAqdkZWZhdWx0wMCYoXILDMDAkQfAwpyhaQEWBwyQwMICwsDAmaFkCQALwJELwMKYoWmoYmFzZVJlc3SSCxbAA6dkZWZhdWx0wMCYoXILCMDAkQrAwpyhaQEXCg2QwMIDwsDAl6FvAQAOGZDAmKFnAAEPEZDAwpmhZAQYEMCSEA7AwpihbK9GVU5DX0VSUk9SX1RFWFSSEBXAwMAO2URXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvY29uZC5qc5ihcgAPwMCRD8DCmaFkASwSwJgTFBUWFxgSD8DCmKFspGNvbmSSEhvAwMDA2URXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvY29uZC5qc5ihcgkEwBOREcDCmKFyTgzAFJEHwMKYoXIbCMAVkQTAwpihclwPwBaRD8DCmKFyRAjAF5EKwMKYoXJxBcAYkQHAwpihcigFwMCRAcDCmKFnAQMawJDAwpihZwkLG8CRG8DCmKFyAATAwJERwMI=
====catalogjs annotation end====*/