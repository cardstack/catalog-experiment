import { default as baseForOwnRight } from "./dist/79.js";
import { default as castFunction } from "./dist/108.js";



/**
 * This method is like `_.forOwn` except that it iterates over properties of
 * `object` in the opposite order.
 *
 * @static
 * @memberOf _
 * @since 2.0.0
 * @category Object
 * @param {Object} object The object to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Object} Returns `object`.
 * @see _.forOwn
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.forOwnRight(new Foo, function(value, key) {
 *   console.log(key);
 * });
 * // => Logs 'b' then 'a' assuming `_.forOwn` logs 'a' then 'b'.
 */

function forOwnRight(object, iteratee) {
  return object && baseForOwnRight(object, castFunction(iteratee));
}

const _default = (forOwnRight);
export { _default as default };
/*====catalogjs annotation start====
lZKTwqwuL2Rpc3QvNzkuanMBk8KtLi9kaXN0LzEwOC5qcwWBp2RlZmF1bHSUoWyoX2RlZmF1bHQQwJGTEMDChK9iYXNlRm9yT3duUmlnaHSboWmQwgLAkgMEwADAp2RlZmF1bHSQrGNhc3RGdW5jdGlvbpuhaZDCBsCSBwjAAcCnZGVmYXVsdJCrZm9yT3duUmlnaHSboWySr2Jhc2VGb3JPd25SaWdodKxjYXN0RnVuY3Rpb27CCcCSCgvAwMDAkKhfZGVmYXVsdJuhbJGrZm9yT3duUmlnaHTCDcCSDg/AwMDAkNwAEZYAAAHAwsOWABcCBcLClgkAA8DCwpYLD8DAwsKWKA/ACMLClgEYBgnCwpYJAAfAwsKWCwzAwMLClgkMwMDCwpbNAnQOCgzCwpYJC8AEwsKWBAvAwMLClgIBDRDCwpYGAQ7AwsKWAAjAC8LClgkIwMDCwpYBDg/AwsI=
====catalogjs annotation end====*/