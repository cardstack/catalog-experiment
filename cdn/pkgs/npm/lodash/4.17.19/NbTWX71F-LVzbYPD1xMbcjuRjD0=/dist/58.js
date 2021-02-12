import { default as memoize } from "../memoize.js";
var MAX_MEMOIZE_SIZE = 500;
function memoizeCapped(func) {
  var result = memoize(func, function (key) {
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }

    return key;
  });
  var cache = result.cache;
  return result;
}
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
var reEscapeChar = /\\(\\)?/g;
var stringToPath = memoizeCapped(function (string) {
  var result = [];

  if (string.charCodeAt(0) === 46) {
      result.push('');
    }

  string.replace(rePropName, function (match, number, quote, subString) {
    result.push(quote ? subString.replace(reEscapeChar, '$1') : number || match);
  });
  return result;
});
export { stringToPath as default };
/*====catalogjs annotation start====
k5GVwq0uLi9tZW1vaXplLmpzA8LAgadkZWZhdWx0laFsrHN0cmluZ1RvUGF0aBvAwNwAHZehbwAAA8CRFMCZoWQJAALAkQLAwpmhaadtZW1vaXplkgIKwACnZGVmYXVsdMDAwJihcgsHwMCRAcDCnKFpABgBBJDAwgDCwMCXoW8BAAUMkMCYoWcAAQYIkMDCmaFkBAYHwJIHBcDCmaFssE1BWF9NRU1PSVpFX1NJWkWSBwvAwMAFkNlOV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19tZW1vaXplQ2FwcGVkLmpzmKFyABDAwJEGwMKZoWQBZAnAlAoLCQbAwpmhbK1tZW1vaXplQ2FwcGVkkgkXwMDAwJDZTlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fbWVtb2l6ZUNhcHBlZC5qc5ihcgkNwAqRCMDCmKFyGAfAC5EBwMKYoXIvEMDAkQbAwpehbwEADRqQwJihZwABDhCQwMKZoWQEZQ/Akg8NwMKZoWyqcmVQcm9wTmFtZZIPGMDAwA2Q2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX3N0cmluZ1RvUGF0aC5qc5ihcgAKwMCRDsDCmKFnAQERE5DAwpmhZAQNEsCSEhDAwpmhbKxyZUVzY2FwZUNoYXKSEhnAwMAQkNlNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19zdHJpbmdUb1BhdGguanOYoXIADMDAkRHAwpihZwEBFMCQwMKZoWQEABXAlRUTFg4RwMKZoWysc3RyaW5nVG9QYXRokhUcwMDAE5DZTVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fc3RyaW5nVG9QYXRoLmpzmKFyAAzAFpEUwMKYoWcDNRfAkxcYGcDCmKFyAA3AGJEIwMKYoXJ9CsAZkQ7AwpihclkMwMCREcDCmKFnAQMbwJDAwpihZwkLHMCRHMDCmKFyAAzAwJEUwMI=
====catalogjs annotation end====*/