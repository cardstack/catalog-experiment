/**
 * This method is like `_.tap` except that it returns the result of `interceptor`.
 * The purpose of this method is to "pass thru" values replacing intermediate
 * results in a method chain sequence.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Seq
 * @param {*} value The value to provide to `interceptor`.
 * @param {Function} interceptor The function to invoke.
 * @returns {*} Returns the result of `interceptor`.
 * @example
 *
 * _('  abc  ')
 *  .chain()
 *  .trim()
 *  .thru(function(value) {
 *    return [value];
 *  })
 *  .value();
 * // => ['abc']
 */
function thru(value, interceptor) {
  return interceptor(value);
}

const _default = (thru);
export { _default as default };
/*====catalogjs annotation start====
lZCBp2RlZmF1bHSUoWyoX2RlZmF1bHQIwJGTCMDCgqR0aHJ1m6FskMIBwJICA8DAwMCQqF9kZWZhdWx0m6FskaR0aHJ1wgXAkgYHwMDAwJCZlgAAAcDCw5bNAkc1AgTCwpYJBMDAwsKWBATAwMLClgIBBQjCwpYGAQbAwsKWAAjAA8LClgkIwMDCwpYBDgfAwsI=
====catalogjs annotation end====*/