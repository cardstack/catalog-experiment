import { default as escape } from "./escape.js";
import { default as reInterpolate } from "./dist/173.js";

/** Used to match template delimiters. */
var reEscape = /<%-([\s\S]+?)%>/g;


/** Used to match template delimiters. */
var reEvaluate = /<%([\s\S]+?)%>/g;






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

export { templateSettings as default };
/*====catalogjs annotation start====
lZKVwqsuL2VzY2FwZS5qcwHCwJXCrS4vZGlzdC8xNzMuanMFwsCBp2RlZmF1bHSUoWywdGVtcGxhdGVTZXR0aW5ncxjAkZMYwMCFpmVzY2FwZZuhaZDCAsCSAwTAAMCnZGVmYXVsdJCtcmVJbnRlcnBvbGF0ZZuhaZDCBsCSBwjAAcCnZGVmYXVsdJCocmVFc2NhcGWboWyQwgoNkgsMktlXaHR0cHM6Ly9jYXRhbG9nanMuY29tL3BrZ3MvbnBtL2xvZGFzaC80LjE3LjE5L0xLblJTQzFCcXd0NUdreEdTOGRRRFgtb0ZQaz0vX3JlRXNjYXBlLmpzp2RlZmF1bHTAwMCQqnJlRXZhbHVhdGWboWyQwg8SkhARktlZaHR0cHM6Ly9jYXRhbG9nanMuY29tL3BrZ3MvbnBtL2xvZGFzaC80LjE3LjE5L0xLblJTQzFCcXd0NUdreEdTOGRRRFgtb0ZQaz0vX3JlRXZhbHVhdGUuanOnZGVmYXVsdMDAwJCwdGVtcGxhdGVTZXR0aW5nc5uhbJSocmVFc2NhcGWqcmVFdmFsdWF0Za1yZUludGVycG9sYXRlpmVzY2FwZcIUF5IVFsDAwMCUpmVzY2FwZa1yZUludGVycG9sYXRlqHJlRXNjYXBlqnJlRXZhbHVhdGXcABmWAAABwMLDlgAWAgXCwpYJAAPAwsKWCwbAwMLCls0BzQbAwMLClgEYBgnCwpYJAAfAwsKWCw3AwMLClsyRDcAEwsKWLAEKDsLClgQAC8DCwpYACMANwsKWzJQIwBHCwpYDEsDAwsKWLQEPE8LClgQAEMDCwpYACsASwsKWzIIKwAjCwpYDEcDAwsKWzQELARQYwsKWBAAVwMLClgAQwBfCwpYJEMDAwsKWAwwMwMLClgIOFsDCwg==
====catalogjs annotation end====*/