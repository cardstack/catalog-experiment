import { default as arrayMap } from "./dist/98.js";
import { default as baseClone } from "./dist/40.js";
import { default as baseUnset } from "./dist/10.js";
import { default as castPath } from "./dist/17.js";
import { default as copyObject } from "./dist/54.js";
import { default as isPlainObject } from "./isPlainObject.js";
import { default as flatRest } from "./dist/50.js";
import { default as getAllKeysIn } from "./dist/80.js";


/**
 * Used by `_.omit` to customize its `_.cloneDeep` use to only clone plain
 * objects.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {string} key The key of the property to inspect.
 * @returns {*} Returns the uncloned value or `undefined` to defer cloning to `_.cloneDeep`.
 */

function customOmitClone(value) {
  return isPlainObject(value) ? undefined : value;
}











/** Used to compose bitmasks for cloning. */

var CLONE_DEEP_FLAG = 1,
    CLONE_FLAT_FLAG = 2,
    CLONE_SYMBOLS_FLAG = 4;
/**
 * The opposite of `_.pick`; this method creates an object composed of the
 * own and inherited enumerable property paths of `object` that are not omitted.
 *
 * **Note:** This method is considerably slower than `_.pick`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The source object.
 * @param {...(string|string[])} [paths] The property paths to omit.
 * @returns {Object} Returns the new object.
 * @example
 *
 * var object = { 'a': 1, 'b': '2', 'c': 3 };
 *
 * _.omit(object, ['a', 'c']);
 * // => { 'b': '2' }
 */

var omit = flatRest(function (object, paths) {
  var result = {};

  if (object == null) {
    return result;
  }

  var isDeep = false;
  paths = arrayMap(paths, function (path) {
    path = castPath(path, object);
    isDeep || (isDeep = path.length > 1);
    return path;
  });
  copyObject(object, getAllKeysIn(object), result);

  if (isDeep) {
    result = baseClone(result, CLONE_DEEP_FLAG | CLONE_FLAT_FLAG | CLONE_SYMBOLS_FLAG, customOmitClone);
  }

  var length = paths.length;

  while (length--) {
    baseUnset(result, paths[length]);
  }

  return result;
});

export { omit as default };
/*====catalogjs annotation start====
lZiVwqwuL2Rpc3QvOTguanMBwsCVwqwuL2Rpc3QvNDAuanMFwsCVwqwuL2Rpc3QvMTAuanMJwsCVwqwuL2Rpc3QvMTcuanMNwsCVwqwuL2Rpc3QvNTQuanMRwsCVwrIuL2lzUGxhaW5PYmplY3QuanMVwsCVwqwuL2Rpc3QvNTAuanMZwsCVwqwuL2Rpc3QvODAuanMdwsCBp2RlZmF1bHSUoWykb21pdDPAkZMzwMCNqGFycmF5TWFwm6FpkMICwJIDBMAAwKdkZWZhdWx0kKliYXNlQ2xvbmWboWmQwgbAkgcIwAHAp2RlZmF1bHSQqWJhc2VVbnNldJuhaZDCCsCSCwzAAsCnZGVmYXVsdJCoY2FzdFBhdGiboWmQwg7Akg8QwAPAp2RlZmF1bHSQqmNvcHlPYmplY3SboWmQwhLAkhMUwATAp2RlZmF1bHSQrWlzUGxhaW5PYmplY3SboWmQwhbAkhcYwAXAp2RlZmF1bHSQqGZsYXRSZXN0m6FpkMIawJIbHMAGwKdkZWZhdWx0kKxnZXRBbGxLZXlzSW6boWmQwh7Akh8gwAfAp2RlZmF1bHSQr2N1c3RvbU9taXRDbG9uZZuhbJGtaXNQbGFpbk9iamVjdMIhwJIiI5LZXmh0dHBzOi8vY2F0YWxvZ2pzLmNvbS9wa2dzL25wbS9sb2Rhc2gvNC4xNy4xOS9MS25SU0MxQnF3dDVHa3hHUzhkUURYLW9GUGs9L19jdXN0b21PbWl0Q2xvbmUuanOnZGVmYXVsdMDAwJCvQ0xPTkVfREVFUF9GTEFHm6FskMIlwJImJ8DAwMCQr0NMT05FX0ZMQVRfRkxBR5uhbJDCKMCSKSrAwMDAkLJDTE9ORV9TWU1CT0xTX0ZMQUeboWyQwivAkiwtwMDAwJCkb21pdJuhbJuoZmxhdFJlc3SoYXJyYXlNYXCoY2FzdFBhdGiqY29weU9iamVjdKxnZXRBbGxLZXlzSW6pYmFzZUNsb25lr0NMT05FX0RFRVBfRkxBR69DTE9ORV9GTEFUX0ZMQUeyQ0xPTkVfU1lNQk9MU19GTEFHr2N1c3RvbU9taXRDbG9uZaliYXNlVW5zZXTCLzKSMDHAwMDAm6hhcnJheU1hcKliYXNlQ2xvbmWpYmFzZVVuc2V0qGNhc3RQYXRoqmNvcHlPYmplY3SoZmxhdFJlc3SsZ2V0QWxsS2V5c0lur2N1c3RvbU9taXRDbG9uZa9DTE9ORV9ERUVQX0ZMQUevQ0xPTkVfRkxBVF9GTEFHskNMT05FX1NZTUJPTFNfRkxBR9wANJYAAAHAwsOWABcCBcLClgkAA8DCwpYLCMDAwsKWzIAIwBDCwpYBFwYJwsKWCQAHwMLClgsJwMDCwpYxCcAnwsKWARcKDcLClgkAC8DCwpYLCcDAwsKWPwnAwMLClgEXDhHCwpYJAA/AwsKWCwjAwMLCliUIwBTCwpYBFxIVwsKWCQATwMLClgsKwMDCwpZTCsAgwsKWAR0WGcLClgkAF8DCwpYLDcDAwsKWEw3AwMLClgEXGh3CwpYJABvAwsKWCwjAwMLClgAIwATCwpYBFx4hwsKWCQAfwMLClgsMwMDCwpYJDMAIwsKWzQE0HiIkwsKWCQ/AGMLClgIPwAzCwpY6ASUuwsKWBAQmKMLClgAPwMDCwpYJD8AqwsKWBgQpK8LClgAPwMDCwpYDD8AtwsKWBgQswMLClgASwMDCwpYDEsAjwsKWzQI9AS8zwsKWBAAwwMLClgAEwDLCwpYJBMDAwsKWAzEcwMLClgIOMcDCwg==
====catalogjs annotation end====*/