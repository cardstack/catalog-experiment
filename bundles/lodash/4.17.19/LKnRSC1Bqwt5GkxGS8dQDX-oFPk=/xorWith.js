import { default as arrayFilter } from "./dist/150.js";
import { default as baseRest } from "./dist/49.js";
import { default as baseXor } from "./dist/60.js";
import { default as isArrayLikeObject } from "./isArrayLikeObject.js";
import { default as last } from "./last.js";






/**
 * This method is like `_.xor` except that it accepts `comparator` which is
 * invoked to compare elements of `arrays`. The order of result values is
 * determined by the order they occur in the arrays. The comparator is invoked
 * with two arguments: (arrVal, othVal).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {...Array} [arrays] The arrays to inspect.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new array of filtered values.
 * @example
 *
 * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
 * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
 *
 * _.xorWith(objects, others, _.isEqual);
 * // => [{ 'x': 2, 'y': 1 }, { 'x': 1, 'y': 1 }]
 */

var xorWith = baseRest(function (arrays) {
  var comparator = last(arrays);
  comparator = typeof comparator == 'function' ? comparator : undefined;
  return baseXor(arrayFilter(arrays, isArrayLikeObject), undefined, comparator);
});

export { xorWith as default };
/*====catalogjs annotation start====
lZWVwq0uL2Rpc3QvMTUwLmpzAcLAlcKsLi9kaXN0LzQ5LmpzBcLAlcKsLi9kaXN0LzYwLmpzCcLAlcK2Li9pc0FycmF5TGlrZU9iamVjdC5qcw3CwJXCqS4vbGFzdC5qcxHCwIGnZGVmYXVsdJShbKd4b3JXaXRoGsCRkxrAwIarYXJyYXlGaWx0ZXKboWmQwgLAkgMEwADAp2RlZmF1bHSQqGJhc2VSZXN0m6FpkMIGwJIHCMABwKdkZWZhdWx0kKdiYXNlWG9ym6FpkMIKwJILDMACwKdkZWZhdWx0kLFpc0FycmF5TGlrZU9iamVjdJuhaZDCDsCSDxDAA8CnZGVmYXVsdJCkbGFzdJuhaZDCEsCSExTABMCnZGVmYXVsdJCneG9yV2l0aJuhbJWoYmFzZVJlc3SkbGFzdKdiYXNlWG9yq2FycmF5RmlsdGVysWlzQXJyYXlMaWtlT2JqZWN0whYZkhcYwMDAwJWrYXJyYXlGaWx0ZXKoYmFzZVJlc3SnYmFzZVhvcrFpc0FycmF5TGlrZU9iamVjdKRsYXN03AAblgAAAcDCw5YAGAIFwsKWCQADwMLClgsLwMDCwpYBC8AQwsKWARcGCcLClgkAB8DCwpYLCMDAwsKWAAjAFMLClgEXCg3CwpYJAAvAwsKWCwfAwMLCllwHwATCwpYBIQ4RwsKWCQAPwMLClgsRwMDCwpYJEcDAwsKWARQSFcLClgkAE8DCwpYLBMDAwsKWKATADMLCls0C+gEWGsLClgQAF8DCwpYAB8AZwsKWCQfAwMLClgMdCMDCwpYCDhjAwsI=
====catalogjs annotation end====*/