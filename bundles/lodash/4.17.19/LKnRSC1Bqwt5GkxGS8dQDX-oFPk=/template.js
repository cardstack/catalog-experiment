import { default as assignInWith } from "./assignInWith.js";
import { default as attempt } from "./attempt.js";
import { default as baseValues } from "./dist/96.js";
import { default as eq } from "./eq.js";
import { default as isError } from "./isError.js";
import { default as isIterateeCall } from "./dist/70.js";
import { default as keys } from "./keys.js";
import { default as reInterpolate } from "./dist/173.js";
import { default as templateSettings } from "./templateSettings.js";
import { default as toString } from "./toString.js";


/** Used for built-in method references. */

var objectProto0 = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty0 = objectProto0.hasOwnProperty;
/**
 * Used by `_.defaults` to customize its `_.assignIn` use to assign properties
 * of source objects to the destination object for all destination properties
 * that resolve to `undefined`.
 *
 * @private
 * @param {*} objValue The destination value.
 * @param {*} srcValue The source value.
 * @param {string} key The key of the property to assign.
 * @param {Object} object The parent object of `objValue`.
 * @returns {*} Returns the value to assign.
 */

function customDefaultsAssignIn(objValue, srcValue, key, object) {
  if (objValue === undefined || eq(objValue, objectProto0[key]) && !hasOwnProperty0.call(object, key)) {
    return srcValue;
  }

  return objValue;
}



/** Used to escape characters for inclusion in compiled string literals. */
var stringEscapes = {
  '\\': '\\',
  "'": "'",
  '\n': 'n',
  '\r': 'r',
  '\u2028': 'u2028',
  '\u2029': 'u2029'
};
/**
 * Used by `_.template` to escape characters for inclusion in compiled string literals.
 *
 * @private
 * @param {string} chr The matched character to escape.
 * @returns {string} Returns the escaped character.
 */

function escapeStringChar(chr) {
  return '\\' + stringEscapes[chr];
}














/** Used to match empty string literals in compiled template source. */

var reEmptyStringLeading = /\b__p \+= '';/g,
    reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
    reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;
/**
 * Used to match
 * [ES template delimiters](http://ecma-international.org/ecma-262/7.0/#sec-template-literal-lexical-components).
 */

var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;
/** Used to ensure capturing order of template delimiters. */

var reNoMatch = /($^)/;
/** Used to match unescaped characters in compiled string literals. */

