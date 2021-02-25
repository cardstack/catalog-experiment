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
k5GVwq0uLi9tZW1vaXplLmpzA8LAgadkZWZhdWx0laFsrHN0cmluZ1RvUGF0aBzAwNwAHpehbwAAA8CRFcCZoWQJAAIEkQLAwpmhaadtZW1vaXplkgILwACnZGVmYXVsdMDAwJihcgsHwMCRAcDCnKFpAAEBBZEEwMIAwsDAmKFnCA/AwJDAwpehbwEABg2QwJihZwABBwmQwMKZoWQEBgjAkggGwMKZoWywTUFYX01FTU9JWkVfU0laRZIIDMDAwAaQ2U5XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX21lbW9pemVDYXBwZWQuanOYoXIAEMDAkQfAwpmhZAFkCsCUCwwKB8DCmaFsrW1lbW9pemVDYXBwZWSSChjAwMDAkNlOV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19tZW1vaXplQ2FwcGVkLmpzmKFyCQ3AC5EJwMKYoXIYB8AMkQHAwpihci8QwMCRB8DCl6FvAQAOG5DAmKFnAAEPEZDAwpmhZARlEMCSEA7AwpmhbKpyZVByb3BOYW1lkhAZwMDADpDZTVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fc3RyaW5nVG9QYXRoLmpzmKFyAArAwJEPwMKYoWcBARIUkMDCmaFkBA0TwJITEcDCmaFsrHJlRXNjYXBlQ2hhcpITGsDAwBGQ2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX3N0cmluZ1RvUGF0aC5qc5ihcgAMwMCREsDCmKFnAQEVwJDAwpmhZAQAFsCVFhQXDxLAwpmhbKxzdHJpbmdUb1BhdGiSFh3AwMAUkNlNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19zdHJpbmdUb1BhdGguanOYoXIADMAXkRXAwpihZwM1GMCTGBkawMKYoXIADcAZkQnAwpihcn0KwBqRD8DCmKFyWQzAwJESwMKYoWcBAxzAkMDCmKFnCQsdwJEdwMKYoXIADMDAkRXAwg==
====catalogjs annotation end====*/