import { default as toString } from "./toString.js";


/**
 * Replaces matches for `pattern` in `string` with `replacement`.
 *
 * **Note:** This method is based on
 * [`String#replace`](https://mdn.io/String/replace).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category String
 * @param {string} [string=''] The string to modify.
 * @param {RegExp|string} pattern The pattern to replace.
 * @param {Function|string} replacement The match replacement.
 * @returns {string} Returns the modified string.
 * @example
 *
 * _.replace('Hi Fred', 'Fred', 'Barney');
 * // => 'Hi Barney'
 */

function replace() {
  var args = arguments,
      string = toString(args[0]);
  return args.length < 3 ? string : string.replace(args[1], args[2]);
}


export { replace as default };
/*====catalogjs annotation start====
lZGVwq0uL3RvU3RyaW5nLmpzAcLAgadkZWZhdWx0lKFsp3JlcGxhY2UIwJGTCMDAgqh0b1N0cmluZ5uhaZDCAsCSAwTAAMCnZGVmYXVsdJCncmVwbGFjZZuhbJGodG9TdHJpbmfCBcCSBgfAwMDAkJmWAAABwMLDlgAYAgXCwpYJAAPAwsKWCwjAwMLCliwIwMDCwpbNAhxSBgjCwpYJB8AEwsKWCQfAwMLClgMOB8DCwg==
====catalogjs annotation end====*/