var reUnescapedString = /['\n\r\u2028\u2029\\]/g;
/** Used for built-in method references. */

var objectProto = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty = objectProto.hasOwnProperty;
/**
 * Creates a compiled template function that can interpolate data properties
 * in "interpolate" delimiters, HTML-escape interpolated data properties in
 * "escape" delimiters, and execute JavaScript in "evaluate" delimiters. Data
 * properties may be accessed as free variables in the template. If a setting
 * object is given, it takes precedence over `_.templateSettings` values.
 *
 * **Note:** In the development build `_.template` utilizes
 * [sourceURLs](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl)
 * for easier debugging.
 *
 * For more information on precompiling templates see
 * [lodash's custom builds documentation](https://lodash.com/custom-builds).
 *
 * For more information on Chrome extension sandboxes see
 * [Chrome's extensions documentation](https://developer.chrome.com/extensions/sandboxingEval).
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category String
 * @param {string} [string=''] The template string.
 * @param {Object} [options={}] The options object.
 * @param {RegExp} [options.escape=_.templateSettings.escape]
 *  The HTML "escape" delimiter.
 * @param {RegExp} [options.evaluate=_.templateSettings.evaluate]
 *  The "evaluate" delimiter.
 * @param {Object} [options.imports=_.templateSettings.imports]
 *  An object to import into the template as free variables.
 * @param {RegExp} [options.interpolate=_.templateSettings.interpolate]
 *  The "interpolate" delimiter.
 * @param {string} [options.sourceURL='templateSources[n]']
 *  The sourceURL of the compiled template.
 * @param {string} [options.variable='obj']
 *  The data object variable name.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Function} Returns the compiled template function.
 * @example
 *
 * // Use the "interpolate" delimiter to create a compiled template.
 * var compiled = _.template('hello <%= user %>!');
 * compiled({ 'user': 'fred' });
 * // => 'hello fred!'
 *
 * // Use the HTML "escape" delimiter to escape data property values.
 * var compiled = _.template('<b><%- value %></b>');
 * compiled({ 'value': '<script>' });
 * // => '<b>&lt;script&gt;</b>'
 *
 * // Use the "evaluate" delimiter to execute JavaScript and generate HTML.
 * var compiled = _.template('<% _.forEach(users, function(user) { %><li><%- user %></li><% }); %>');
 * compiled({ 'users': ['fred', 'barney'] });
 * // => '<li>fred</li><li>barney</li>'
 *
 * // Use the internal `print` function in "evaluate" delimiters.
 * var compiled = _.template('<% print("hello " + user); %>!');
 * compiled({ 'user': 'barney' });
 * // => 'hello barney!'
 *
 * // Use the ES template literal delimiter as an "interpolate" delimiter.
 * // Disable support by replacing the "interpolate" delimiter.
 * var compiled = _.template('hello ${ user }!');
 * compiled({ 'user': 'pebbles' });
 * // => 'hello pebbles!'
 *
 * // Use backslashes to treat delimiters as plain text.
 * var compiled = _.template('<%= "\\<%- value %\\>" %>');
 * compiled({ 'value': 'ignored' });
 * // => '<%- value %>'
 *
 * // Use the `imports` option to import `jQuery` as `jq`.
 * var text = '<% jq.each(users, function(user) { %><li><%- user %></li><% }); %>';
 * var compiled = _.template(text, { 'imports': { 'jq': jQuery } });
 * compiled({ 'users': ['fred', 'barney'] });
 * // => '<li>fred</li><li>barney</li>'
 *
 * // Use the `sourceURL` option to specify a custom sourceURL for the template.
 * var compiled = _.template('hello <%= user %>!', { 'sourceURL': '/basic/greeting.jst' });
 * compiled(data);
 * // => Find the source of "greeting.jst" under the Sources tab or Resources panel of the web inspector.
 *
 * // Use the `variable` option to ensure a with-statement isn't used in the compiled template.
 * var compiled = _.template('hi <%= data.user %>!', { 'variable': 'data' });
 * compiled.source;
 * // => function(data) {
 * //   var __t, __p = '';
 * //   __p += 'hi ' + ((__t = ( data.user )) == null ? '' : __t) + '!';
 * //   return __p;
 * // }
 *
 * // Use custom template delimiters.
 * _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
 * var compiled = _.template('hello {{ user }}!');
 * compiled({ 'user': 'mustache' });
 * // => 'hello mustache!'
 *
 * // Use the `source` property to inline compiled templates for meaningful
 * // line numbers in error messages and stack traces.
 * fs.writeFileSync(path.join(process.cwd(), 'jst.js'), '\
 *   var JST = {\
 *     "main": ' + _.template(mainText).source + '\
 *   };\
 * ');
 */

function template(string, options, guard) {
  // Based on John Resig's `tmpl` implementation
  // (http://ejohn.org/blog/javascript-micro-templating/)
  // and Laura Doktorova's doT.js (https://github.com/olado/doT).
  var settings = templateSettings.imports._.templateSettings || templateSettings;

  if (guard && isIterateeCall(string, options, guard)) {
    options = undefined;
  }

  string = toString(string);
  options = assignInWith({}, options, settings, customDefaultsAssignIn);
  var imports = assignInWith({}, options.imports, settings.imports, customDefaultsAssignIn),
      importsKeys = keys(imports),
      importsValues = baseValues(imports, importsKeys);
  var isEscaping,
      isEvaluating,
      index = 0,
      interpolate = options.interpolate || reNoMatch,
      source = "__p += '"; // Compile the regexp to match each delimiter.

  var reDelimiters = RegExp((options.escape || reNoMatch).source + '|' + interpolate.source + '|' + (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + '|' + (options.evaluate || reNoMatch).source + '|$', 'g'); // Use a sourceURL for easier debugging.
  // The sourceURL gets injected into the source that's eval-ed, so be careful
  // with lookup (in case of e.g. prototype pollution), and strip newlines if any.
  // A newline wouldn't be a valid sourceURL anyway, and it'd enable code injection.

  var sourceURL = hasOwnProperty.call(options, 'sourceURL') ? '//# sourceURL=' + (options.sourceURL + '').replace(/[\r\n]/g, ' ') + '\n' : '';
  string.replace(reDelimiters, function (match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
    interpolateValue || (interpolateValue = esTemplateValue); // Escape characters that can't be included in string literals.

    source += string.slice(index, offset).replace(reUnescapedString, escapeStringChar); // Replace delimiters with snippets.

    if (escapeValue) {
      isEscaping = true;
      source += "' +\n__e(" + escapeValue + ") +\n'";
    }

    if (evaluateValue) {
      isEvaluating = true;
      source += "';\n" + evaluateValue + ";\n__p += '";
    }

    if (interpolateValue) {
      source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
    }

    index = offset + match.length; // The JS engine embedded in Adobe products needs `match` returned in
    // order to produce the correct `offset` value.

    return match;
  });
  source += "';\n"; // If `variable` is not specified wrap a with-statement around the generated
  // code to add the data object to the top of the scope chain.
  // Like with sourceURL, we take care to not check the option's prototype,
  // as this configuration is a code injection vector.

  var variable = hasOwnProperty.call(options, 'variable') && options.variable;

  if (!variable) {
    source = 'with (obj) {\n' + source + '\n}\n';
  } // Cleanup code by stripping empty strings.


  source = (isEvaluating ? source.replace(reEmptyStringLeading, '') : source).replace(reEmptyStringMiddle, '$1').replace(reEmptyStringTrailing, '$1;'); // Frame code as the function body.

  source = 'function(' + (variable || 'obj') + ') {\n' + (variable ? '' : 'obj || (obj = {});\n') + "var __t, __p = ''" + (isEscaping ? ', __e = _.escape' : '') + (isEvaluating ? ', __j = Array.prototype.join;\n' + "function print() { __p += __j.call(arguments, '') }\n" : ';\n') + source + 'return __p\n}';
  var result = attempt(function () {
    return Function(importsKeys, sourceURL + 'return ' + source).apply(undefined, importsValues);
  }); // Provide the compiled function's source by its `toString` method or
  // the `source` property as a convenience for inlining compiled templates.

  result.source = source;

  if (isError(result)) {
    throw result;
  }

  return result;
}


export { template as default };
/*====catalogjs annotation start====
lZqVwrEuL2Fzc2lnbkluV2l0aC5qcwHCwJXCrC4vYXR0ZW1wdC5qcwbCwJXCrC4vZGlzdC85Ni5qcwrCwJXCpy4vZXEuanMOwsCVwqwuL2lzRXJyb3IuanMSwsCVwqwuL2Rpc3QvNzAuanMWwsCVwqkuL2tleXMuanMawsCVwq0uL2Rpc3QvMTczLmpzHsLAlcK1Li90ZW1wbGF0ZVNldHRpbmdzLmpzIsLAlcKtLi90b1N0cmluZy5qcyfCwIGnZGVmYXVsdJShbKh0ZW1wbGF0ZW/AkZNvwMDeABisYXNzaWduSW5XaXRom6FpkMICwJMDBAXAAMCnZGVmYXVsdJCnYXR0ZW1wdJuhaZDCB8CSCAnAAcCnZGVmYXVsdJCqYmFzZVZhbHVlc5uhaZDCC8CSDA3AAsCnZGVmYXVsdJCiZXGboWmQwg/AkhARwAPAp2RlZmF1bHSQp2lzRXJyb3KboWmQwhPAkhQVwATAp2RlZmF1bHSQrmlzSXRlcmF0ZWVDYWxsm6FpkMIXwJIYGcAFwKdkZWZhdWx0kKRrZXlzm6FpkMIbwJIcHcAGwKdkZWZhdWx0kK1yZUludGVycG9sYXRlm6FpkMIfwJIgIcAHwKdkZWZhdWx0kLB0ZW1wbGF0ZVNldHRpbmdzm6FpkMIjwJMkJSbACMCnZGVmYXVsdJCodG9TdHJpbmeboWmQwijAkikqwAnAp2RlZmF1bHSQrG9iamVjdFByb3RvMJuhbJGmT2JqZWN0wiwwky0uL8DAwMCQr2hhc093blByb3BlcnR5MJuhbJGsb2JqZWN0UHJvdG8wwjI1kjM0wMDAwJGsb2JqZWN0UHJvdG8wtmN1c3RvbURlZmF1bHRzQXNzaWduSW6boWyTomVxrG9iamVjdFByb3RvMK9oYXNPd25Qcm9wZXJ0eTDCNsCTNzg5ktllaHR0cHM6Ly9jYXRhbG9nanMuY29tL3BrZ3MvbnBtL2xvZGFzaC80LjE3LjE5L0xLblJTQzFCcXd0NUdreEdTOGRRRFgtb0ZQaz0vX2N1c3RvbURlZmF1bHRzQXNzaWduSW4uanOnZGVmYXVsdMDAwJCtc3RyaW5nRXNjYXBlc5uhbJDCOz6SPD3AwMDAkLBlc2NhcGVTdHJpbmdDaGFym6Fska1zdHJpbmdFc2NhcGVzwj/AkkBBktlfaHR0cHM6Ly9jYXRhbG9nanMuY29tL3BrZ3MvbnBtL2xvZGFzaC80LjE3LjE5L0xLblJTQzFCcXd0NUdreEdTOGRRRFgtb0ZQaz0vX2VzY2FwZVN0cmluZ0NoYXIuanOnZGVmYXVsdMDAwJC0cmVFbXB0eVN0cmluZ0xlYWRpbmeboWyQwkNGkkRFwMDAwJCzcmVFbXB0eVN0cmluZ01pZGRsZZuhbJDCR0qSSEnAwMDAkLVyZUVtcHR5U3RyaW5nVHJhaWxpbmeboWyQwktOkkxNwMDAwJCscmVFc1RlbXBsYXRlm6FskMJQU5JRUsDAwMCQqXJlTm9NYXRjaJuhbJDCVVuVVldYWVrAwMDAkLFyZVVuZXNjYXBlZFN0cmluZ5uhbJDCXWCSXl/AwMDAkKtvYmplY3RQcm90b5uhbJGmT2JqZWN0wmJlkmNkwMDAwJCuaGFzT3duUHJvcGVydHmboWyRq29iamVjdFByb3Rvwmdrk2hpasDAwMCRq29iamVjdFByb3RvqHRlbXBsYXRlm6Fs3AASsHRlbXBsYXRlU2V0dGluZ3OuaXNJdGVyYXRlZUNhbGyodG9TdHJpbmesYXNzaWduSW5XaXRotmN1c3RvbURlZmF1bHRzQXNzaWduSW6ka2V5c6piYXNlVmFsdWVzqXJlTm9NYXRjaK1yZUludGVycG9sYXRlrHJlRXNUZW1wbGF0Za5oYXNPd25Qcm9wZXJ0ebFyZVVuZXNjYXBlZFN0cmluZ7Blc2NhcGVTdHJpbmdDaGFytHJlRW1wdHlTdHJpbmdMZWFkaW5ns3JlRW1wdHlTdHJpbmdNaWRkbGW1cmVFbXB0eVN0cmluZ1RyYWlsaW5np2F0dGVtcHSnaXNFcnJvcsJswJJtbsDAwMCQ3ABwlgAAAcDCw5YAHAIGwsKWCQADwMLClgsMwMDCwpYWDMA4wsKWEwzAOcLClgEXBwrCwpYJAAjAwsKWCwfAwMLCls0BcgfAFcLClgEXCw7CwpYJAAzAwsKWCwrAwMLCliEKwFfCwpYBEg8SwsKWCQAQwMLClgsCwMDCwpZEAsAvwsKWARcTFsLClgkAFMDCwpYLB8DAwsKWzQEsB8DAwsKWARcXGsLClgkAGMDCwpYLDsDAwsKWEg7AKsLClgEUGx7CwpYJABzAwsKWCwTAwMLClhcEwA3CwpYBGB8iwsKWCQAgwMLClgsNwMDCwpY9DcBSwsKWASAjJ8LClgkAJMDCwpYLEMDAwsKWzNkQwCbCwpYfEMAZwsKWARgoK8LClgkAKcDCwpYLCMDAwsKWRQjABMLCljABLDHCwpYEAC3AwsKWAAzAMMLClgAMwMDCwpYLDMA0wsKWAxDAwMLCljMBMjbCwpYEADPAwsKWAA/ANcLClgsPwMDCwpYDDy7AwsKWzQHPRDc6wsKWCRbAEcLClhgWwAXCwpYoFsAdwsKWUAE7P8LClgQAPMDCwpYADcA+wsKWGA3AwMLClgNgwMDCwpbM3QhAQsLClgkQwD3CwpYCEMBqwsKWWAFDT8LClgQAREfCwpYAFMBGwsKWzNIUwEnCwpYDEMDAwsKWBgBIS8LClgATwErCwpYYE8BNwsKWAxTAwMLClgYATMDCwpYAFcBOwsKWEBXACcLClgMfwMDCwpbMjQFQVMLClgQAUcDCwpYADMBTwsKWAwzAWcLClgMhwMDCwpZAAVVcwsKWBABWwMLClgAJwFvCwpZ6CcBYwsKWfAnAIcLClgMJwFrCwpYmCcBpwsKWAwbAwMLClkkBXWHCwpYEAF7AwsKWABHAYMLCls0BmRHAQcLClgMYwMDCwpYuAWJmwsKWBABjwMLClgALwGXCwpYAC8DAwsKWAxDAwMLCljMBZ2zCwpYEAGjAwsKWAA7Aa8LCls0BSg7AX8LCls0DbQ7ARcLClgMPZMDCwpbNEaA1bW/CwpYJCMAlwsKWCQjAwMLClgMObsDCwg==
====catalogjs annotation end====*/