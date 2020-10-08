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
lZKTwqsuL2VzY2FwZS5qcwGTwq0uL2Rpc3QvMTczLmpzBYGnZGVmYXVsdJShbKhfZGVmYXVsdCTAkZMkwMKIpmVzY2FwZZuhaZDCAsCSAwTAAMCnZGVmYXVsdJCtcmVJbnRlcnBvbGF0ZZuhaZDCBsCSBwjAAcCnZGVmYXVsdJCpcmVFc2NhcGUwm6FskMIKDZILDMDAwMCQqHJlRXNjYXBlm6FskalyZUVzY2FwZTDCD8CSEBGS2VdodHRwczovL2NhdGFsb2dqcy5jb20vcGtncy9ucG0vbG9kYXNoLzQuMTcuMTkvTEtuUlNDMUJxd3Q1R2t4R1M4ZFFEWC1vRlBrPS9fcmVFc2NhcGUuanOnZGVmYXVsdMDAwJCrcmVFdmFsdWF0ZTCboWyQwhMWkhQVwMDAwJCqcmVFdmFsdWF0ZZuhbJGrcmVFdmFsdWF0ZTDCGMCSGRqS2VlodHRwczovL2NhdGFsb2dqcy5jb20vcGtncy9ucG0vbG9kYXNoLzQuMTcuMTkvTEtuUlNDMUJxd3Q1R2t4R1M4ZFFEWC1vRlBrPS9fcmVFdmFsdWF0ZS5qc6dkZWZhdWx0wMDAkLB0ZW1wbGF0ZVNldHRpbmdzm6FslKhyZUVzY2FwZapyZUV2YWx1YXRlrXJlSW50ZXJwb2xhdGWmZXNjYXBlwhwfkh0ewMDAwJSmZXNjYXBlrXJlSW50ZXJwb2xhdGWocmVFc2NhcGWqcmVFdmFsdWF0ZahfZGVmYXVsdJuhbJGwdGVtcGxhdGVTZXR0aW5nc8IhwJIiI8DAwMCQ3AAllgAAAcDCw5YAFgIFwsKWCQADwMLClgsGwMDCwpbNAc0GwMDCwpYBGAYJwsKWCQAHwMLClgsNwMDCwpbMkQ3ABMLCliwBCg7CwpYEAAvAwsKWAAnADcLClgQJwMDCwpYDEsDAwsKWAQEPEsLClgYBEMDCwpYACMAMwsKWzJQIwBrCwpYsARMXwsKWBAAUwMLClgALwBbCwpYEC8DAwsKWAxHAwMLClgEBGBvCwpYGARnAwsKWAArAFcLClsyCCsAIwsKWzQEKARwgwsKWBAAdwMLClgAQwB/CwpYEEMDAwsKWAwwRwMLClgEBISTCwpYGASLAwsKWAAjAHsLClgkIwMDCwpYBDiPAwsI=
====catalogjs annotation end====*/