import { default as baseToString } from "./dist/22.js";
import { default as castSlice } from "./dist/140.js";
import { default as hasUnicode } from "./dist/145.js";
import { default as isIterateeCall } from "./dist/70.js";
import { default as isRegExp } from "./isRegExp.js";
import { default as stringToArray } from "./dist/143.js";
import { default as toString0 } from "./toString.js";
var MAX_ARRAY_LENGTH = 4294967295;
function split(string, separator, limit) {
  if (limit && typeof limit != 'number' && isIterateeCall(string, separator, limit)) {
    separator = limit = undefined;
  }

  limit = limit === undefined ? MAX_ARRAY_LENGTH : limit >>> 0;

  if (!limit) {
    return [];
  }

  string = toString0(string);

  if (string && (typeof separator == 'string' || separator != null && !isRegExp(separator))) {
    separator = baseToString(separator);

    if (!separator && hasUnicode(string)) {
      return castSlice(stringToArray(string), 0, limit);
    }
  }

  return string.split(separator, limit);
}
export { split as default };
/*====catalogjs annotation start====
k5eVwqwuL2Rpc3QvMjIuanMDwsCVwq0uL2Rpc3QvMTQwLmpzB8LAlcKtLi9kaXN0LzE0NS5qcwvCwJXCrC4vZGlzdC83MC5qcw/CwJXCrS4vaXNSZWdFeHAuanMTwsCVwq0uL2Rpc3QvMTQzLmpzF8LAlcKtLi90b1N0cmluZy5qcxvCwIGnZGVmYXVsdJWhbKVzcGxpdCzAwNwALpehbwAAA8CQwJmhZAkAAgSRAsDCmaFprGJhc2VUb1N0cmluZ5ICJ8AAp2RlZmF1bHTAwMCYoXILDMDAkQHAwpyhaQABAQeRBMDCAMLAwJihZwgOwMCQwMKZoWQJAAYIkQbAwpmhaaljYXN0U2xpY2WSBinAAadkZWZhdWx0wMDAmKFyCwnAwJEFwMKcoWkBAQULkQjAwgHCwMCYoWcID8DAkMDCmaFkCQAKDJEKwMKZoWmqaGFzVW5pY29kZZIKKMACp2RlZmF1bHTAwMCYoXILCsDAkQnAwpyhaQEBCQ+RDMDCAsLAwJihZwgPwMCQwMKZoWQJAA4QkQ7Awpmhaa5pc0l0ZXJhdGVlQ2FsbJIOI8ADp2RlZmF1bHTAwMCYoXILDsDAkQ3AwpyhaQEBDROREMDCA8LAwJihZwgOwMCQwMKZoWQJABIUkRLAwpmhaahpc1JlZ0V4cJISJsAEp2RlZmF1bHTAwMCYoXILCMDAkRHAwpyhaQEBEReRFMDCBMLAwJihZwgPwMCQwMKZoWQJABYYkRbAwpmhaa1zdHJpbmdUb0FycmF5khYqwAWnZGVmYXVsdMDAwJihcgsNwMCRFcDCnKFpAQEVG5EYwMIFwsDAmKFnCA/AwJDAwpmhZAkAGhyRGsDCmaFpqXRvU3RyaW5nMJIaJcAGp2RlZmF1bHTAwMCYoXILCcDAkRnAwpyhaQEBGR2RHMDCBsLAwJihZwgPwMCQwMKXoW8BAB4rkMCYoWcAAR8hkMDCmaFkBA0gwJIgHsDCmaFssE1BWF9BUlJBWV9MRU5HVEiSICTAwMAekNlFV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3NwbGl0LmpzmKFyABDAwJEfwMKZoWQBSiLAmiMkJSYnKCkqIh/AwpmhbKVzcGxpdJIiLcDAwMCQ2UVXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvc3BsaXQuanOYoXIJBcAjkSHAwpihckgOwCSRDcDCmKFyZhDAJZEfwMKYoXJACcAmkRnAwpihclIIwCeREcDCmKFyIAzAKJEBwMKYoXIkCsApkQnAwpihchkJwCqRBcDCmKFyAQ3AwJEVwMKYoWcBAyzAkMDCmKFnCQstwJEtwMKYoXIABcDAkSHAwg==
====catalogjs annotation end====*/