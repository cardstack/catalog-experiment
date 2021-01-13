import { default as eq } from "./eq.js";
import { default as assignInWith } from "./assignInWith.js";
import { default as attempt } from "./attempt.js";
import { default as baseValues } from "./dist/96.js";
import { default as isError } from "./isError.js";
import { default as isIterateeCall } from "./dist/70.js";
import { default as keys } from "./keys.js";
import { default as reInterpolate } from "./dist/173.js";
import { default as templateSettings } from "./templateSettings.js";
import { default as toString } from "./toString.js";
var objectProto0 = Object.prototype;
var hasOwnProperty0 = objectProto0.hasOwnProperty;
function customDefaultsAssignIn(objValue, srcValue, key, object) {
  if (objValue === undefined || eq(objValue, objectProto0[key]) && !hasOwnProperty0.call(object, key)) {
    return srcValue;
  }

  return objValue;
}
var stringEscapes = {
  '\\': '\\',
  "'": "'",
  '\n': 'n',
  '\r': 'r',
  '\u2028': 'u2028',
  '\u2029': 'u2029'
};
function escapeStringChar(chr) {
  return '\\' + stringEscapes[chr];
}
var reEmptyStringLeading = /\b__p \+= '';/g,
    reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
    reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;
var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;
var reNoMatch = /($^)/;
var reUnescapedString = /['\n\r\u2028\u2029\\]/g;
var objectProto = Object.prototype;
var hasOwnProperty = objectProto.hasOwnProperty;
function template(string, options, guard) {
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
      source = "__p += '";
  var reDelimiters = RegExp((options.escape || reNoMatch).source + '|' + interpolate.source + '|' + (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + '|' + (options.evaluate || reNoMatch).source + '|$', 'g');
  var sourceURL = hasOwnProperty.call(options, 'sourceURL') ? '//# sourceURL=' + (options.sourceURL + '').replace(/[\r\n]/g, ' ') + '\n' : '';
  string.replace(reDelimiters, function (match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
    interpolateValue || (interpolateValue = esTemplateValue);
    source += string.slice(index, offset).replace(reUnescapedString, escapeStringChar);

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

    index = offset + match.length;
    return match;
  });
  source += "';\n";
  var variable = hasOwnProperty.call(options, 'variable') && options.variable;

  if (!variable) {
    source = 'with (obj) {\n' + source + '\n}\n';
  }

  source = (isEvaluating ? source.replace(reEmptyStringLeading, '') : source).replace(reEmptyStringMiddle, '$1').replace(reEmptyStringTrailing, '$1;');
  source = 'function(' + (variable || 'obj') + ') {\n' + (variable ? '' : 'obj || (obj = {});\n') + "var __t, __p = ''" + (isEscaping ? ', __e = _.escape' : '') + (isEvaluating ? ', __j = Array.prototype.join;\n' + "function print() { __p += __j.call(arguments, '') }\n" : ';\n') + source + 'return __p\n}';
  var result = attempt(function () {
    return Function(importsKeys, sourceURL + 'return ' + source).apply(undefined, importsValues);
  });
  result.source = source;

  if (isError(result)) {
    throw result;
  }

  return result;
}
export { template as default };
/*====catalogjs annotation start====
k5qVwqcuL2VxLmpzA8LAlcKxLi9hc3NpZ25JbldpdGguanMGwsCVwqwuL2F0dGVtcHQuanMJwsCVwqwuL2Rpc3QvOTYuanMMwsCVwqwuL2lzRXJyb3IuanMPwsCVwqwuL2Rpc3QvNzAuanMSwsCVwqkuL2tleXMuanMVwsCVwq0uL2Rpc3QvMTczLmpzGMLAlcK1Li90ZW1wbGF0ZVNldHRpbmdzLmpzG8LAlcKtLi90b1N0cmluZy5qcx7CwIGnZGVmYXVsdJShbKh0ZW1wbGF0ZWfA3ABpl6FvAAADwJMnMEvAmaFkCQACwJECwMKYoWmiZXGSAinAAKdkZWZhdWx0wMCYoXILAsDAkQHAwpyhaQASAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmsYXNzaWduSW5XaXRokwVRU8ABp2RlZmF1bHTAwJihcgsMwMCRBMDCnKFpARwECZDAwgHCwMCZoWQJAAjAkQjAwpihaadhdHRlbXB0kghkwAKnZGVmYXVsdMDAmKFyCwfAwJEHwMKcoWkBFwcMkMDCAsLAwJmhZAkAC8CRC8DCmKFpqmJhc2VWYWx1ZXOSC1bAA6dkZWZhdWx0wMCYoXILCsDAkQrAwpyhaQEXCg+QwMIDwsDAmaFkCQAOwJEOwMKYoWmnaXNFcnJvcpIOZcAEp2RlZmF1bHTAwJihcgsHwMCRDcDCnKFpARcNEpDAwgTCwMCZoWQJABHAkRHAwpihaa5pc0l0ZXJhdGVlQ2FsbJIRT8AFp2RlZmF1bHTAwJihcgsOwMCREMDCnKFpARcQFZDAwgXCwMCZoWQJABTAkRTAwpihaaRrZXlzkhRVwAanZGVmYXVsdMDAmKFyCwTAwJETwMKcoWkBFBMYkMDCBsLAwJmhZAkAF8CRF8DCmKFprXJlSW50ZXJwb2xhdGWSF1nAB6dkZWZhdWx0wMCYoXILDcDAkRbAwpyhaQEYFhuQwMIHwsDAmaFkCQAawJEawMKYoWmwdGVtcGxhdGVTZXR0aW5nc5MaTU7ACKdkZWZhdWx0wMCYoXILEMDAkRnAwpyhaQEgGR6QwMIIwsDAmaFkCQAdwJEdwMKYoWmodG9TdHJpbmeSHVDACadkZWZhdWx0wMCYoXILCMDAkRzAwpyhaQEYHB+QwMIJwsDAl6FvAQAgLJDAmKFnAAEhI5DAwpmhZAQTIsCSIiDAwpihbKxvYmplY3RQcm90bzCTIiYqwMDAINlXV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19jdXN0b21EZWZhdWx0c0Fzc2lnbkluLmpzmKFyAAzAwJEhwMKYoWcBASQnkMDCmaFkBA8lwJQmJSMhwMKYoWyvaGFzT3duUHJvcGVydHkwkiUrwMDAI9lXV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19jdXN0b21EZWZhdWx0c0Fzc2lnbkluLmpzmKFyAA/AJpEkwMKYoXIDDMDAkSHAwpmhZAFEKMCWKSorKCEkwMKYoWy2Y3VzdG9tRGVmYXVsdHNBc3NpZ25JbpMoUlTAwMDA2VdXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2N1c3RvbURlZmF1bHRzQXNzaWduSW4uanOYoXIJFsApkSfAwpihckQCwCqRAcDCmKFyCwzAK5EhwMKYoXILD8DAkSTAwpehbwEALTOQwJihZwABLjCQwMKZoWQEYy/Aki8twMKYoWytc3RyaW5nRXNjYXBlc5IvMsDAwC3ZUVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fZXNjYXBlU3RyaW5nQ2hhci5qc5ihcgANwMCRLsDCmaFkAQgxwJMyMS7AwpihbLBlc2NhcGVTdHJpbmdDaGFykjFfwMDAwNlRV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19lc2NhcGVTdHJpbmdDaGFyLmpzmKFyCRDAMpEwwMKYoXIYDcDAkS7AwpehbwEANGaQwJihZwABNTuQwMKZoWQEEzY3kjY0wMKYoWy0cmVFbXB0eVN0cmluZ0xlYWRpbmeSNmHAwMA02UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvdGVtcGxhdGUuanOYoXIAFMDAkTXAwpmhZAYXODmSODTAwpihbLNyZUVtcHR5U3RyaW5nTWlkZGxlkjhiwMDANNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3RlbXBsYXRlLmpzmKFyABPAwJE3wMKZoWQGIjrAkjo0wMKYoWy1cmVFbXB0eVN0cmluZ1RyYWlsaW5nkjpjwMDANNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3RlbXBsYXRlLmpzmKFyABXAwJE5wMKYoWcBATw+kMDCmaFkBCQ9wJI9O8DCmKFsrHJlRXNUZW1wbGF0ZZI9WsDAwDvZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy90ZW1wbGF0ZS5qc5ihcgAMwMCRPMDCmKFnAQE/QZDAwpmhZAQJQMCSQD7AwpihbKlyZU5vTWF0Y2iVQFdYW1zAwMA+2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvdGVtcGxhdGUuanOYoXIACcDAkT/AwpihZwEBQkSQwMKZoWQEG0PAkkNBwMKYoWyxcmVVbmVzY2FwZWRTdHJpbmeSQ17AwMBB2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvdGVtcGxhdGUuanOYoXIAEcDAkULAwpihZwEBRUeQwMKZoWQEE0bAkkZEwMKYoWyrb2JqZWN0UHJvdG+SRkrAwMBE2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvdGVtcGxhdGUuanOYoXIAC8DAkUXAwpihZwEBSEuQwMKZoWQED0nAlEpJR0XAwpihbK5oYXNPd25Qcm9wZXJ0eZNJXWDAwMBH2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvdGVtcGxhdGUuanOYoXIADsBKkUjAwpihcgMLwMCRRcDCmaFkATVMwNwAIU1OT1BRUlNUVVZXWFlaW1xdXl9gYWJjZGVMPzxIQjU3OcDCmKFsqHRlbXBsYXRlkkxowMDAwNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3RlbXBsYXRlLmpzmKFyCQjATZFLwMKYoXIsEMBOkRnAwpihch8QwE+RGcDCmKFyEg7AUJEQwMKYoXJFCMBRkRzAwpihchYMwFKRBMDCmKFyGBbAU5EnwMKYoXITDMBUkQTAwpihcigWwFWRJ8DCmKFyFwTAVpETwMKYoXIhCsBXkQrAwpihcnoJwFiRP8DCmKFyTAnAWZE/wMKYoXI9DcBakRbAwpihcgMMwFuRPMDCmKFyAwnAXJE/wMKYoXImCcBdkT/AwpihcikOwF6RSMDCmKFyzQFYEcBfkULAwpihcgIQwGCRMMDCmKFyzQG8DsBhkUjAwpihcsylFMBikTXAwpihchgTwGORN8DCmKFyEBXAZJE5wMKYoXLNAU0HwGWRB8DCmKFyzJgHwMCRDcDCmKFnAQNnwJDAwpihZwkLaMCRaMDCmKFyAAjAwJFLwMI=
====catalogjs annotation end====*/