import { default as baseUniq } from "./dist/63.js";


/**
 * This method is like `_.uniq` except that it accepts `comparator` which
 * is invoked to compare elements of `array`. The order of result values is
 * determined by the order they occur in the array.The comparator is invoked
 * with two arguments: (arrVal, othVal).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new duplicate free array.
 * @example
 *
 * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }, { 'x': 1, 'y': 2 }];
 *
 * _.uniqWith(objects, _.isEqual);
 * // => [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }]
 */

function uniqWith(array, comparator) {
  comparator = typeof comparator == 'function' ? comparator : undefined;
  return array && array.length ? baseUniq(array, undefined, comparator) : [];
}


export { uniqWith as default };
/*====catalogjs annotation start====
lZGVwqwuL2Rpc3QvNjMuanMBwsCBp2RlZmF1bHSUoWyodW5pcVdpdGgIwJGTCMDAgqhiYXNlVW5pcZuhaZDCAsCSAwTAAMCnZGVmYXVsdJCodW5pcVdpdGiboWyRqGJhc2VVbmlxwgXAkgYHwMDAwJCZlgAAAcDCw5YAFwIFwsKWCQADwMLClgsIwMDCwpbMgAjAwMLCls0CvCYGCMLClgkIwATCwpYJCMDAwsKWAw4HwMLC
====catalogjs annotation end====*/