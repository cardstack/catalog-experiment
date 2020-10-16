import { default as apply } from "./dist/111.js";
import { default as arrayMap } from "./dist/98.js";
import { default as unzip } from "./unzip.js";




/**
 * This method is like `_.unzip` except that it accepts `iteratee` to specify
 * how regrouped values should be combined. The iteratee is invoked with the
 * elements of each group: (...group).
 *
 * @static
 * @memberOf _
 * @since 3.8.0
 * @category Array
 * @param {Array} array The array of grouped elements to process.
 * @param {Function} [iteratee=_.identity] The function to combine
 *  regrouped values.
 * @returns {Array} Returns the new array of regrouped elements.
 * @example
 *
 * var zipped = _.zip([1, 2], [10, 20], [100, 200]);
 * // => [[1, 10, 100], [2, 20, 200]]
 *
 * _.unzipWith(zipped, _.add);
 * // => [3, 30, 300]
 */

function unzipWith(array, iteratee) {
  if (!(array && array.length)) {
    return [];
  }

  var result = unzip(array);

  if (iteratee == null) {
    return result;
  }

  return arrayMap(result, function (group) {
    return apply(iteratee, undefined, group);
  });
}


export { unzipWith as default };
/*====catalogjs annotation start====
lZOVwq0uL2Rpc3QvMTExLmpzAcLAlcKsLi9kaXN0Lzk4LmpzBcLAlcKqLi91bnppcC5qcwnCwIGnZGVmYXVsdJShbKl1bnppcFdpdGgQwJGTEMDAhKVhcHBseZuhaZDCAsCSAwTAAMCnZGVmYXVsdJCoYXJyYXlNYXCboWmQwgbAkgcIwAHAp2RlZmF1bHSQpXVuemlwm6FpkMIKwJILDMACwKdkZWZhdWx0kKl1bnppcFdpdGiboWyTpXVuemlwqGFycmF5TWFwpWFwcGx5wg3Akg4PwMDAwJDcABGWAAABwMLDlgAYAgXCwpYJAAPAwsKWCwXAwMLClicFwMDCwpYBFwYJwsKWCQAHwMLClgsIwMDCwpZFCMAEwsKWARUKDcLClgkAC8DCwpYLBcDAwsKWWQXACMLCls0CjiUOEMLClgkJwAzCwpYJCcDAwsKWAw4PwMLC
====catalogjs annotation end====*/