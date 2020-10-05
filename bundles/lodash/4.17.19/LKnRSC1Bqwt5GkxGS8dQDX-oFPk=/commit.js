import { default as LodashWrapper } from "./dist/104.js";


/**
 * Executes the chain sequence and returns the wrapped result.
 *
 * @name commit
 * @memberOf _
 * @since 3.2.0
 * @category Seq
 * @returns {Object} Returns the new `lodash` wrapper instance.
 * @example
 *
 * var array = [1, 2];
 * var wrapped = _(array).push(3);
 *
 * console.log(array);
 * // => [1, 2]
 *
 * wrapped = wrapped.commit();
 * console.log(array);
 * // => [1, 2, 3]
 *
 * wrapped.last();
 * // => 3
 *
 * console.log(array);
 * // => [1, 2, 3]
 */

function wrapperCommit() {
  return new LodashWrapper(this.value(), this.__chain__);
}

const _default = (wrapperCommit);
export { _default as default };
/*====catalogjs annotation start====
lZGTwq0uL2Rpc3QvMTA0LmpzAYGnZGVmYXVsdJShbKhfZGVmYXVsdAzAkZMMwMKDrUxvZGFzaFdyYXBwZXKboWmQwgLAkgMEwADAp2RlZmF1bHSQrXdyYXBwZXJDb21taXSboWyRrUxvZGFzaFdyYXBwZXLCBcCSBgfAwMDAkKhfZGVmYXVsdJuhbJGtd3JhcHBlckNvbW1pdMIJwJIKC8DAwMCQnZYAAAHAwsOWABgCBcLClgkAA8DCwpYLDcDAwsKWEg3AwMLCls0B2yEGCMLClgkNwATCwpYEDcDAwsKWAgEJDMLClgYBCsDCwpYACMAHwsKWCQjAwMLClgEOC8DCwg==
====catalogjs annotation end====*/