import { default as chain } from "./chain.js";


/**
 * Creates a `lodash` wrapper instance with explicit method chain sequences enabled.
 *
 * @name chain
 * @memberOf _
 * @since 0.1.0
 * @category Seq
 * @returns {Object} Returns the new `lodash` wrapper instance.
 * @example
 *
 * var users = [
 *   { 'user': 'barney', 'age': 36 },
 *   { 'user': 'fred',   'age': 40 }
 * ];
 *
 * // A sequence without explicit chaining.
 * _(users).head();
 * // => { 'user': 'barney', 'age': 36 }
 *
 * // A sequence with explicit chaining.
 * _(users)
 *   .chain()
 *   .head()
 *   .pick('user')
 *   .value();
 * // => { 'user': 'barney' }
 */

function wrapperChain() {
  return chain(this);
}

const _default = (wrapperChain);
export { _default as default };
/*====catalogjs annotation start====
lZGTwqouL2NoYWluLmpzAYGnZGVmYXVsdJShbKhfZGVmYXVsdAzAkZMMwMKDpWNoYWlum6FpkMICwJIDBMAAwKdkZWZhdWx0kKx3cmFwcGVyQ2hhaW6boWyRpWNoYWluwgXAkgYHwMDAwJCoX2RlZmF1bHSboWyRrHdyYXBwZXJDaGFpbsIJwJIKC8DAwMCQnZYAAAHAwsOWABUCBcLClgkAA8DCwpYLBcDAwsKWDgXAwMLCls0CUwkGCMLClgkMwATCwpYEDMDAwsKWAgEJDMLClgYBCsDCwpYACMAHwsKWCQjAwMLClgEOC8DCwg==
====catalogjs annotation end====*/