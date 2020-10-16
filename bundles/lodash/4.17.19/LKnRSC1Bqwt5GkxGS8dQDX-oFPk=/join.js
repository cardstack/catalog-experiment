/** Used for built-in method references. */
var arrayProto = Array.prototype;
/* Built-in method references for those with the same name as other `lodash` methods. */

var nativeJoin = arrayProto.join;
/**
 * Converts all elements in `array` into a string separated by `separator`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to convert.
 * @param {string} [separator=','] The element separator.
 * @returns {string} Returns the joined string.
 * @example
 *
 * _.join(['a', 'b', 'c'], '~');
 * // => 'a~b~c'
 */

function join(array, separator) {
  return array == null ? '' : nativeJoin.call(array, separator);
}


export { join as default };
/*====catalogjs annotation start====
lZCBp2RlZmF1bHSUoWykam9pbg7AkZMOwMCDqmFycmF5UHJvdG+boWyRpUFycmF5wgIFkgMEwMDAwJCqbmF0aXZlSm9pbpuhbJGqYXJyYXlQcm90b8IHCpIICcDAwMCRqmFycmF5UHJvdG+kam9pbpuhbJGqbmF0aXZlSm9pbsILwJIMDcDAwMCQn5YAAAHAwsOWLAECBsLClgQAA8DCwpYACsAFwsKWAArAwMLClgMPwMDCwpZbAQcLwsKWBAAIwMLClgAKwArCwpYzCsDAwsKWAwUEwMLCls0BbxoMDsLClgkEwAnCwpYJBMDAwsKWAw4NwMLC
====catalogjs annotation end====*/