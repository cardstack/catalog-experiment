import { default as toString } from "./toString.js";
import { default as basePropertyOf } from "./dist/147.js";


/** Used to map HTML entities to characters. */

var htmlUnescapes = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'"
};
/**
 * Used by `_.unescape` to convert HTML entities to characters.
 *
 * @private
 * @param {string} chr The matched character to unescape.
 * @returns {string} Returns the unescaped character.
 */

var unescapeHtmlChar = basePropertyOf(htmlUnescapes);




/** Used to match HTML entities and HTML characters. */

var reEscapedHtml = /&(?:amp|lt|gt|quot|#39);/g,
    reHasEscapedHtml = RegExp(reEscapedHtml.source);
/**
 * The inverse of `_.escape`; this method converts the HTML entities
 * `&amp;`, `&lt;`, `&gt;`, `&quot;`, and `&#39;` in `string` to
 * their corresponding characters.
 *
 * **Note:** No other HTML entities are unescaped. To unescape additional
 * HTML entities use a third-party library like [_he_](https://mths.be/he).
 *
 * @static
 * @memberOf _
 * @since 0.6.0
 * @category String
 * @param {string} [string=''] The string to unescape.
 * @returns {string} Returns the unescaped string.
 * @example
 *
 * _.unescape('fred, barney, &amp; pebbles');
 * // => 'fred, barney, & pebbles'
 */

function unescape(string) {
  string = toString(string);
  return string && reHasEscapedHtml.test(string) ? string.replace(reEscapedHtml, unescapeHtmlChar) : string;
}


export { unescape as default };
/*====catalogjs annotation start====
lZKVwq0uL3RvU3RyaW5nLmpzAcLAlcKtLi9kaXN0LzE0Ny5qcwXCwIGnZGVmYXVsdJShbKh1bmVzY2FwZSDAkZMgwMCHqHRvU3RyaW5nm6FpkMICwJIDBMAAwKdkZWZhdWx0kK5iYXNlUHJvcGVydHlPZpuhaZDCBsCSBwjAAcCnZGVmYXVsdJCtaHRtbFVuZXNjYXBlc5uhbJDCCg2SCwzAwMDAkLB1bmVzY2FwZUh0bWxDaGFym6Fskq5iYXNlUHJvcGVydHlPZq1odG1sVW5lc2NhcGVzwg8SkhARktlfaHR0cHM6Ly9jYXRhbG9nanMuY29tL3BrZ3MvbnBtL2xvZGFzaC80LjE3LjE5L0xLblJTQzFCcXd0NUdreEdTOGRRRFgtb0ZQaz0vX3VuZXNjYXBlSHRtbENoYXIuanOnZGVmYXVsdMDAwJKuYmFzZVByb3BlcnR5T2ataHRtbFVuZXNjYXBlc61yZUVzY2FwZWRIdG1sm6FskMIUGJMVFhfAwMDAkLByZUhhc0VzY2FwZWRIdG1sm6FskqZSZWdFeHCtcmVFc2NhcGVkSHRtbMIZHJIaG8DAwMCRrXJlRXNjYXBlZEh0bWyodW5lc2NhcGWboWyUqHRvU3RyaW5nsHJlSGFzRXNjYXBlZEh0bWytcmVFc2NhcGVkSHRtbLB1bmVzY2FwZUh0bWxDaGFywh3Akh4fwMDAwJDcACGWAAABwMLDlgAYAgXCwpYJAAPAwsKWCwjAwMLClhYIwBvCwpYBGAYJwsKWCQAHwMLClgsOwMDCwpYADsAMwsKWNAEKDsLClgQAC8DCwpYADcANwsKWAQ3AwMLClgNRwMDCwpbMyQEPE8LClgQAEMDCwpYAEMASwsKWAhDAwMLClgMBCMDCwpY+ARQdwsKWBAAVGcLClgANwBjCwpYHDcDAwsKWHw3AEcLClgMbwMDCwpYGABrAwsKWABDAHMLClh0QwBfCwpYDCBbAwsKWzQJXDR4gwsKWCQjABMLClgkIwMDCwpYDDh/AwsI=
====catalogjs annotation end====*/