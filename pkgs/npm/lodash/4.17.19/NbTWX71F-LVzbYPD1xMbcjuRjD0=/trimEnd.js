import { default as baseToString } from "./dist/22.js";
import { default as castSlice } from "./dist/140.js";
import { default as charsEndIndex } from "./dist/121.js";
import { default as stringToArray } from "./dist/143.js";
import { default as toString } from "./toString.js";
var reTrimEnd = /\s+$/;
function trimEnd(string, chars, guard) {
  string = toString(string);

  if (string && (guard || chars === undefined)) {
    return string.replace(reTrimEnd, '');
  }

  if (!string || !(chars = baseToString(chars))) {
    return string;
  }

  var strSymbols = stringToArray(string),
      end = charsEndIndex(strSymbols, stringToArray(chars)) + 1;
  return castSlice(strSymbols, 0, end).join('');
}
export { trimEnd as default };
/*====catalogjs annotation start====
k5WVwqwuL2Rpc3QvMjIuanMDwsCVwq0uL2Rpc3QvMTQwLmpzBsLAlcKtLi9kaXN0LzEyMS5qcwnCwJXCrS4vZGlzdC8xNDMuanMMwsCVwq0uL3RvU3RyaW5nLmpzD8LAgadkZWZhdWx0lKFsp3RyaW1FbmQewNwAIJehbwAAA8CQwJmhZAkAAsCRAsDCmKFprGJhc2VUb1N0cmluZ5ICGMAAp2RlZmF1bHTAwJihcgsMwMCRAcDCnKFpABcBBpDAwgDCwMCZoWQJAAXAkQXAwpihaaljYXN0U2xpY2WSBRzAAadkZWZhdWx0wMCYoXILCcDAkQTAwpyhaQEYBAmQwMIBwsDAmaFkCQAIwJEIwMKYoWmtY2hhcnNFbmRJbmRleJIIGsACp2RlZmF1bHTAwJihcgsNwMCRB8DCnKFpARgHDJDAwgLCwMCZoWQJAAvAkQvAwpihaa1zdHJpbmdUb0FycmF5kwsZG8ADp2RlZmF1bHTAwJihcgsNwMCRCsDCnKFpARgKD5DAwgPCwMCZoWQJAA7AkQ7Awpihaah0b1N0cmluZ5IOFsAEp2RlZmF1bHTAwJihcgsIwMCRDcDCnKFpARgNEJDAwgTCwMCXoW8BABEdkMCYoWcAARIUkMDCmaFkBAkTwJITEcDCmKFsqXJlVHJpbUVuZJITF8DAwBHZR1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy90cmltRW5kLmpzmKFyAAnAwJESwMKZoWQBIBXAmRYXGBkaGxwVEsDCmKFsp3RyaW1FbmSSFR/AwMDA2UdXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvdHJpbUVuZC5qc5ihcgkHwBaRFMDCmKFyJAjAF5ENwMKYoXJXCcAYkRLAwpihcicMwBmRAcDCmKFyNw3AGpEKwMKYoXIWDcAbkQfAwpihcg0NwByRCsDCmKFyFwnAwJEEwMKYoWcBAx7AkMDCmKFnCQsfwJEfwMKYoXIAB8DAkRTAwg==
====catalogjs annotation end====*/