import { default as baseForOwn } from "./dist/77.js";
import { default as castFunction } from "./dist/108.js";



/**
 * Iterates over own enumerable string keyed properties of an object and
 * invokes `iteratee` for each property. The iteratee is invoked with three
 * arguments: (value, key, object). Iteratee functions may exit iteration
 * early by explicitly returning `false`.
 *
 * @static
 * @memberOf _
 * @since 0.3.0
 * @category Object
 * @param {Object} object The object to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Object} Returns `object`.
 * @see _.forOwnRight
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.forOwn(new Foo, function(value, key) {
 *   console.log(key);
 * });
 * // => Logs 'a' then 'b' (iteration order is not guaranteed).
 */

function forOwn(object, iteratee) {
  return object && baseForOwn(object, castFunction(iteratee));
}

const _default = (forOwn);
export { _default as default };
/*====catalogjs annotation start====
lZKTwqwuL2Rpc3QvNzcuanMBk8KtLi9kaXN0LzEwOC5qcwWBp2RlZmF1bHSUoWyoX2RlZmF1bHQQwJGTEMDChKpiYXNlRm9yT3dum6FpkMICwJIDBMAAwKdkZWZhdWx0kKxjYXN0RnVuY3Rpb26boWmQwgbAkgcIwAHAp2RlZmF1bHSQpmZvck93bpuhbJKqYmFzZUZvck93bqxjYXN0RnVuY3Rpb27CCcCSCgvAwMDAkKhfZGVmYXVsdJuhbJGmZm9yT3duwg3Akg4PwMDAwJDcABGWAAABwMLDlgAXAgXCwpYJAAPAwsKWCwrAwMLCligKwAjCwpYBGAYJwsKWCQAHwMLClgsMwMDCwpYJDMDAwsKWzQMLDgoMwsKWCQbABMLClgQGwMDCwpYCAQ0QwsKWBgEOwMLClgAIwAvCwpYJCMDAwsKWAQ4PwMLC
====catalogjs annotation end====*/