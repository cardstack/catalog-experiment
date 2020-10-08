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

var unescapeHtmlChar0 = basePropertyOf(htmlUnescapes);
const unescapeHtmlChar = (unescapeHtmlChar0);



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

const _default = (unescape);
export { _default as default };
/*====catalogjs annotation start====
lZKTwq0uL3RvU3RyaW5nLmpzAZPCrS4vZGlzdC8xNDcuanMFgadkZWZhdWx0lKFsqF9kZWZhdWx0KMCRkyjAwomodG9TdHJpbmeboWmQwgLAkgMEwADAp2RlZmF1bHSQrmJhc2VQcm9wZXJ0eU9mm6FpkMIGwJIHCMABwKdkZWZhdWx0kK1odG1sVW5lc2NhcGVzm6FskMIKDZILDMDAwMCQsXVuZXNjYXBlSHRtbENoYXIwm6Fskq5iYXNlUHJvcGVydHlPZq1odG1sVW5lc2NhcGVzwg8SkhARwMDAwJKuYmFzZVByb3BlcnR5T2ataHRtbFVuZXNjYXBlc7B1bmVzY2FwZUh0bWxDaGFym6FskbF1bmVzY2FwZUh0bWxDaGFyMMIUwJIVFpLZX2h0dHBzOi8vY2F0YWxvZ2pzLmNvbS9wa2dzL25wbS9sb2Rhc2gvNC4xNy4xOS9MS25SU0MxQnF3dDVHa3hHUzhkUURYLW9GUGs9L191bmVzY2FwZUh0bWxDaGFyLmpzp2RlZmF1bHTAwMCQrXJlRXNjYXBlZEh0bWyboWyQwhgckxkaG8DAwMCQsHJlSGFzRXNjYXBlZEh0bWyboWySplJlZ0V4cK1yZUVzY2FwZWRIdG1swh0gkh4fwMDAwJGtcmVFc2NhcGVkSHRtbKh1bmVzY2FwZZuhbJSodG9TdHJpbmewcmVIYXNFc2NhcGVkSHRtbK1yZUVzY2FwZWRIdG1ssHVuZXNjYXBlSHRtbENoYXLCIcCSIiPAwMDAkKhfZGVmYXVsdJuhbJGodW5lc2NhcGXCJcCSJifAwMDAkNwAKZYAAAHAwsOWABgCBcLClgkAA8DCwpYLCMDAwsKWFgjAH8LClgEYBgnCwpYJAAfAwsKWCw7AwMLClgAOwAzCwpY0AQoOwsKWBAALwMLClgANwA3CwpYBDcDAwsKWA1HAwMLClszJAQ8TwsKWBAAQwMLClgARwBLCwpYEEcDAwsKWAwEIwMLClgEBFBfCwpYGARXAwsKWABDAEcLClgIQwMDCwpY9ARghwsKWBAAZHcLClgANwBzCwpYHDcDAwsKWHw3AFsLClgMbwMDCwpYGAB7AwsKWABDAIMLClh0QwBvCwpYDCBrAwsKWzQJXDSIkwsKWCQjABMLClgQIwMDCwpYCASUowsKWBgEmwMLClgAIwCPCwpYJCMDAwsKWAQ4nwMLC
====catalogjs annotation end====*/