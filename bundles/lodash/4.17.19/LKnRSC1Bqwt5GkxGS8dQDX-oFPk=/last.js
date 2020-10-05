/**
 * Gets the last element of `array`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to query.
 * @returns {*} Returns the last element of `array`.
 * @example
 *
 * _.last([1, 2, 3]);
 * // => 3
 */
function last(array) {
  var length = array == null ? 0 : array.length;
  return length ? array[length - 1] : undefined;
}

const _default = (last);
export { _default as default };
/*====catalogjs annotation start====
lZCBp2RlZmF1bHSUoWyoX2RlZmF1bHQIwJGTCMDCgqRsYXN0m6FskMIBwJICA8DAwMCQqF9kZWZhdWx0m6FskaRsYXN0wgXAkgYHwMDAwJCZlgAAAcDCw5bM/m0CBMLClgkEwMDCwpYEBMDAwsKWAgEFCMLClgYBBsDCwpYACMADwsKWCQjAwMLClgEOB8DCwg==
====catalogjs annotation end====*/