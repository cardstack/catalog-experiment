import { default as baseIteratee } from "./dist/6.js";
import { default as negate } from "./negate.js";
import { default as pickBy } from "./pickBy.js";




/**
 * The opposite of `_.pickBy`; this method creates an object composed of
 * the own and inherited enumerable string keyed properties of `object` that
 * `predicate` doesn't return truthy for. The predicate is invoked with two
 * arguments: (value, key).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The source object.
 * @param {Function} [predicate=_.identity] The function invoked per property.
 * @returns {Object} Returns the new object.
 * @example
 *
 * var object = { 'a': 1, 'b': '2', 'c': 3 };
 *
 * _.omitBy(object, _.isNumber);
 * // => { 'b': '2' }
 */

function omitBy(object, predicate) {
  return pickBy(object, negate(baseIteratee(predicate)));
}


export { omitBy as default };
/*====catalogjs annotation start====
lZOVwqsuL2Rpc3QvNi5qcwHCwJXCqy4vbmVnYXRlLmpzBcLAlcKrLi9waWNrQnkuanMJwsCBp2RlZmF1bHSUoWymb21pdEJ5EMCRkxDAwISsYmFzZUl0ZXJhdGVlm6FpkMICwJIDBMAAwKdkZWZhdWx0kKZuZWdhdGWboWmQwgbAkgcIwAHAp2RlZmF1bHSQpnBpY2tCeZuhaZDCCsCSCwzAAsCnZGVmYXVsdJCmb21pdEJ5m6Fsk6ZwaWNrQnmmbmVnYXRlrGJhc2VJdGVyYXRlZcINwJIOD8DAwMCQ3AARlgAAAcDCw5YAFgIFwsKWCQADwMLClgsMwMDCwpYBDMDAwsKWARYGCcLClgkAB8DCwpYLBsDAwsKWCQbABMLClgEWCg3CwpYJAAvAwsKWCwbAwMLClh8GwAjCwpbNAm0QDhDCwpYJBsAMwsKWCQbAwMLClgMOD8DCwg==
====catalogjs annotation end====*/