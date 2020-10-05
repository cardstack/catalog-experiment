/**
 * Creates an array with all falsey values removed. The values `false`, `null`,
 * `0`, `""`, `undefined`, and `NaN` are falsey.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to compact.
 * @returns {Array} Returns the new array of filtered values.
 * @example
 *
 * _.compact([0, 1, false, 2, '', 3]);
 * // => [1, 2, 3]
 */
function compact(array) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];

    if (value) {
      result[resIndex++] = value;
    }
  }

  return result;
}

const _default = (compact);
export { _default as default };
/*====catalogjs annotation start====
lZCBp2RlZmF1bHSUoWyoX2RlZmF1bHQIwJGTCMDCgqdjb21wYWN0m6FskMIBwJICA8DAwMCQqF9kZWZhdWx0m6Fskadjb21wYWN0wgXAkgYHwMDAwJCZlgAAAcDCw5bNAX7NAQECBMLClgkHwMDCwpYEB8DAwsKWAgEFCMLClgYBBsDCwpYACMADwsKWCQjAwMLClgEOB8DCwg==
====catalogjs annotation end====*/