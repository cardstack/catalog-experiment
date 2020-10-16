import { default as arrayMap } from "./dist/98.js";
import { default as baseIteratee } from "./dist/6.js";
import { default as basePickBy } from "./dist/12.js";
import { default as getAllKeysIn } from "./dist/80.js";





/**
 * Creates an object composed of the `object` properties `predicate` returns
 * truthy for. The predicate is invoked with two arguments: (value, key).
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
 * _.pickBy(object, _.isNumber);
 * // => { 'a': 1, 'c': 3 }
 */

function pickBy(object, predicate) {
  if (object == null) {
    return {};
  }

  var props = arrayMap(getAllKeysIn(object), function (prop) {
    return [prop];
  });
  predicate = baseIteratee(predicate);
  return basePickBy(object, props, function (value, path) {
    return predicate(value, path[0]);
  });
}


export { pickBy as default };
/*====catalogjs annotation start====
lZSVwqwuL2Rpc3QvOTguanMBwsCVwqsuL2Rpc3QvNi5qcwXCwJXCrC4vZGlzdC8xMi5qcwnCwJXCrC4vZGlzdC84MC5qcw3CwIGnZGVmYXVsdJShbKZwaWNrQnkUwJGTFMDAhahhcnJheU1hcJuhaZDCAsCSAwTAAMCnZGVmYXVsdJCsYmFzZUl0ZXJhdGVlm6FpkMIGwJIHCMABwKdkZWZhdWx0kKpiYXNlUGlja0J5m6FpkMIKwJILDMACwKdkZWZhdWx0kKxnZXRBbGxLZXlzSW6boWmQwg7Akg8QwAPAp2RlZmF1bHSQpnBpY2tCeZuhbJSoYXJyYXlNYXCsZ2V0QWxsS2V5c0lurGJhc2VJdGVyYXRlZapiYXNlUGlja0J5whHAkhITwMDAwJDcABWWAAABwMLDlgAXAgXCwpYJAAPAwsKWCwjAwMLCllAIwBDCwpYBFgYJwsKWCQAHwMLClgsMwMDCwpZDDMAMwsKWARcKDcLClgkAC8DCwpYLCsDAwsKWFgrAwMLClgEXDhHCwpYJAA/AwsKWCwzAwMLClgEMwAjCwpbNAg1WEhTCwpYJBsAEwsKWCQbAwMLClgMOE8DCwg==
====catalogjs annotation end====*/