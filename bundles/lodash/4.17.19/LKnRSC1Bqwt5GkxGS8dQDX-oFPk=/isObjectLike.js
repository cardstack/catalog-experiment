/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

const _default = (isObjectLike);
export { _default as default };
/*====catalogjs annotation start====
lZCBp2RlZmF1bHSUoWyoX2RlZmF1bHQIwJGTCMDCgqxpc09iamVjdExpa2WboWyQwgHAkgIDwMDAwJCoX2RlZmF1bHSboWyRrGlzT2JqZWN0TGlrZcIFwJIGB8DAwMCQmZYAAAHAwsOWzQHxPwIEwsKWCQzAwMLClgQMwMDCwpYCAQUIwsKWBgEGwMLClgAIwAPCwpYJCMDAwsKWAQ4HwMLC
====catalogjs annotation end====*/