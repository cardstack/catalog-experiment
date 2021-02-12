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
k5eVwqcuLzQzLmpzA8LAlcKpLi4vZ2V0LmpzBsLAlcKrLi4vaGFzSW4uanMJwsCVwqcuLzI2LmpzDMLAlcKoLi8xMDcuanMPwsCVwqguLzE1NS5qcxLCwJXCpy4vMjcuanMVwsCBp2RlZmF1bHSVoWyzYmFzZU1hdGNoZXNQcm9wZXJ0eSjAwNwAKpehbwAAA8CQwJmhZAkAAsCRAsDCmaFpq2Jhc2VJc0VxdWFskgIkwACnZGVmYXVsdMDAwJihcgsLwMCRAcDCnKFpABIBBpDAwgDCwMCZoWQJAAXAkQXAwpmhaaNnZXSSBSLAAadkZWZhdWx0wMDAmKFyCwPAwJEEwMKcoWkBFAQJkMDCAcLAwJmhZAkACMCRCMDCmaFppWhhc0lukggjwAKnZGVmYXVsdMDAwJihcgsFwMCRB8DCnKFpARYHDJDAwgLCwMCZoWQJAAvAkQvAwpmhaaVpc0tleZILHsADp2RlZmF1bHTAwMCYoXILBcDAkQrAwpyhaQESCg+QwMIDwsDAmaFkCQAOwJEOwMKZoWmyaXNTdHJpY3RDb21wYXJhYmxlkg4fwASnZGVmYXVsdMDAwJihcgsSwMCRDcDCnKFpARMNEpDAwgTCwMCZoWQJABHAkRHAwpmhabdtYXRjaGVzU3RyaWN0Q29tcGFyYWJsZZIRIMAFp2RlZmF1bHTAwMCYoXILF8DAkRDAwpyhaQETEBWQwMIFwsDAmaFkCQAUwJEUwMKZoWmldG9LZXmSFCHABqdkZWZhdWx0wMDAmKFyCwXAwJETwMKcoWkBEhMWkMDCBsLAwJehbwEAFyeQwJihZwABGByQwMKZoWQEBBkakhkXwMKZoWy0Q09NUEFSRV9QQVJUSUFMX0ZMQUeSGSXAwMAXkNlUV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlTWF0Y2hlc1Byb3BlcnR5LmpzmKFyABTAwJEYwMKZoWQGBBvAkhsXwMKZoWy2Q09NUEFSRV9VTk9SREVSRURfRkxBR5IbJsDAwBeQ2VRXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VNYXRjaGVzUHJvcGVydHkuanOYoXIAFsDAkRrAwpmhZAEJHcCcHh8gISIjJCUmHRgawMKZoWyzYmFzZU1hdGNoZXNQcm9wZXJ0eZIdKcDAwMCQ2VRXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VNYXRjaGVzUHJvcGVydHkuanOYoXIJE8AekRzAwpihchkFwB+RCsDCmKFyChLAIJENwMKYoXIZF8AhkRDAwpihcgEFwCKRE8DCmKFySAPAI5EEwMKYoXJNBcAkkQfAwpihchELwCWRAcDCmKFyFRTAJpEYwMKYoXIDFsDAkRrAwpihZwEDKMCQwMKYoWcJCynAkSnAwpihcgATwMCRHMDC
====catalogjs annotation end====*/