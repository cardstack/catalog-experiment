import { default as baseEachRight } from "./dist/78.js";
import { default as castFunction } from "./dist/108.js";
import { default as isArray } from "./isArray.js";

/**
 * A specialized version of `_.forEachRight` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEachRight0(array, iteratee) {
  var length = array == null ? 0 : array.length;

  while (length--) {
    if (iteratee(array[length], length, array) === false) {
      break;
    }
  }

  return array;
}

const arrayEachRight = (arrayEachRight0);





/**
 * This method is like `_.forEach` except that it iterates over elements of
 * `collection` from right to left.
 *
 * @static
 * @memberOf _
 * @since 2.0.0
 * @alias eachRight
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 * @see _.forEach
 * @example
 *
 * _.forEachRight([1, 2], function(value) {
 *   console.log(value);
 * });
 * // => Logs `2` then `1`.
 */

function forEachRight(collection, iteratee) {
  var func = isArray(collection) ? arrayEachRight : baseEachRight;
  return func(collection, castFunction(iteratee));
}

const _default = (forEachRight);
export { _default as default };
/*====catalogjs annotation start====
lZOTwqwuL2Rpc3QvNzguanMBk8KtLi9kaXN0LzEwOC5qcwWTwqwuL2lzQXJyYXkuanMJgadkZWZhdWx0lKFsqF9kZWZhdWx0G8CRkxvAwoetYmFzZUVhY2hSaWdodJuhaZDCAsCSAwTAAMCnZGVmYXVsdJCsY2FzdEZ1bmN0aW9um6FpkMIGwJIHCMABwKdkZWZhdWx0kKdpc0FycmF5m6FpkMIKwJILDMACwKdkZWZhdWx0kK9hcnJheUVhY2hSaWdodDCboWyQwg3Akg4PwMDAwJCuYXJyYXlFYWNoUmlnaHSboWyRr2FycmF5RWFjaFJpZ2h0MMIRwJISE5LZXWh0dHBzOi8vY2F0YWxvZ2pzLmNvbS9wa2dzL25wbS9sb2Rhc2gvNC4xNy4xOS9MS25SU0MxQnF3dDVHa3hHUzhkUURYLW9GUGs9L19hcnJheUVhY2hSaWdodC5qc6dkZWZhdWx0wMDAkKxmb3JFYWNoUmlnaHSboWyUp2lzQXJyYXmuYXJyYXlFYWNoUmlnaHStYmFzZUVhY2hSaWdodKxjYXN0RnVuY3Rpb27CFMCSFRbAwMDAkKhfZGVmYXVsdJuhbJGsZm9yRWFjaFJpZ2h0whjAkhkawMDAwJDcAByWAAABwMLDlgAXAgXCwpYJAAPAwsKWCw3AwMLClgMNwAjCwpYBGAYJwsKWCQAHwMLClgsMwMDCwpYcDMDAwsKWARcKDcLClgkAC8DCwpYLB8DAwsKWJgfAE8LCls0BGczADhDCwpYJD8DAwsKWBA/AwMLClgIBERTCwpYGARLAwsKWAA7AD8LClg8OwATCwpbNAiUOFRfCwpYJDMAMwsKWBAzAwMLClgIBGBvCwpYGARnAwsKWAAjAFsLClgkIwMDCwpYBDhrAwsI=
====catalogjs annotation end====*/