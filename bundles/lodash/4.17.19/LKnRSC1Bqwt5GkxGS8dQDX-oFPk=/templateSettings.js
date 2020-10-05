import { default as escape } from "./escape.js";
import { default as reInterpolate } from "./dist/173.js";

/** Used to match template delimiters. */
var reEscape0 = /<%-([\s\S]+?)%>/g;
const reEscape = (reEscape0);

/** Used to match template delimiters. */
var reEvaluate0 = /<%([\s\S]+?)%>/g;
const reEvaluate = (reEvaluate0);





/**
 * By default, the template delimiters used by lodash are like those in
 * embedded Ruby (ERB) as well as ES2015 template strings. Change the
 * following template settings to use alternative delimiters.
 *
 * @static
 * @memberOf _
 * @type {Object}
 */

var templateSettings = {
  /**
   * Used to detect `data` property values to be HTML-escaped.
   *
   * @memberOf _.templateSettings
   * @type {RegExp}
   */
  'escape': reEscape,

  /**
   * Used to detect code to be evaluated.
   *
   * @memberOf _.templateSettings
   * @type {RegExp}
   */
  'evaluate': reEvaluate,

  /**
   * Used to detect `data` property values to inject.
   *
   * @memberOf _.templateSettings
   * @type {RegExp}
   */
  'interpolate': reInterpolate,

  /**
   * Used to reference the data object in the template text.
   *
   * @memberOf _.templateSettings
   * @type {string}
   */
  'variable': '',

  /**
   * Used to import variables into the compiled template.
   *
   * @memberOf _.templateSettings
   * @type {Object}
   */
  'imports': {
    /**
     * A reference to the `lodash` function.
     *
     * @memberOf _.templateSettings.imports
     * @type {Function}
     */
    '_': {
      'escape': escape
    }
  }
};
const _default = (templateSettings);
export { _default as default };
/*====catalogjs annotation start====
lZKTwqsuL2VzY2FwZS5qcwGTwq0uL2Rpc3QvMTczLmpzBYGnZGVmYXVsdJShbKhfZGVmYXVsdCTAkZMkwMKIpmVzY2FwZZuhaZDCAsCSAwTAAMCnZGVmYXVsdJCtcmVJbnRlcnBvbGF0ZZuhaZDCBsCSBwjAAcCnZGVmYXVsdJCpcmVFc2NhcGUwm6FskMIKDZILDMDAwMCQqHJlRXNjYXBlm6FskalyZUVzY2FwZTDCD8CSEBHAwMDAkKtyZUV2YWx1YXRlMJuhbJDCExaSFBXAwMDAkKpyZUV2YWx1YXRlm6FskatyZUV2YWx1YXRlMMIYwJIZGsDAwMCQsHRlbXBsYXRlU2V0dGluZ3OboWyUqHJlRXNjYXBlqnJlRXZhbHVhdGWtcmVJbnRlcnBvbGF0ZaZlc2NhcGXCHB+SHR7AwMDAlKZlc2NhcGWtcmVJbnRlcnBvbGF0ZahyZUVzY2FwZapyZUV2YWx1YXRlqF9kZWZhdWx0m6FskbB0ZW1wbGF0ZVNldHRpbmdzwiHAkiIjwMDAwJDcACWWAAABwMLDlgAWAgXCwpYJAAPAwsKWCwbAwMLCls0BzQbAwMLClgEYBgnCwpYJAAfAwsKWCw3AwMLClsyRDcAEwsKWLAEKDsLClgQAC8DCwpYACcANwsKWBAnAwMLClgMSwMDCwpYBAQ8SwsKWBgEQwMLClgAIwAzCwpbMlAjAGsLCliwBExfCwpYEABTAwsKWAAvAFsLClgQLwMDCwpYDEcDAwsKWAQEYG8LClgYBGcDCwpYACsAVwsKWzIIKwAjCwpbNAQoBHCDCwpYEAB3AwsKWABDAH8LClgQQwMDCwpYDDBHAwsKWAQEhJMLClgYBIsDCwpYACMAewsKWCQjAwMLClgEOI8DCwg==
====catalogjs annotation end====*/