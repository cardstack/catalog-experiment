import { default as isArray } from "../isArray.js";
import { default as isSymbol } from "../isSymbol.js";
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }

  var type = typeof value;

  if (type == 'number' || type == 'symbol' || type == 'boolean' || value == null || isSymbol(value)) {
    return true;
  }

  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);
}
export { isKey as default };
/*====catalogjs annotation start====
k5KVwq0uLi9pc0FycmF5LmpzA8LAlcKuLi4vaXNTeW1ib2wuanMHwsCBp2RlZmF1bHSVoWylaXNLZXkWwMDcABiXoW8AAAPAkMCZoWQJAAIEkQLAwpmhaadpc0FycmF5kgIRwACnZGVmYXVsdMDAwJihcgsHwMCRAcDCnKFpAAEBB5EEwMIAwsDAmKFnCA/AwJDAwpmhZAkABgiRBsDCmaFpqGlzU3ltYm9skgYSwAGnZGVmYXVsdMDAwJihcgsIwMCRBcDCnKFpAQEFCZEIwMIBwsDAmKFnCBDAwJDAwpehbwEAChWQwJihZwABCw+QwMKZoWQENQwNkgwKwMKZoWyscmVJc0RlZXBQcm9wkgwUwMDACpDZRlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9faXNLZXkuanOYoXIADMDAkQvAwpmhZAYKDsCSDgrAwpmhbK1yZUlzUGxhaW5Qcm9wkg4TwMDACpDZRlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9faXNLZXkuanOYoXIADcDAkQ3AwpmhZAE8EMCXERITFBANC8DCmaFspWlzS2V5khAXwMDAwJDZRlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9faXNLZXkuanOYoXIJBcARkQ/AwpihchgHwBKRAcDCmKFyzJIIwBORBcDCmKFyKg3AFJENwMKYoXIRDMDAkQvAwpihZwEDFsCQwMKYoWcJCxfAkRfAwpihcgAFwMCRD8DC
====catalogjs annotation end====*/