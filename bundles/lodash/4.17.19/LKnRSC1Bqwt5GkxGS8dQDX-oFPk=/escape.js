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
lZKTwq0uL2Rpc3QvMTQ3LmpzAZPCrS4vdG9TdHJpbmcuanMFgadkZWZhdWx0lKFsqF9kZWZhdWx0KMCRkyjAwomuYmFzZVByb3BlcnR5T2aboWmQwgLAkgMEwADAp2RlZmF1bHSQqHRvU3RyaW5nm6FpkMIGwJIHCMABwKdkZWZhdWx0kKtodG1sRXNjYXBlc5uhbJDCCg2SCwzAwMDAkK9lc2NhcGVIdG1sQ2hhcjCboWySrmJhc2VQcm9wZXJ0eU9mq2h0bWxFc2NhcGVzwg8SkhARwMDAwJKuYmFzZVByb3BlcnR5T2araHRtbEVzY2FwZXOuZXNjYXBlSHRtbENoYXKboWyRr2VzY2FwZUh0bWxDaGFyMMIUwJIVFsDAwMCQr3JlVW5lc2NhcGVkSHRtbJuhbJDCGByTGRobwMDAwJCycmVIYXNVbmVzY2FwZWRIdG1sm6FskqZSZWdFeHCvcmVVbmVzY2FwZWRIdG1swh0gkh4fwMDAwJGvcmVVbmVzY2FwZWRIdG1spmVzY2FwZZuhbJSodG9TdHJpbmeycmVIYXNVbmVzY2FwZWRIdG1sr3JlVW5lc2NhcGVkSHRtbK5lc2NhcGVIdG1sQ2hhcsIhwJIiI8DAwMCQqF9kZWZhdWx0m6FskaZlc2NhcGXCJcCSJifAwMDAkNwAKZYAAAHAwsOWABgCBcLClgkAA8DCwpYLDsDAwsKWAA7ADMLClgEYBgnCwpYJAAfAwsKWCwjAwMLClhYIwB/CwpY0AQoOwsKWBAALwMLClgALwA3CwpYBC8DAwsKWA1HAwMLClszDAQ8TwsKWBAAQwMLClgAPwBLCwpYED8DAwsKWAwEEwMLClgEBFBfCwpYGARXAwsKWAA7AEcLClgIOwMDCwpY9ARghwsKWBAAZHcLClgAPwBzCwpYHD8DAwsKWHw/AFsLClgMKwMDCwpYGAB7AwsKWABLAIMLClh0SwBvCwpYDCBrAwsKWzQPsDSIkwsKWCQbACMLClgQGwMDCwpYCASUowsKWBgEmwMLClgAIwCPCwpYJCMDAwsKWAQ4nwMLC
====catalogjs annotation end====*/