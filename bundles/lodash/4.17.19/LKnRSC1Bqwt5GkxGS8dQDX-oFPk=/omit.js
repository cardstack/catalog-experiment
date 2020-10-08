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

function customOmitClone0(value) {
  return isPlainObject(value) ? undefined : value;
}

const customOmitClone = (customOmitClone0);









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
const _default = (omit);
export { _default as default };
/*====catalogjs annotation start====
lZiTwqwuL2Rpc3QvOTguanMBk8KsLi9kaXN0LzQwLmpzBZPCrC4vZGlzdC8xMC5qcwmTwqwuL2Rpc3QvMTcuanMNk8KsLi9kaXN0LzU0LmpzEZPCsi4vaXNQbGFpbk9iamVjdC5qcxWTwqwuL2Rpc3QvNTAuanMZk8KsLi9kaXN0LzgwLmpzHYGnZGVmYXVsdJShbKhfZGVmYXVsdDvAkZM7wMKPqGFycmF5TWFwm6FpkMICwJIDBMAAwKdkZWZhdWx0kKliYXNlQ2xvbmWboWmQwgbAkgcIwAHAp2RlZmF1bHSQqWJhc2VVbnNldJuhaZDCCsCSCwzAAsCnZGVmYXVsdJCoY2FzdFBhdGiboWmQwg7Akg8QwAPAp2RlZmF1bHSQqmNvcHlPYmplY3SboWmQwhLAkhMUwATAp2RlZmF1bHSQrWlzUGxhaW5PYmplY3SboWmQwhbAkhcYwAXAp2RlZmF1bHSQqGZsYXRSZXN0m6FpkMIawJIbHMAGwKdkZWZhdWx0kKxnZXRBbGxLZXlzSW6boWmQwh7Akh8gwAfAp2RlZmF1bHSQsGN1c3RvbU9taXRDbG9uZTCboWyRrWlzUGxhaW5PYmplY3TCIcCSIiPAwMDAkK9jdXN0b21PbWl0Q2xvbmWboWyRsGN1c3RvbU9taXRDbG9uZTDCJcCSJieS2V5odHRwczovL2NhdGFsb2dqcy5jb20vcGtncy9ucG0vbG9kYXNoLzQuMTcuMTkvTEtuUlNDMUJxd3Q1R2t4R1M4ZFFEWC1vRlBrPS9fY3VzdG9tT21pdENsb25lLmpzp2RlZmF1bHTAwMCQr0NMT05FX0RFRVBfRkxBR5uhbJDCKcCSKivAwMDAkK9DTE9ORV9GTEFUX0ZMQUeboWyQwizAki0uwMDAwJCyQ0xPTkVfU1lNQk9MU19GTEFHm6FskMIvwJIwMcDAwMCQpG9taXSboWybqGZsYXRSZXN0qGFycmF5TWFwqGNhc3RQYXRoqmNvcHlPYmplY3SsZ2V0QWxsS2V5c0luqWJhc2VDbG9uZa9DTE9ORV9ERUVQX0ZMQUevQ0xPTkVfRkxBVF9GTEFHskNMT05FX1NZTUJPTFNfRkxBR69jdXN0b21PbWl0Q2xvbmWpYmFzZVVuc2V0wjM2kjQ1wMDAwJuoYXJyYXlNYXCpYmFzZUNsb25lqWJhc2VVbnNldKhjYXN0UGF0aKpjb3B5T2JqZWN0qGZsYXRSZXN0rGdldEFsbEtleXNJbq9jdXN0b21PbWl0Q2xvbmWvQ0xPTkVfREVFUF9GTEFHr0NMT05FX0ZMQVRfRkxBR7JDTE9ORV9TWU1CT0xTX0ZMQUeoX2RlZmF1bHSboWyRpG9taXTCOMCSOTrAwMDAkNwAPJYAAAHAwsOWABcCBcLClgkAA8DCwpYLCMDAwsKWzIAIwBDCwpYBFwYJwsKWCQAHwMLClgsJwMDCwpYxCcArwsKWARcKDcLClgkAC8DCwpYLCcDAwsKWPwnAwMLClgEXDhHCwpYJAA/AwsKWCwjAwMLCliUIwBTCwpYBFxIVwsKWCQATwMLClgsKwMDCwpZTCsAgwsKWAR0WGcLClgkAF8DCwpYLDcDAwsKWEw3AwMLClgEXGh3CwpYJABvAwsKWCwjAwMLClgAIwATCwpYBFx4hwsKWCQAfwMLClgsMwMDCwpYJDMAIwsKWzQE0HiIkwsKWCRDAGMLClgQQwMDCwpYCASUowsKWBgEmwMLClgAPwCPCwpYCD8AMwsKWOAEpMsLClgQEKizCwpYAD8DAwsKWCQ/ALsLClgYELS/CwpYAD8DAwsKWAw/AMcLClgYEMMDCwpYAEsDAwsKWAxLAJ8LCls0CPQEzN8LClgQANMDCwpYABMA2wsKWBATAwMLClgMxHMDCwpYBATg7wsKWBgE5wMLClgAIwDXCwpYJCMDAwsKWAQ46wMLC
====catalogjs annotation end====*/