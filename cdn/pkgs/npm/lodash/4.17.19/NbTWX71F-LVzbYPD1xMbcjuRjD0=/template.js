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
k5qVwqcuL2VxLmpzA8LAlcKxLi9hc3NpZ25JbldpdGguanMHwsCVwqwuL2F0dGVtcHQuanMLwsCVwqwuL2Rpc3QvOTYuanMPwsCVwqwuL2lzRXJyb3IuanMTwsCVwqwuL2Rpc3QvNzAuanMXwsCVwqkuL2tleXMuanMbwsCVwq0uL2Rpc3QvMTczLmpzH8LAlcK1Li90ZW1wbGF0ZVNldHRpbmdzLmpzI8LAlcKtLi90b1N0cmluZy5qcyfCwIGnZGVmYXVsdJWhbKh0ZW1wbGF0ZXHAwNwAc5ehbwAAA8CQwJmhZAkAAgSRAsDCmaFpomVxkgIzwACnZGVmYXVsdMDAwJihcgsCwMCRAcDCnKFpAAEBB5EEwMIAwsDAmKFnCAnAwJDAwpmhZAkABgiRBsDCmaFprGFzc2lnbkluV2l0aJMGW13AAadkZWZhdWx0wMDAmKFyCwzAwJEFwMKcoWkBAQULkQjAwgHCwMCYoWcIE8DAkMDCmaFkCQAKDJEKwMKZoWmnYXR0ZW1wdJIKbsACp2RlZmF1bHTAwMCYoXILB8DAkQnAwpyhaQEBCQ+RDMDCAsLAwJihZwgOwMCQwMKZoWQJAA4QkQ7AwpmhaapiYXNlVmFsdWVzkg5gwAOnZGVmYXVsdMDAwJihcgsKwMCRDcDCnKFpAQENE5EQwMIDwsDAmKFnCA7AwJDAwpmhZAkAEhSREsDCmaFpp2lzRXJyb3KSEm/ABKdkZWZhdWx0wMDAmKFyCwfAwJERwMKcoWkBAREXkRTAwgTCwMCYoWcIDsDAkMDCmaFkCQAWGJEWwMKZoWmuaXNJdGVyYXRlZUNhbGySFlnABadkZWZhdWx0wMDAmKFyCw7AwJEVwMKcoWkBARUbkRjAwgXCwMCYoWcIDsDAkMDCmaFkCQAaHJEawMKZoWmka2V5c5IaX8AGp2RlZmF1bHTAwMCYoXILBMDAkRnAwpyhaQEBGR+RHMDCBsLAwJihZwgLwMCQwMKZoWQJAB4gkR7Awpmhaa1yZUludGVycG9sYXRlkh5jwAenZGVmYXVsdMDAwJihcgsNwMCRHcDCnKFpAQEdI5EgwMIHwsDAmKFnCA/AwJDAwpmhZAkAIiSRIsDCmaFpsHRlbXBsYXRlU2V0dGluZ3OTIldYwAinZGVmYXVsdMDAwJihcgsQwMCRIcDCnKFpAQEhJ5EkwMIIwsDAmKFnCBfAwJDAwpmhZAkAJiiRJsDCmaFpqXRvU3RyaW5nMJImWsAJp2RlZmF1bHTAwMCYoXILCcDAkSXAwpyhaQEBJSmRKMDCCcLAwJihZwgPwMCQwMKXoW8BACo2kMCYoWcAASstkMDCmaFkBBMswJIsKsDCmaFsrG9iamVjdFByb3RvMJMsMDTAwMAqkNlXV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19jdXN0b21EZWZhdWx0c0Fzc2lnbkluLmpzmKFyAAzAwJErwMKYoWcBAS4xkMDCmaFkBA8vwJQwLy0rwMKZoWyvaGFzT3duUHJvcGVydHkxki81wMDALZDZV1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fY3VzdG9tRGVmYXVsdHNBc3NpZ25Jbi5qc5ihcgAPwDCRLsDCmKFyAwzAwJErwMKZoWQBRDLAljM0NTIrLsDCmaFstmN1c3RvbURlZmF1bHRzQXNzaWduSW6TMlxewMDAwJDZV1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fY3VzdG9tRGVmYXVsdHNBc3NpZ25Jbi5qc5ihcgkWwDORMcDCmKFyRALANJEBwMKYoXILDMA1kSvAwpihcgsPwMCRLsDCl6FvAQA3PZDAmKFnAAE4OpDAwpmhZARjOcCSOTfAwpmhbK1zdHJpbmdFc2NhcGVzkjk8wMDAN5DZUVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fZXNjYXBlU3RyaW5nQ2hhci5qc5ihcgANwMCROMDCmaFkAQg7wJM8OzjAwpmhbLBlc2NhcGVTdHJpbmdDaGFykjtpwMDAwJDZUVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fZXNjYXBlU3RyaW5nQ2hhci5qc5ihcgkQwDyROsDCmKFyGA3AwJE4wMKXoW8BAD5wkMCYoWcAAT9FkMDCmaFkBBNAQZJAPsDCmaFstHJlRW1wdHlTdHJpbmdMZWFkaW5nkkBrwMDAPpDZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy90ZW1wbGF0ZS5qc5ihcgAUwMCRP8DCmaFkBhdCQ5JCPsDCmaFss3JlRW1wdHlTdHJpbmdNaWRkbGWSQmzAwMA+kNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3RlbXBsYXRlLmpzmKFyABPAwJFBwMKZoWQGIkTAkkQ+wMKZoWy1cmVFbXB0eVN0cmluZ1RyYWlsaW5nkkRtwMDAPpDZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy90ZW1wbGF0ZS5qc5ihcgAVwMCRQ8DCmKFnAQFGSJDAwpmhZAQkR8CSR0XAwpmhbKxyZUVzVGVtcGxhdGWSR2TAwMBFkNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3RlbXBsYXRlLmpzmKFyAAzAwJFGwMKYoWcBAUlLkMDCmaFkBAlKwJJKSMDCmaFsqXJlTm9NYXRjaJVKYWJlZsDAwEiQ2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvdGVtcGxhdGUuanOYoXIACcDAkUnAwpihZwEBTE6QwMKZoWQEG03Akk1LwMKZoWyxcmVVbmVzY2FwZWRTdHJpbmeSTWjAwMBLkNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3RlbXBsYXRlLmpzmKFyABHAwJFMwMKYoWcBAU9RkMDCmaFkBBNQwJJQTsDCmaFsq29iamVjdFByb3RvklBUwMDATpDZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy90ZW1wbGF0ZS5qc5ihcgALwMCRT8DCmKFnAQFSVZDAwpmhZAQPU8CUVFNRT8DCmaFsr2hhc093blByb3BlcnR5MJNTZ2rAwMBRkNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3RlbXBsYXRlLmpzmKFyAA/AVJFSwMKYoXIDC8DAkU/AwpmhZAE1VsDcACFXWFlaW1xdXl9gYWJjZGVmZ2hpamtsbW5vVklGUkw/QUPAwpmhbKh0ZW1wbGF0ZZJWcsDAwMCQ2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvdGVtcGxhdGUuanOYoXIJCMBXkVXAwpihciwQwFiRIcDCmKFyHxDAWZEhwMKYoXISDsBakRXAwpihckUJwFuRJcDCmKFyFgzAXJEFwMKYoXIYFsBdkTHAwpihchMMwF6RBcDCmKFyKBbAX5ExwMKYoXIXBMBgkRnAwpihciEKwGGRDcDCmKFyegnAYpFJwMKYoXJMCcBjkUnAwpihcj0NwGSRHcDCmKFyAwzAZZFGwMKYoXIDCcBmkUnAwpihciYJwGeRScDCmKFyKQ/AaJFSwMKYoXLNAVgRwGmRTMDCmKFyAhDAapE6wMKYoXLNAbwPwGuRUsDCmKFyzKUUwGyRP8DCmKFyGBPAbZFBwMKYoXIQFcBukUPAwpihcs0BTQfAb5EJwMKYoXLMmAfAwJERwMKYoWcBA3HAkMDCmKFnCQtywJFywMKYoXIACMDAkVXAwg==
====catalogjs annotation end====*/