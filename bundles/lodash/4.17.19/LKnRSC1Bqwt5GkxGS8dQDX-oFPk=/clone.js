import { default as baseClone } from "./dist/40.js";


/** Used to compose bitmasks for cloning. */

var CLONE_SYMBOLS_FLAG = 4;
/**
 * Creates a shallow clone of `value`.
 *
 * **Note:** This method is loosely based on the
 * [structured clone algorithm](https://mdn.io/Structured_clone_algorithm)
 * and supports cloning arrays, array buffers, booleans, date objects, maps,
 * numbers, `Object` objects, regexes, sets, strings, symbols, and typed
 * arrays. The own enumerable properties of `arguments` objects are cloned
 * as plain objects. An empty object is returned for uncloneable values such
 * as error objects, functions, DOM nodes, and WeakMaps.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to clone.
 * @returns {*} Returns the cloned value.
 * @see _.cloneDeep
 * @example
 *
 * var objects = [{ 'a': 1 }, { 'b': 2 }];
 *
 * var shallow = _.clone(objects);
 * console.log(shallow[0] === objects[0]);
 * // => true
 */

function clone(value) {
  return baseClone(value, CLONE_SYMBOLS_FLAG);
}

const _default = (clone);
export { _default as default };
/*====catalogjs annotation start====
lZGTwqwuL2Rpc3QvNDAuanMBgadkZWZhdWx0lKFsqF9kZWZhdWx0EMCRkxDAwoSpYmFzZUNsb25lm6FpkMICwJIDBMAAwKdkZWZhdWx0kLJDTE9ORV9TWU1CT0xTX0ZMQUeboWyQwgbAkgcIwMDAwJClY2xvbmWboWySqWJhc2VDbG9uZbJDTE9ORV9TWU1CT0xTX0ZMQUfCCcCSCgvAwMDAkKhfZGVmYXVsdJuhbJGlY2xvbmXCDcCSDg/AwMDAkNwAEZYAAAHAwsOWABcCBcLClgkAA8DCwpYLCcDAwsKWEwnACMLCljEBBgnCwpYEBAfAwsKWABLAwMLClggSwMDCwpbNA1UECgzCwpYJBcAEwsKWBAXAwMLClgIBDRDCwpYGAQ7AwsKWAAjAC8LClgkIwMDCwpYBDg/AwsI=
====catalogjs annotation end====*/