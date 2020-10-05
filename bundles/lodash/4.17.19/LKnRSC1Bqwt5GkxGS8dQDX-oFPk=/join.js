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

const _default = (join);
export { _default as default };
/*====catalogjs annotation start====
lZCBp2RlZmF1bHSUoWyoX2RlZmF1bHQSwJGTEsDChKphcnJheVByb3Rvm6FskaVBcnJhecICBZIDBMDAwMCQqm5hdGl2ZUpvaW6boWyRqmFycmF5UHJvdG/CBwqSCAnAwMDAkaphcnJheVByb3RvpGpvaW6boWyRqm5hdGl2ZUpvaW7CC8CSDA3AwMDAkKhfZGVmYXVsdJuhbJGkam9pbsIPwJIQEcDAwMCQ3AATlgAAAcDCw5YsAQIGwsKWBAADwMLClgAKwAXCwpYACsDAwsKWAw/AwMLCllsBBwvCwpYEAAjAwsKWAArACsLCljMKwMDCwpYDBQTAwsKWzQFvGgwOwsKWCQTACcLClgQEwMDCwpYCAQ8SwsKWBgEQwMLClgAIwA3CwpYJCMDAwsKWAQ4RwMLC
====catalogjs annotation end====*/