import { default as arrayFilter } from "./dist/150.js";
import { default as arrayMap } from "./dist/98.js";
import { default as baseProperty } from "./dist/156.js";
import { default as baseTimes } from "./dist/134.js";
import { default as isArrayLikeObject } from "./isArrayLikeObject.js";
var nativeMax = Math.max;
function unzip(array) {
  if (!(array && array.length)) {
    return [];
  }

  var length = 0;
  array = arrayFilter(array, function (group) {
    if (isArrayLikeObject(group)) {
      length = nativeMax(group.length, length);
      return true;
    }
  });
  return baseTimes(length, function (index) {
    return arrayMap(array, baseProperty(index));
  });
}
export { unzip as default };
/*====catalogjs annotation start====
k5WVwq0uL2Rpc3QvMTUwLmpzA8LAlcKsLi9kaXN0Lzk4LmpzBsLAlcKtLi9kaXN0LzE1Ni5qcwnCwJXCrS4vZGlzdC8xMzQuanMMwsCVwrYuL2lzQXJyYXlMaWtlT2JqZWN0LmpzD8LAgadkZWZhdWx0lKFspXVuemlwHcDcAB+XoW8AAAPAkMCZoWQJAALAkQLAwpihaathcnJheUZpbHRlcpICFsAAp2RlZmF1bHTAwJihcgsLwMCRAcDCnKFpABgBBpDAwgDCwMCZoWQJAAXAkQXAwpihaahhcnJheU1hcJIFGsABp2RlZmF1bHTAwJihcgsIwMCRBMDCnKFpARcECZDAwgHCwMCZoWQJAAjAkQjAwpihaaxiYXNlUHJvcGVydHmSCBvAAqdkZWZhdWx0wMCYoXILDMDAkQfAwpyhaQEYBwyQwMICwsDAmaFkCQALwJELwMKYoWmpYmFzZVRpbWVzkgsZwAOnZGVmYXVsdMDAmKFyCwnAwJEKwMKcoWkBGAoPkMDCA8LAwJmhZAkADsCRDsDCmKFpsWlzQXJyYXlMaWtlT2JqZWN0kg4XwASnZGVmYXVsdMDAmKFyCxHAwJENwMKcoWkBIQ0QkMDCBMLAwJehbwEAERyQwJihZwABEhSQwMKZoWQECxPAkhMRwMKYoWypbmF0aXZlTWF4khMYwMDAEdlFV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3VuemlwLmpzmKFyAAnAwJESwMKZoWQBERXAmBYXGBkaGxUSwMKYoWyldW56aXCSFR7AwMDA2UVXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvdW56aXAuanOYoXIJBcAWkRTAwpihclwLwBeRAcDCmKFyIxHAGJENwMKYoXIaCcAZkRLAwpihckAJwBqRCsDCmKFyJwjAG5EEwMKYoXIIDMDAkQfAwpihZwEDHcCQwMKYoWcJCx7AkR7AwpihcgAFwMCRFMDC
====catalogjs annotation end====*/