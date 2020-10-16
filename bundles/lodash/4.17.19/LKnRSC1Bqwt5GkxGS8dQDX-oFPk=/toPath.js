import { default as arrayMap } from "./dist/98.js";
import { default as copyArray } from "./dist/117.js";
import { default as isArray } from "./isArray.js";
import { default as isSymbol } from "./isSymbol.js";
import { default as stringToPath } from "./dist/58.js";
import { default as toKey } from "./dist/27.js";
import { default as toString } from "./toString.js";








/**
 * Converts `value` to a property path array.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Util
 * @param {*} value The value to convert.
 * @returns {Array} Returns the new property path array.
 * @example
 *
 * _.toPath('a.b.c');
 * // => ['a', 'b', 'c']
 *
 * _.toPath('a[0].b.c');
 * // => ['a', '0', 'b', 'c']
 */

function toPath(value) {
  if (isArray(value)) {
    return arrayMap(value, toKey);
  }

  return isSymbol(value) ? [value] : copyArray(stringToPath(toString(value)));
}


export { toPath as default };
/*====catalogjs annotation start====
lZeVwqwuL2Rpc3QvOTguanMBwsCVwq0uL2Rpc3QvMTE3LmpzBcLAlcKsLi9pc0FycmF5LmpzCcLAlcKtLi9pc1N5bWJvbC5qcw3CwJXCrC4vZGlzdC81OC5qcxHCwJXCrC4vZGlzdC8yNy5qcxXCwJXCrS4vdG9TdHJpbmcuanMZwsCBp2RlZmF1bHSUoWymdG9QYXRoIMCRkyDAwIioYXJyYXlNYXCboWmQwgLAkgMEwADAp2RlZmF1bHSQqWNvcHlBcnJheZuhaZDCBsCSBwjAAcCnZGVmYXVsdJCnaXNBcnJheZuhaZDCCsCSCwzAAsCnZGVmYXVsdJCoaXNTeW1ib2yboWmQwg7Akg8QwAPAp2RlZmF1bHSQrHN0cmluZ1RvUGF0aJuhaZDCEsCSExTABMCnZGVmYXVsdJCldG9LZXmboWmQwhbAkhcYwAXAp2RlZmF1bHSQqHRvU3RyaW5nm6FpkMIawJIbHMAGwKdkZWZhdWx0kKZ0b1BhdGiboWyXp2lzQXJyYXmoYXJyYXlNYXCldG9LZXmoaXNTeW1ib2ypY29weUFycmF5rHN0cmluZ1RvUGF0aKh0b1N0cmluZ8IdwJIeH8DAwMCQ3AAhlgAAAcDCw5YAFwIFwsKWCQADwMLClgsIwMDCwpYWCMAYwsKWARgGCcLClgkAB8DCwpYLCcDAwsKWFAnAFMLClgEXCg3CwpYJAAvAwsKWCwfAwMLClhAHwATCwpYBGA4RwsKWCQAPwMLClgsIwMDCwpYRCMAIwsKWARcSFcLClgkAE8DCwpYLDMDAwsKWAQzAHMLClgEXFhnCwpYJABfAwsKWCwXAwMLClggFwBDCwpYBGBodwsKWCQAbwMLClgsIwMDCwpYBCMDAwsKWzQFaDB4gwsKWCQbADMLClgkGwMDCwpYDDh/AwsI=
====catalogjs annotation end====*/