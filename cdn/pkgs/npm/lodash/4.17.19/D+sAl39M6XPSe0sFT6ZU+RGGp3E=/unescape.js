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
k5KVwq0uL2Rpc3QvMTQ3LmpzA8LAlcKtLi90b1N0cmluZy5qcwfCwIGnZGVmYXVsdJWhbKl1bmVzY2FwZTAiwMDcACSXoW8AAAPAkg4XwJmhZAkAAgSRAsDCmaFprmJhc2VQcm9wZXJ0eU9mkgIRwACnZGVmYXVsdMDAwJihcgsOwMCRAcDCnKFpAAEBB5EEwMIAwsDAmKFnCA/AwJDAwpmhZAkABgiRBsDCmaFpqXRvU3RyaW5nMJIGHcABp2RlZmF1bHTAwMCYoXILCcDAkQXAwpyhaQEBBQmRCMDCAcLAwJihZwgPwMCQwMKXoW8BAAoTkMCYoWcAAQsNkMDCmaFkBFQMwJIMCsDCmaFsrWh0bWxVbmVzY2FwZXOSDBLAwMAKkNlRV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL191bmVzY2FwZUh0bWxDaGFyLmpzmKFyAA3AwJELwMKYoWcBAQ7AkMDCmaFkBAAPwJQPDRALwMKZoWywdW5lc2NhcGVIdG1sQ2hhcpIPIMDAwA2Q2VFXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX3VuZXNjYXBlSHRtbENoYXIuanOYoXIAEMAQkQ7AwpihZwMBEcCSERLAwpihcgAOwBKRAcDCmKFyAQ3AwJELwMKXoW8BABQhkMCYoWcAARUbkMDCmaFkBB4WF5IWFMDCmaFsrXJlRXNjYXBlZEh0bWyTFhofwMDAFJDZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy91bmVzY2FwZS5qc5ihcgANwMCRFcDCmaFkBgAYwJQYFBkVwMKZoWywcmVIYXNFc2NhcGVkSHRtbJIYHsDAwBSQ2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvdW5lc2NhcGUuanOYoXIAEMAZkRfAwpihZwMIGsCRGsDCmKFyBw3AwJEVwMKZoWQBDRzAlx0eHyAcFxXAwpmhbKl1bmVzY2FwZTCSHCPAwMDAkNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3VuZXNjYXBlLmpzmKFyCQnAHZEbwMKYoXIWCcAekQXAwpihch0QwB+RF8DCmKFyHw3AIJEVwMKYoXICEMDAkQ7AwpihZwEDIsCQwMKYoWcJCyPAkSPAwpihcgAJwMCRG8DC
====catalogjs annotation end====*/