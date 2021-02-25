import { default as freeGlobal } from "./95.js";
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;
var moduleExports = freeModule && freeModule.exports === freeExports;
var freeProcess = moduleExports && freeGlobal.process;
var nodeUtil = function () {
  try {
    var types = freeModule && freeModule.require && freeModule.require('util').types;

    if (types) {
      return types;
    }

    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}();
export { nodeUtil as default };
/*====catalogjs annotation start====
k5GVwqcuLzk1LmpzA8LAgadkZWZhdWx0laFsqG5vZGVVdGlsI8DA3AAll6FvAAADwJEZwJmhZAkAAgSRAsDCmaFpqmZyZWVHbG9iYWySAhfAAKdkZWZhdWx0wMDAmKFyCwrAwJEBwMKcoWkAAQEFkQTAwgDCwMCYoWcICcDAkMDCl6FvAQAGIpDAmKFnAAEHCZDAwpmhZARICMCSCAbAwpmhbKtmcmVlRXhwb3J0c5MIDBLAwMAGkNlJV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19ub2RlVXRpbC5qc5ihcgALwMCRB8DCmKFnAQEKDZDAwpmhZARFC8CUDAsJB8DCmaFsqmZyZWVNb2R1bGWWCxARHB0ewMDACZDZSVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fbm9kZVV0aWwuanOYoXIACsAMkQrAwpihcgMLwMCRB8DCmKFnAQEOE5DAwpmhZAQAD8CXEBESDw0KB8DCmaFsrW1vZHVsZUV4cG9ydHOSDxbAwMANkNlJV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19ub2RlVXRpbC5qc5ihcgANwBCRDsDCmKFyAwrAEZEKwMKYoXIECsASkQrAwpihcg0LwMCRB8DCmKFnAQEUGJDAwpmhZAQIFcCVFhcVEw7AwpmhbKtmcmVlUHJvY2Vzc5QVHyAhwMDAE5DZSVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fbm9kZVV0aWwuanOYoXIAC8AWkRTAwpihcgMNwBeRDsDCmKFyBArAwJEBwMKYoWcBARnAkMDCmaFkBAAawJUaGBsKFMDCmaFsqG5vZGVVdGlskhokwMDAGJDZSVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fbm9kZVV0aWwuanOYoXIACMAbkRnAwpihZwMmHMCWHB0eHyAhwMKYoXImCsAdkQrAwpihcgQKwB6RCsDCmKFyDArAH5EKwMKYoXJQC8AgkRTAwpihcgQLwCGRFMDCmKFyDAvAwJEUwMKYoWcBAyPAkMDCmKFnCQskwJEkwMKYoXIACMDAkRnAwg==
====catalogjs annotation end====*/