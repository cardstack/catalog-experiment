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


export { forOwnRight as default };
/*====catalogjs annotation start====
lZKVwqwuL2Rpc3QvNzkuanMBwsCVwq0uL2Rpc3QvMTA4LmpzBcLAgadkZWZhdWx0lKFsq2Zvck93blJpZ2h0DMCRkwzAwIOvYmFzZUZvck93blJpZ2h0m6FpkMICwJIDBMAAwKdkZWZhdWx0kKxjYXN0RnVuY3Rpb26boWmQwgbAkgcIwAHAp2RlZmF1bHSQq2Zvck93blJpZ2h0m6Fskq9iYXNlRm9yT3duUmlnaHSsY2FzdEZ1bmN0aW9uwgnAkgoLwMDAwJCdlgAAAcDCw5YAFwIFwsKWCQADwMLClgsPwMDCwpYoD8AIwsKWARgGCcLClgkAB8DCwpYLDMDAwsKWCQzAwMLCls0CdA4KDMLClgkLwATCwpYJC8DAwsKWAw4LwMLC
====catalogjs annotation end====*/