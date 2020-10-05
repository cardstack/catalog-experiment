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

const _default = (omitBy);
export { _default as default };
/*====catalogjs annotation start====
lZOTwqsuL2Rpc3QvNi5qcwGTwqsuL25lZ2F0ZS5qcwWTwqsuL3BpY2tCeS5qcwmBp2RlZmF1bHSUoWyoX2RlZmF1bHQUwJGTFMDChaxiYXNlSXRlcmF0ZWWboWmQwgLAkgMEwADAp2RlZmF1bHSQpm5lZ2F0ZZuhaZDCBsCSBwjAAcCnZGVmYXVsdJCmcGlja0J5m6FpkMIKwJILDMACwKdkZWZhdWx0kKZvbWl0QnmboWyTpnBpY2tCeaZuZWdhdGWsYmFzZUl0ZXJhdGVlwg3Akg4PwMDAwJCoX2RlZmF1bHSboWyRpm9taXRCecIRwJISE8DAwMCQ3AAVlgAAAcDCw5YAFgIFwsKWCQADwMLClgsMwMDCwpYBDMDAwsKWARYGCcLClgkAB8DCwpYLBsDAwsKWCQbABMLClgEWCg3CwpYJAAvAwsKWCwbAwMLClh8GwAjCwpbNAm0QDhDCwpYJBsAMwsKWBAbAwMLClgIBERTCwpYGARLAwsKWAAjAD8LClgkIwMDCwpYBDhPAwsI=
====catalogjs annotation end====*/