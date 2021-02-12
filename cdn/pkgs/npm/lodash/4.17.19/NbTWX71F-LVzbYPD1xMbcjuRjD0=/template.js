import { default as eq } from "./eq.js";
import { default as assignInWith } from "./assignInWith.js";
import { default as attempt } from "./attempt.js";
import { default as baseValues } from "./dist/96.js";
import { default as isError } from "./isError.js";
import { default as isIterateeCall } from "./dist/70.js";
import { default as keys } from "./keys.js";
import { default as reInterpolate } from "./dist/173.js";
import { default as templateSettings } from "./templateSettings.js";
import { default as toString0 } from "./toString.js";
var objectProto0 = Object.prototype;
var hasOwnProperty1 = objectProto0.hasOwnProperty;
function customDefaultsAssignIn(objValue, srcValue, key, object) {
  if (objValue === undefined || eq(objValue, objectProto0[key]) && !hasOwnProperty1.call(object, key)) {
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
var hasOwnProperty0 = objectProto.hasOwnProperty;
function template(string, options, guard) {
  var settings = templateSettings.imports._.templateSettings || templateSettings;

  if (guard && isIterateeCall(string, options, guard)) {
    options = undefined;
  }

  string = toString0(string);
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
  var sourceURL = hasOwnProperty0.call(options, 'sourceURL') ? '//# sourceURL=' + (options.sourceURL + '').replace(/[\r\n]/g, ' ') + '\n' : '';
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
  var variable = hasOwnProperty0.call(options, 'variable') && options.variable;

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
k5qVwqcuL2VxLmpzA8LAlcKxLi9hc3NpZ25JbldpdGguanMGwsCVwqwuL2F0dGVtcHQuanMJwsCVwqwuL2Rpc3QvOTYuanMMwsCVwqwuL2lzRXJyb3IuanMPwsCVwqwuL2Rpc3QvNzAuanMSwsCVwqkuL2tleXMuanMVwsCVwq0uL2Rpc3QvMTczLmpzGMLAlcK1Li90ZW1wbGF0ZVNldHRpbmdzLmpzG8LAlcKtLi90b1N0cmluZy5qcx7CwIGnZGVmYXVsdJWhbKh0ZW1wbGF0ZWfAwNwAaZehbwAAA8CQwJmhZAkAAsCRAsDCmaFpomVxkgIpwACnZGVmYXVsdMDAwJihcgsCwMCRAcDCnKFpABIBBpDAwgDCwMCZoWQJAAXAkQXAwpmhaaxhc3NpZ25JbldpdGiTBVFTwAGnZGVmYXVsdMDAwJihcgsMwMCRBMDCnKFpARwECZDAwgHCwMCZoWQJAAjAkQjAwpmhaadhdHRlbXB0kghkwAKnZGVmYXVsdMDAwJihcgsHwMCRB8DCnKFpARcHDJDAwgLCwMCZoWQJAAvAkQvAwpmhaapiYXNlVmFsdWVzkgtWwAOnZGVmYXVsdMDAwJihcgsKwMCRCsDCnKFpARcKD5DAwgPCwMCZoWQJAA7AkQ7Awpmhaadpc0Vycm9ykg5lwASnZGVmYXVsdMDAwJihcgsHwMCRDcDCnKFpARcNEpDAwgTCwMCZoWQJABHAkRHAwpmhaa5pc0l0ZXJhdGVlQ2FsbJIRT8AFp2RlZmF1bHTAwMCYoXILDsDAkRDAwpyhaQEXEBWQwMIFwsDAmaFkCQAUwJEUwMKZoWmka2V5c5IUVcAGp2RlZmF1bHTAwMCYoXILBMDAkRPAwpyhaQEUExiQwMIGwsDAmaFkCQAXwJEXwMKZoWmtcmVJbnRlcnBvbGF0ZZIXWcAHp2RlZmF1bHTAwMCYoXILDcDAkRbAwpyhaQEYFhuQwMIHwsDAmaFkCQAawJEawMKZoWmwdGVtcGxhdGVTZXR0aW5nc5MaTU7ACKdkZWZhdWx0wMDAmKFyCxDAwJEZwMKcoWkBIBkekMDCCMLAwJmhZAkAHcCRHcDCmaFpqXRvU3RyaW5nMJIdUMAJp2RlZmF1bHTAwMCYoXILCcDAkRzAwpyhaQEYHB+QwMIJwsDAl6FvAQAgLJDAmKFnAAEhI5DAwpmhZAQTIsCSIiDAwpmhbKxvYmplY3RQcm90bzCTIiYqwMDAIJDZV1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fY3VzdG9tRGVmYXVsdHNBc3NpZ25Jbi5qc5ihcgAMwMCRIcDCmKFnAQEkJ5DAwpmhZAQPJcCUJiUjIcDCmaFsr2hhc093blByb3BlcnR5MZIlK8DAwCOQ2VdXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2N1c3RvbURlZmF1bHRzQXNzaWduSW4uanOYoXIAD8AmkSTAwpihcgMMwMCRIcDCmaFkAUQowJYpKisoISTAwpmhbLZjdXN0b21EZWZhdWx0c0Fzc2lnbklukyhSVMDAwMCQ2VdXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2N1c3RvbURlZmF1bHRzQXNzaWduSW4uanOYoXIJFsApkSfAwpihckQCwCqRAcDCmKFyCwzAK5EhwMKYoXILD8DAkSTAwpehbwEALTOQwJihZwABLjCQwMKZoWQEYy/Aki8twMKZoWytc3RyaW5nRXNjYXBlc5IvMsDAwC2Q2VFXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2VzY2FwZVN0cmluZ0NoYXIuanOYoXIADcDAkS7AwpmhZAEIMcCTMjEuwMKZoWywZXNjYXBlU3RyaW5nQ2hhcpIxX8DAwMCQ2VFXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2VzY2FwZVN0cmluZ0NoYXIuanOYoXIJEMAykTDAwpihchgNwMCRLsDCl6FvAQA0ZpDAmKFnAAE1O5DAwpmhZAQTNjeSNjTAwpmhbLRyZUVtcHR5U3RyaW5nTGVhZGluZ5I2YcDAwDSQ2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvdGVtcGxhdGUuanOYoXIAFMDAkTXAwpmhZAYXODmSODTAwpmhbLNyZUVtcHR5U3RyaW5nTWlkZGxlkjhiwMDANJDZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy90ZW1wbGF0ZS5qc5ihcgATwMCRN8DCmaFkBiI6wJI6NMDCmaFstXJlRW1wdHlTdHJpbmdUcmFpbGluZ5I6Y8DAwDSQ2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvdGVtcGxhdGUuanOYoXIAFcDAkTnAwpihZwEBPD6QwMKZoWQEJD3Akj07wMKZoWyscmVFc1RlbXBsYXRlkj1awMDAO5DZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy90ZW1wbGF0ZS5qc5ihcgAMwMCRPMDCmKFnAQE/QZDAwpmhZAQJQMCSQD7AwpmhbKlyZU5vTWF0Y2iVQFdYW1zAwMA+kNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3RlbXBsYXRlLmpzmKFyAAnAwJE/wMKYoWcBAUJEkMDCmaFkBBtDwJJDQcDCmaFssXJlVW5lc2NhcGVkU3RyaW5nkkNewMDAQZDZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy90ZW1wbGF0ZS5qc5ihcgARwMCRQsDCmKFnAQFFR5DAwpmhZAQTRsCSRkTAwpmhbKtvYmplY3RQcm90b5JGSsDAwESQ2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvdGVtcGxhdGUuanOYoXIAC8DAkUXAwpihZwEBSEuQwMKZoWQED0nAlEpJR0XAwpmhbK9oYXNPd25Qcm9wZXJ0eTCTSV1gwMDAR5DZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy90ZW1wbGF0ZS5qc5ihcgAPwEqRSMDCmKFyAwvAwJFFwMKZoWQBNUzA3AAhTU5PUFFSU1RVVldYWVpbXF1eX2BhYmNkZUw/PEhCNTc5wMKZoWyodGVtcGxhdGWSTGjAwMDAkNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3RlbXBsYXRlLmpzmKFyCQjATZFLwMKYoXIsEMBOkRnAwpihch8QwE+RGcDCmKFyEg7AUJEQwMKYoXJFCcBRkRzAwpihchYMwFKRBMDCmKFyGBbAU5EnwMKYoXITDMBUkQTAwpihcigWwFWRJ8DCmKFyFwTAVpETwMKYoXIhCsBXkQrAwpihcnoJwFiRP8DCmKFyTAnAWZE/wMKYoXI9DcBakRbAwpihcgMMwFuRPMDCmKFyAwnAXJE/wMKYoXImCcBdkT/AwpihcikPwF6RSMDCmKFyzQFYEcBfkULAwpihcgIQwGCRMMDCmKFyzQG8D8BhkUjAwpihcsylFMBikTXAwpihchgTwGORN8DCmKFyEBXAZJE5wMKYoXLNAU0HwGWRB8DCmKFyzJgHwMCRDcDCmKFnAQNnwJDAwpihZwkLaMCRaMDCmKFyAAjAwJFLwMI=
====catalogjs annotation end====*/