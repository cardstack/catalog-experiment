import { default as baseProperty } from "./dist/156.js";
import { default as baseGet } from "./dist/14.js";
import { default as isKey } from "./dist/26.js";
import { default as toKey } from "./dist/27.js";


/**
 * A specialized version of `baseProperty` which supports deep paths.
 *
 * @private
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 */

function basePropertyDeep0(path) {
  return function (object) {
    return baseGet(object, path);
  };
}

const basePropertyDeep = (basePropertyDeep0);





/**
 * Creates a function that returns the value at `path` of a given object.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 * @example
 *
 * var objects = [
 *   { 'a': { 'b': 2 } },
 *   { 'a': { 'b': 1 } }
 * ];
 *
 * _.map(objects, _.property('a.b'));
 * // => [2, 1]
 *
 * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
 * // => [1, 2]
 */

function property(path) {
  return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
}

const _default = (property);
export { _default as default };
/*====catalogjs annotation start====
lZSTwq0uL2Rpc3QvMTU2LmpzAZPCrC4vZGlzdC8xNC5qcwWTwqwuL2Rpc3QvMjYuanMJk8KsLi9kaXN0LzI3LmpzDYGnZGVmYXVsdJShbKhfZGVmYXVsdB/AkZMfwMKIrGJhc2VQcm9wZXJ0eZuhaZDCAsCSAwTAAMCnZGVmYXVsdJCnYmFzZUdldJuhaZDCBsCSBwjAAcCnZGVmYXVsdJClaXNLZXmboWmQwgrAkgsMwALAp2RlZmF1bHSQpXRvS2V5m6FpkMIOwJIPEMADwKdkZWZhdWx0kLFiYXNlUHJvcGVydHlEZWVwMJuhbJGnYmFzZUdldMIRwJISE8DAwMCQsGJhc2VQcm9wZXJ0eURlZXCboWyRsWJhc2VQcm9wZXJ0eURlZXAwwhXAkhYXwMDAwJCocHJvcGVydHmboWyUpWlzS2V5rGJhc2VQcm9wZXJ0eaV0b0tlebBiYXNlUHJvcGVydHlEZWVwwhjAkhkawMDAwJCoX2RlZmF1bHSboWyRqHByb3BlcnR5whzAkh0ewMDAwJDcACCWAAABwMLDlgAYAgXCwpYJAAPAwsKWCwzAwMLClgkMwBDCwpYBFwYJwsKWCQAHwMLClgsHwMDCwpYxB8DAwsKWARcKDcLClgkAC8DCwpYLBcDAwsKWEgXABMLClgEXDhHCwpYJAA/AwsKWCwXAwMLClgEFwBfCwpbM2hYSFMLClgkRwAjCwpYEEcDAwsKWAgEVGMLClgYBFsDCwpYAEMATwsKWChDAwMLCls0B9AkZG8LClgkIwAzCwpYECMDAwsKWAgEcH8LClgYBHcDCwpYACMAawsKWCQjAwMLClgEOHsDCwg==
====catalogjs annotation end====*/