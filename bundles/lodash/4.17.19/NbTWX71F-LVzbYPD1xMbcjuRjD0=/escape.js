import { default as basePropertyOf } from "./dist/147.js";
import { default as toString } from "./toString.js";
var htmlEscapes = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};
var escapeHtmlChar = basePropertyOf(htmlEscapes);
var reUnescapedHtml = /[&<>"']/g,
    reHasUnescapedHtml = RegExp(reUnescapedHtml.source);
function escape(string) {
  string = toString(string);
  return string && reHasUnescapedHtml.test(string) ? string.replace(reUnescapedHtml, escapeHtmlChar) : string;
}
export { escape as default };
/*====catalogjs annotation start====
k5KVwq0uL2Rpc3QvMTQ3LmpzA8LAlcKtLi90b1N0cmluZy5qcwbCwIGnZGVmYXVsdJShbKZlc2NhcGUgwNwAIpehbwAAA8CTDBkVwJmhZAkAAsCRAsDCmKFprmJhc2VQcm9wZXJ0eU9mkgIPwACnZGVmYXVsdMDAmKFyCw7AwJEBwMKcoWkAGAEGkMDCAMLAwJmhZAkABcCRBcDCmKFpqHRvU3RyaW5nkgUbwAGnZGVmYXVsdMDAmKFyCwjAwJEEwMKcoWkBGAQHkMDCAcLAwJehbwEACBGQwJihZwABCQuQwMKZoWQEVArAkgoIwMKYoWyraHRtbEVzY2FwZXOSChDAwMAI2U9XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2VzY2FwZUh0bWxDaGFyLmpzmKFyAAvAwJEJwMKYoWcBAQzAkMDCmaFkBAANwJQNCw4JwMKYoWyuZXNjYXBlSHRtbENoYXKSDR7AwMAL2U9XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2VzY2FwZUh0bWxDaGFyLmpzmKFyAA7ADpEMwMKYoWcDAQ/Akw8QDMDCmKFyAA7AEJEBwMKYoXIBC8DAkQnAwpehbwEAEh+QwJihZwABExmQwMKZoWQEDRQVkhQSwMKYoWyvcmVVbmVzY2FwZWRIdG1skxQYHcDAwBLZRlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9lc2NhcGUuanOYoXIAD8DAkRPAwpmhZAYAFsCUFhIXE8DCmKFssnJlSGFzVW5lc2NhcGVkSHRtbJIWHMDAwBLZRlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9lc2NhcGUuanOYoXIAEsAXkRXAwpihZwMIGMCSGBXAwpihcgcPwMCRE8DCmaFkAQ0awJcbHB0eGhUTwMKYoWymZXNjYXBlkhohwMDAwNlGV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2VzY2FwZS5qc5ihcgkGwBuRGcDCmKFyFgjAHJEEwMKYoXIdEsAdkRXAwpihch8PwB6RE8DCmKFyAg7AwJEMwMKYoWcBAyDAkMDCmKFnCQshwJEhwMKYoXIABsDAkRnAwg==
====catalogjs annotation end====*/