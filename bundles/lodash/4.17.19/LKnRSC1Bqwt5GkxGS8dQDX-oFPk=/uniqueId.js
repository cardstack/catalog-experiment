import { default as toString } from "./toString.js";


/** Used to generate unique IDs. */

var idCounter = 0;
/**
 * Generates a unique ID. If `prefix` is given, the ID is appended to it.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {string} [prefix=''] The value to prefix the ID with.
 * @returns {string} Returns the unique ID.
 * @example
 *
 * _.uniqueId('contact_');
 * // => 'contact_104'
 *
 * _.uniqueId();
 * // => '105'
 */

function uniqueId(prefix) {
  var id = ++idCounter;
  return toString(prefix) + id;
}

const _default = (uniqueId);
export { _default as default };
/*====catalogjs annotation start====
lZGTwq0uL3RvU3RyaW5nLmpzAYGnZGVmYXVsdJShbKhfZGVmYXVsdBDAkZMQwMKEqHRvU3RyaW5nm6FpkMICwJIDBMAAwKdkZWZhdWx0kKlpZENvdW50ZXKboWyQwgbAkgcIwMDAwJCodW5pcXVlSWSboWySqWlkQ291bnRlcqh0b1N0cmluZ8IJwJIKC8DAwMCQqF9kZWZhdWx0m6Fskah1bmlxdWVJZMINwJIOD8DAwMCQ3AARlgAAAcDCw5YAGAIFwsKWCQADwMLClgsIwMDCwpYLCMDAwsKWKAEGCcLClgQEB8DCwpYACcDAwsKWGAnABMLCls0BYxAKDMLClgkIwAjCwpYECMDAwsKWAgENEMLClgYBDsDCwpYACMALwsKWCQjAwMLClgEOD8DCwg==
====catalogjs annotation end====*/