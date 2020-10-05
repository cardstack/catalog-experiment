/**
 * Checks `value` to determine whether a default value should be returned in
 * its place. The `defaultValue` is returned if `value` is `NaN`, `null`,
 * or `undefined`.
 *
 * @static
 * @memberOf _
 * @since 4.14.0
 * @category Util
 * @param {*} value The value to check.
 * @param {*} defaultValue The default value.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * _.defaultTo(1, 10);
 * // => 1
 *
 * _.defaultTo(undefined, 10);
 * // => 10
 */
function defaultTo(value, defaultValue) {
  return value == null || value !== value ? defaultValue : value;
}

const _default = (defaultTo);
export { _default as default };
/*====catalogjs annotation start====
lZCBp2RlZmF1bHSUoWyoX2RlZmF1bHQIwJGTCMDCgqlkZWZhdWx0VG+boWyQwgHAkgIDwMDAwJCoX2RlZmF1bHSboWyRqWRlZmF1bHRUb8IFwJIGB8DAwMCQmZYAAAHAwsOWzQHTWwIEwsKWCQnAwMLClgQJwMDCwpYCAQUIwsKWBgEGwMLClgAIwAPCwpYJCMDAwsKWAQ4HwMLC
====catalogjs annotation end====*/