import { default as baseIsEqual } from "./43.js";
import { default as get } from "../get.js";
import { default as hasIn } from "../hasIn.js";
import { default as isKey } from "./26.js";
import { default as isStrictComparable } from "./107.js";
import { default as matchesStrictComparable } from "./155.js";
import { default as toKey } from "./27.js";
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;
function baseMatchesProperty(path, srcValue) {
  if (isKey(path) && isStrictComparable(srcValue)) {
    return matchesStrictComparable(toKey(path), srcValue);
  }

  return function (object) {
    var objValue = get(object, path);
    return objValue === undefined && objValue === srcValue ? hasIn(object, path) : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
  };
}
export { baseMatchesProperty as default };
/*====catalogjs annotation start====
k5eVwqcuLzQzLmpzA8LAlcKpLi4vZ2V0LmpzB8LAlcKrLi4vaGFzSW4uanMLwsCVwqcuLzI2LmpzD8LAlcKoLi8xMDcuanMTwsCVwqguLzE1NS5qcxfCwJXCpy4vMjcuanMbwsCBp2RlZmF1bHSVoWyzYmFzZU1hdGNoZXNQcm9wZXJ0eS/AwNwAMZehbwAAA8CQwJmhZAkAAgSRAsDCmaFpq2Jhc2VJc0VxdWFskgIrwACnZGVmYXVsdMDAwJihcgsLwMCRAcDCnKFpAAEBB5EEwMIAwsDAmKFnCAnAwJDAwpmhZAkABgiRBsDCmaFpo2dldJIGKcABp2RlZmF1bHTAwMCYoXILA8DAkQXAwpyhaQEBBQuRCMDCAcLAwJihZwgLwMCQwMKZoWQJAAoMkQrAwpmhaaVoYXNJbpIKKsACp2RlZmF1bHTAwMCYoXILBcDAkQnAwpyhaQEBCQ+RDMDCAsLAwJihZwgNwMCQwMKZoWQJAA4QkQ7AwpmhaaVpc0tleZIOJcADp2RlZmF1bHTAwMCYoXILBcDAkQ3AwpyhaQEBDROREMDCA8LAwJihZwgJwMCQwMKZoWQJABIUkRLAwpmhabJpc1N0cmljdENvbXBhcmFibGWSEibABKdkZWZhdWx0wMDAmKFyCxLAwJERwMKcoWkBAREXkRTAwgTCwMCYoWcICsDAkMDCmaFkCQAWGJEWwMKZoWm3bWF0Y2hlc1N0cmljdENvbXBhcmFibGWSFifABadkZWZhdWx0wMDAmKFyCxfAwJEVwMKcoWkBARUbkRjAwgXCwMCYoWcICsDAkMDCmaFkCQAaHJEawMKZoWmldG9LZXmSGijABqdkZWZhdWx0wMDAmKFyCwXAwJEZwMKcoWkBARkdkRzAwgbCwMCYoWcICcDAkMDCl6FvAQAeLpDAmKFnAAEfI5DAwpmhZAQEICGSIB7AwpmhbLRDT01QQVJFX1BBUlRJQUxfRkxBR5IgLMDAwB6Q2VRXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VNYXRjaGVzUHJvcGVydHkuanOYoXIAFMDAkR/AwpmhZAYEIsCSIh7AwpmhbLZDT01QQVJFX1VOT1JERVJFRF9GTEFHkiItwMDAHpDZVFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZU1hdGNoZXNQcm9wZXJ0eS5qc5ihcgAWwMCRIcDCmaFkAQkkwJwlJicoKSorLC0kHyHAwpmhbLNiYXNlTWF0Y2hlc1Byb3BlcnR5kiQwwMDAwJDZVFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZU1hdGNoZXNQcm9wZXJ0eS5qc5ihcgkTwCWRI8DCmKFyGQXAJpENwMKYoXIKEsAnkRHAwpihchkXwCiRFcDCmKFyAQXAKZEZwMKYoXJIA8AqkQXAwpihck0FwCuRCcDCmKFyEQvALJEBwMKYoXIVFMAtkR/AwpihcgMWwMCRIcDCmKFnAQMvwJDAwpihZwkLMMCRMMDCmKFyABPAwJEjwMI=
====catalogjs annotation end====*/