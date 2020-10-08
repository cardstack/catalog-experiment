import { default as basePropertyOf } from "./dist/147.js";
import { default as toString } from "./toString.js";


/** Used to map characters to HTML entities. */

var htmlEscapes = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};
/**
 * Used by `_.escape` to convert characters to HTML entities.
 *
 * @private
 * @param {string} chr The matched character to escape.
 * @returns {string} Returns the escaped character.
 */

var escapeHtmlChar0 = basePropertyOf(htmlEscapes);
const escapeHtmlChar = (escapeHtmlChar0);



/** Used to match HTML entities and HTML characters. */

var reUnescapedHtml = /[&<>"']/g,
    reHasUnescapedHtml = RegExp(reUnescapedHtml.source);
/**
 * Converts the characters "&", "<", ">", '"', and "'" in `string` to their
 * corresponding HTML entities.
 *
 * **Note:** No other characters are escaped. To escape additional
 * characters use a third-party library like [_he_](https://mths.be/he).
 *
 * Though the ">" character is escaped for symmetry, characters like
 * ">" and "/" don't need escaping in HTML and have no special meaning
 * unless they're part of a tag or unquoted attribute value. See
 * [Mathias Bynens's article](https://mathiasbynens.be/notes/ambiguous-ampersands)
 * (under "semi-related fun fact") for more details.
 *
 * When working with HTML you should always
 * [quote attribute values](http://wonko.com/post/html-escaping) to reduce
 * XSS vectors.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category String
 * @param {string} [string=''] The string to escape.
 * @returns {string} Returns the escaped string.
 * @example
 *
 * _.escape('fred, barney, & pebbles');
 * // => 'fred, barney, &amp; pebbles'
 */

function escape(string) {
  string = toString(string);
  return string && reHasUnescapedHtml.test(string) ? string.replace(reUnescapedHtml, escapeHtmlChar) : string;
}

const _default = (escape);
export { _default as default };
/*====catalogjs annotation start====
lZKTwq0uL2Rpc3QvMTQ3LmpzAZPCrS4vdG9TdHJpbmcuanMFgadkZWZhdWx0lKFsqF9kZWZhdWx0KMCRkyjAwomuYmFzZVByb3BlcnR5T2aboWmQwgLAkgMEwADAp2RlZmF1bHSQqHRvU3RyaW5nm6FpkMIGwJIHCMABwKdkZWZhdWx0kKtodG1sRXNjYXBlc5uhbJDCCg2SCwzAwMDAkK9lc2NhcGVIdG1sQ2hhcjCboWySrmJhc2VQcm9wZXJ0eU9mq2h0bWxFc2NhcGVzwg8SkhARwMDAwJKuYmFzZVByb3BlcnR5T2araHRtbEVzY2FwZXOuZXNjYXBlSHRtbENoYXKboWyRr2VzY2FwZUh0bWxDaGFyMMIUwJIVFpLZXWh0dHBzOi8vY2F0YWxvZ2pzLmNvbS9wa2dzL25wbS9sb2Rhc2gvNC4xNy4xOS9MS25SU0MxQnF3dDVHa3hHUzhkUURYLW9GUGs9L19lc2NhcGVIdG1sQ2hhci5qc6dkZWZhdWx0wMDAkK9yZVVuZXNjYXBlZEh0bWyboWyQwhgckxkaG8DAwMCQsnJlSGFzVW5lc2NhcGVkSHRtbJuhbJKmUmVnRXhwr3JlVW5lc2NhcGVkSHRtbMIdIJIeH8DAwMCRr3JlVW5lc2NhcGVkSHRtbKZlc2NhcGWboWyUqHRvU3RyaW5nsnJlSGFzVW5lc2NhcGVkSHRtbK9yZVVuZXNjYXBlZEh0bWyuZXNjYXBlSHRtbENoYXLCIcCSIiPAwMDAkKhfZGVmYXVsdJuhbJGmZXNjYXBlwiXAkiYnwMDAwJDcACmWAAABwMLDlgAYAgXCwpYJAAPAwsKWCw7AwMLClgAOwAzCwpYBGAYJwsKWCQAHwMLClgsIwMDCwpYWCMAfwsKWNAEKDsLClgQAC8DCwpYAC8ANwsKWAQvAwMLClgNRwMDCwpbMwwEPE8LClgQAEMDCwpYAD8ASwsKWBA/AwMLClgMBBMDCwpYBARQXwsKWBgEVwMLClgAOwBHCwpYCDsDAwsKWPQEYIcLClgQAGR3CwpYAD8AcwsKWBw/AwMLClh8PwBbCwpYDCsDAwsKWBgAewMLClgASwCDCwpYdEsAbwsKWAwgawMLCls0D7A0iJMLClgkGwAjCwpYEBsDAwsKWAgElKMLClgYBJsDCwpYACMAjwsKWCQjAwMLClgEOJ8DCwg==
====catalogjs annotation end====*/