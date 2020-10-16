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

var escapeHtmlChar = basePropertyOf(htmlEscapes);




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


export { escape as default };
/*====catalogjs annotation start====
lZKVwq0uL2Rpc3QvMTQ3LmpzAcLAlcKtLi90b1N0cmluZy5qcwXCwIGnZGVmYXVsdJShbKZlc2NhcGUgwJGTIMDAh65iYXNlUHJvcGVydHlPZpuhaZDCAsCSAwTAAMCnZGVmYXVsdJCodG9TdHJpbmeboWmQwgbAkgcIwAHAp2RlZmF1bHSQq2h0bWxFc2NhcGVzm6FskMIKDZILDMDAwMCQrmVzY2FwZUh0bWxDaGFym6Fskq5iYXNlUHJvcGVydHlPZqtodG1sRXNjYXBlc8IPEpIQEZLZXWh0dHBzOi8vY2F0YWxvZ2pzLmNvbS9wa2dzL25wbS9sb2Rhc2gvNC4xNy4xOS9MS25SU0MxQnF3dDVHa3hHUzhkUURYLW9GUGs9L19lc2NhcGVIdG1sQ2hhci5qc6dkZWZhdWx0wMDAkq5iYXNlUHJvcGVydHlPZqtodG1sRXNjYXBlc69yZVVuZXNjYXBlZEh0bWyboWyQwhQYkxUWF8DAwMCQsnJlSGFzVW5lc2NhcGVkSHRtbJuhbJKmUmVnRXhwr3JlVW5lc2NhcGVkSHRtbMIZHJIaG8DAwMCRr3JlVW5lc2NhcGVkSHRtbKZlc2NhcGWboWyUqHRvU3RyaW5nsnJlSGFzVW5lc2NhcGVkSHRtbK9yZVVuZXNjYXBlZEh0bWyuZXNjYXBlSHRtbENoYXLCHcCSHh/AwMDAkNwAIZYAAAHAwsOWABgCBcLClgkAA8DCwpYLDsDAwsKWAA7ADMLClgEYBgnCwpYJAAfAwsKWCwjAwMLClhYIwBvCwpY0AQoOwsKWBAALwMLClgALwA3CwpYBC8DAwsKWA1HAwMLClszDAQ8TwsKWBAAQwMLClgAOwBLCwpYCDsDAwsKWAwEEwMLClj4BFB3CwpYEABUZwsKWAA/AGMLClgcPwMDCwpYfD8ARwsKWAwrAwMLClgYAGsDCwpYAEsAcwsKWHRLAF8LClgMIFsDCwpbNA+wNHiDCwpYJBsAIwsKWCQbAwMLClgMOH8DCwg==
====catalogjs annotation end====*/