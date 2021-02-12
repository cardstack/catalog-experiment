import { default as basePropertyOf } from "./dist/147.js";
import { default as toString0 } from "./toString.js";
var htmlUnescapes = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'"
};
var unescapeHtmlChar = basePropertyOf(htmlUnescapes);
var reEscapedHtml = /&(?:amp|lt|gt|quot|#39);/g,
    reHasEscapedHtml = RegExp(reEscapedHtml.source);
function unescape0(string) {
  string = toString0(string);
  return string && reHasEscapedHtml.test(string) ? string.replace(reEscapedHtml, unescapeHtmlChar) : string;
}
export { unescape0 as default };
/*====catalogjs annotation start====
k5KVwq0uL2Rpc3QvMTQ3LmpzA8LAlcKtLi90b1N0cmluZy5qcwbCwIGnZGVmYXVsdJWhbKl1bmVzY2FwZTAgwMDcACKXoW8AAAPAkgwVwJmhZAkAAsCRAsDCmaFprmJhc2VQcm9wZXJ0eU9mkgIPwACnZGVmYXVsdMDAwJihcgsOwMCRAcDCnKFpABgBBpDAwgDCwMCZoWQJAAXAkQXAwpmhaal0b1N0cmluZzCSBRvAAadkZWZhdWx0wMDAmKFyCwnAwJEEwMKcoWkBGAQHkMDCAcLAwJehbwEACBGQwJihZwABCQuQwMKZoWQEVArAkgoIwMKZoWytaHRtbFVuZXNjYXBlc5IKEMDAwAiQ2VFXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX3VuZXNjYXBlSHRtbENoYXIuanOYoXIADcDAkQnAwpihZwEBDMCQwMKZoWQEAA3AlA0LDgnAwpmhbLB1bmVzY2FwZUh0bWxDaGFykg0ewMDAC5DZUVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fdW5lc2NhcGVIdG1sQ2hhci5qc5ihcgAQwA6RDMDCmKFnAwEPwJIPEMDCmKFyAA7AEJEBwMKYoXIBDcDAkQnAwpehbwEAEh+QwJihZwABExmQwMKZoWQEHhQVkhQSwMKZoWytcmVFc2NhcGVkSHRtbJMUGB3AwMASkNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3VuZXNjYXBlLmpzmKFyAA3AwJETwMKZoWQGABbAlBYSFxPAwpmhbLByZUhhc0VzY2FwZWRIdG1skhYcwMDAEpDZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy91bmVzY2FwZS5qc5ihcgAQwBeRFcDCmKFnAwgYwJEYwMKYoXIHDcDAkRPAwpmhZAENGsCXGxwdHhoVE8DCmaFsqXVuZXNjYXBlMJIaIcDAwMCQ2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvdW5lc2NhcGUuanOYoXIJCcAbkRnAwpihchYJwByRBMDCmKFyHRDAHZEVwMKYoXIfDcAekRPAwpihcgIQwMCRDMDCmKFnAQMgwJDAwpihZwkLIcCRIcDCmKFyAAnAwJEZwMI=
====catalogjs annotation end====*/