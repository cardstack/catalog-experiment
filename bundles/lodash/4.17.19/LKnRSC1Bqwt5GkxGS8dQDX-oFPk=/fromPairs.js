/**
 * The inverse of `_.toPairs`; this method returns an object composed
 * from key-value `pairs`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} pairs The key-value pairs.
 * @returns {Object} Returns the new object.
 * @example
 *
 * _.fromPairs([['a', 1], ['b', 2]]);
 * // => { 'a': 1, 'b': 2 }
 */
function fromPairs(pairs) {
  var index = -1,
      length = pairs == null ? 0 : pairs.length,
      result = {};

  while (++index < length) {
    var pair = pairs[index];
    result[pair[0]] = pair[1];
  }

  return result;
}

const _default = (fromPairs);
export { _default as default };
/*====catalogjs annotation start====
lZCBp2RlZmF1bHSUoWyoX2RlZmF1bHQIwJGTCMDCgqlmcm9tUGFpcnOboWyQwgHAkgIDwMDAwJCoX2RlZmF1bHSboWyRqWZyb21QYWlyc8IFwJIGB8DAwMCQmZYAAAHAwsOWzQFUzNECBMLClgkJwMDCwpYECcDAwsKWAgEFCMLClgYBBsDCwpYACMADwsKWCQjAwMLClgEOB8DCwg==
====catalogjs annotation end====*/