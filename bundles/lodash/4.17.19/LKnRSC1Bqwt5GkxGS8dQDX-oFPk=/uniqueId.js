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


export { uniqueId as default };
/*====catalogjs annotation start====
lZGVwq0uL3RvU3RyaW5nLmpzAcLAgadkZWZhdWx0lKFsqHVuaXF1ZUlkDMCRkwzAwIOodG9TdHJpbmeboWmQwgLAkgMEwADAp2RlZmF1bHSQqWlkQ291bnRlcpuhbJDCBsCSBwjAwMDAkKh1bmlxdWVJZJuhbJKpaWRDb3VudGVyqHRvU3RyaW5nwgnAkgoLwMDAwJCdlgAAAcDCw5YAGAIFwsKWCQADwMLClgsIwMDCwpYLCMDAwsKWKAEGCcLClgQEB8DCwpYACcDAwsKWGAnABMLCls0BYxAKDMLClgkIwAjCwpYJCMDAwsKWAw4LwMLC
====catalogjs annotation end====*/