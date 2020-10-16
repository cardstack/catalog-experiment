import { default as basePickBy } from "./dist/12.js";
import { default as hasIn } from "./hasIn.js";
import { default as flatRest } from "./dist/50.js";



/**
 * The base implementation of `_.pick` without support for individual
 * property identifiers.
 *
 * @private
 * @param {Object} object The source object.
 * @param {string[]} paths The property paths to pick.
 * @returns {Object} Returns the new object.
 */

function basePick(object, paths) {
  return basePickBy(object, paths, function (value, path) {
    return hasIn(object, path);
  });
}





/**
 * Creates an object composed of the picked `object` properties.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The source object.
 * @param {...(string|string[])} [paths] The property paths to pick.
 * @returns {Object} Returns the new object.
 * @example
 *
 * var object = { 'a': 1, 'b': '2', 'c': 3 };
 *
 * _.pick(object, ['a', 'c']);
 * // => { 'a': 1, 'c': 3 }
 */

var pick = flatRest(function (object, paths) {
  return object == null ? {} : basePick(object, paths);
});

export { pick as default };
/*====catalogjs annotation start====
lZOVwqwuL2Rpc3QvMTIuanMBwsCVwqouL2hhc0luLmpzBcLAlcKsLi9kaXN0LzUwLmpzCcLAgadkZWZhdWx0lKFspHBpY2sVwJGTFcDAhapiYXNlUGlja0J5m6FpkMICwJIDBMAAwKdkZWZhdWx0kKVoYXNJbpuhaZDCBsCSBwjAAcCnZGVmYXVsdJCoZmxhdFJlc3SboWmQwgrAkgsMwALAp2RlZmF1bHSQqGJhc2VQaWNrm6FskqpiYXNlUGlja0J5pWhhc0luwg3Akg4PktlXaHR0cHM6Ly9jYXRhbG9nanMuY29tL3BrZ3MvbnBtL2xvZGFzaC80LjE3LjE5L0xLblJTQzFCcXd0NUdreEdTOGRRRFgtb0ZQaz0vX2Jhc2VQaWNrLmpzp2RlZmF1bHTAwMCQpHBpY2uboWySqGZsYXRSZXN0qGJhc2VQaWNrwhEUkhITwMDAwJKoZmxhdFJlc3SoYmFzZVBpY2vcABaWAAABwMLDlgAXAgXCwpYJAAPAwsKWCwrAwMLClhsKwAjCwpYBFQYJwsKWCQAHwMLClgsFwMDCwpY0BcDAwsKWARcKDcLClgkAC8DCwpYLCMDAwsKWAAjAD8LCls0BDBcOEMLClgkIwATCwpY7CMDAwsKWzQGrAREVwsKWBAASwMLClgAEwBTCwpYJBMDAwsKWAxMMwMLClgIOE8DCwg==
====catalogjs annotation end====*/