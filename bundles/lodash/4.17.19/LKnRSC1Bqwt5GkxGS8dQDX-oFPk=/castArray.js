import { default as isArray } from "./isArray.js";


/**
 * Casts `value` as an array if it's not one.
 *
 * @static
 * @memberOf _
 * @since 4.4.0
 * @category Lang
 * @param {*} value The value to inspect.
 * @returns {Array} Returns the cast array.
 * @example
 *
 * _.castArray(1);
 * // => [1]
 *
 * _.castArray({ 'a': 1 });
 * // => [{ 'a': 1 }]
 *
 * _.castArray('abc');
 * // => ['abc']
 *
 * _.castArray(null);
 * // => [null]
 *
 * _.castArray(undefined);
 * // => [undefined]
 *
 * _.castArray();
 * // => []
 *
 * var array = [1, 2, 3];
 * console.log(_.castArray(array) === array);
 * // => true
 */

function castArray() {
  if (!arguments.length) {
    return [];
  }

  var value = arguments[0];
  return isArray(value) ? value : [value];
}

const _default = (castArray);
export { _default as default };
/*====catalogjs annotation start====
lZGTwqwuL2lzQXJyYXkuanMBgadkZWZhdWx0lKFsqF9kZWZhdWx0DMCRkwzAwoOnaXNBcnJheZuhaZDCAsCSAwTAAMCnZGVmYXVsdJCpY2FzdEFycmF5m6Fskadpc0FycmF5wgXAkgYHwMDAwJCoX2RlZmF1bHSboWyRqWNhc3RBcnJhecIJwJIKC8DAwMCQnZYAAAHAwsOWABcCBcLClgkAA8DCwpYLB8DAwsKWWQfAwMLCls0CNBwGCMLClgkJwATCwpYECcDAwsKWAgEJDMLClgYBCsDCwpYACMAHwsKWCQjAwMLClgEOC8DCwg==
====catalogjs annotation end====*/