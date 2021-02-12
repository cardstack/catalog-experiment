import { default as arrayMap } from "./98.js";
import { default as getTag } from "./45.js";
import { default as mapToArray } from "./153.js";
function baseToPairs(object, props) {
  return arrayMap(props, function (key) {
    return [key, object[key]];
  });
}
function setToPairs(set) {
  var index = -1,
      result = Array(set.size);
  set.forEach(function (value) {
    result[++index] = [value, value];
  });
  return result;
}
var mapTag = '[object Map]',
    setTag = '[object Set]';
function createToPairs(keysFunc) {
  return function (object) {
    var tag = getTag(object);

    if (tag == mapTag) {
      return mapToArray(object);
    }

    if (tag == setTag) {
      return setToPairs(object);
    }

    return baseToPairs(object, keysFunc(object));
  };
}
export { createToPairs as default };
/*====catalogjs annotation start====
k5OVwqcuLzk4LmpzA8LAlcKnLi80NS5qcwbCwJXCqC4vMTUzLmpzCcLAgadkZWZhdWx0laFsrWNyZWF0ZVRvUGFpcnMgwMDcACKXoW8AAAPAkMCZoWQJAALAkQLAwpmhaahhcnJheU1hcJICDcAAp2RlZmF1bHTAwMCYoXILCMDAkQHAwpyhaQASAQaQwMIAwsDAmaFkCQAFwJEFwMKZoWmmZ2V0VGFnkgUZwAGnZGVmYXVsdMDAwJihcgsGwMCRBMDCnKFpARIECZDAwgHCwMCZoWQJAAjAkQjAwpmhaaptYXBUb0FycmF5kggbwAKnZGVmYXVsdMDAwJihcgsKwMCRB8DCnKFpARMHCpDAwgLCwMCXoW8BAAsOkMCZoWQAPwzAkg0MwMKZoWyrYmFzZVRvUGFpcnOSDB7AwMDAkNlMV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlVG9QYWlycy5qc5ihcgkLwA2RC8DCmKFyGwjAwJEBwMKXoW8BAA8RkMCZoWQAzJkQwJEQwMKZoWyqc2V0VG9QYWlyc5IQHcDAwMCQ2UtXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX3NldFRvUGFpcnMuanOYoXIJCsDAkQ/AwpehbwEAEh+QwJihZwABExeQwMKZoWQEERQVkhQSwMKZoWymbWFwVGFnkhQawMDAEpDZTlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fY3JlYXRlVG9QYWlycy5qc5ihcgAGwMCRE8DCmaFkBhEWwJIWEsDCmaFspnNldFRhZ5IWHMDAwBKQ2U5XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2NyZWF0ZVRvUGFpcnMuanOYoXIABsDAkRXAwpmhZAEiGMCZGRobHB0eGBMVwMKZoWytY3JlYXRlVG9QYWlyc5IYIcDAwMCQ2U5XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2NyZWF0ZVRvUGFpcnMuanOYoXIJDcAZkRfAwpihcjgGwBqRBMDCmKFyGgbAG5ETwMKYoXIRCsAckQfAwpihciAGwB2RFcDCmKFyEQrAHpEPwMKYoXIcC8DAkQvAwpihZwEDIMCQwMKYoWcJCyHAkSHAwpihcgANwMCRF8DC
====catalogjs annotation end====*/