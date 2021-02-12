import { default as isSymbol } from "../isSymbol.js";
import { default as baseToString } from "./22.js";
var NAN = 0 / 0;
function baseToNumber(value) {
  if (typeof value == 'number') {
    return value;
  }

  if (isSymbol(value)) {
    return NAN;
  }

  return +value;
}
function createMathOperation(operator, defaultValue) {
  return function (value, other) {
    var result;

    if (value === undefined && other === undefined) {
      return defaultValue;
    }

    if (value !== undefined) {
      result = value;
    }

    if (other !== undefined) {
      if (result === undefined) {
        return other;
      }

      if (typeof value == 'string' || typeof other == 'string') {
        value = baseToString(value);
        other = baseToString(other);
      } else {
        value = baseToNumber(value);
        other = baseToNumber(other);
      }

      result = operator(value, other);
    }

    return result;
  };
}
export { createMathOperation as default };
/*====catalogjs annotation start====
k5KVwq4uLi9pc1N5bWJvbC5qcwPCwJXCpy4vMjIuanMGwsCBp2RlZmF1bHSVoWyzY3JlYXRlTWF0aE9wZXJhdGlvbhfAwNwAGZehbwAAA8CQwJmhZAkAAsCRAsDCmaFpqGlzU3ltYm9skgINwACnZGVmYXVsdMDAwJihcgsIwMCRAcDCnKFpABkBBpDAwgDCwMCZoWQJAAXAkQXAwpmhaaxiYXNlVG9TdHJpbmeTBRITwAGnZGVmYXVsdMDAwJihcgsMwMCRBMDCnKFpARIEB5DAwgHCwMCXoW8BAAgPkMCYoWcAAQkLkMDCmaFkBAgKwJIKCMDCmaFso05BTpIKDsDAwAiQ2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VUb051bWJlci5qc5ihcgADwMCRCcDCmaFkARkMwJQNDgwJwMKZoWysYmFzZVRvTnVtYmVykwwUFcDAwMCQ2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VUb051bWJlci5qc5ihcgkMwA2RC8DCmKFySQjADpEBwMKYoXIWA8DAkQnAwpehbwEAEBaQwJmhZABZEcCVEhMUFRHAwpmhbLNjcmVhdGVNYXRoT3BlcmF0aW9ukhEYwMDAwJDZVFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fY3JlYXRlTWF0aE9wZXJhdGlvbi5qc5ihcgkTwBKREMDCmKFyzQGVDMATkQTAwpihchkMwBSRBMDCmKFyKAzAFZELwMKYoXIZDMDAkQvAwpihZwEDF8CQwMKYoWcJCxjAkRjAwpihcgATwMCREMDC
====catalogjs annotation end====*/