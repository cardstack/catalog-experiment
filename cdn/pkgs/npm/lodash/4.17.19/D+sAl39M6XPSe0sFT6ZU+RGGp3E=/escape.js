import { default as basePropertyOf } from "./dist/147.js";
import { default as toString0 } from "./toString.js";
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
function escape0(string) {
  string = toString0(string);
  return string && reHasUnescapedHtml.test(string) ? string.replace(reUnescapedHtml, escapeHtmlChar) : string;
}
export { escape0 as default };
/*====catalogjs annotation start====
k5KVwq0uL2Rpc3QvMTQ3LmpzA8LAlcKtLi90b1N0cmluZy5qcwfCwIGnZGVmYXVsdJWhbKdlc2NhcGUwIsDA3AAkl6FvAAADwJIOF8CZoWQJAAIEkQLAwpmhaa5iYXNlUHJvcGVydHlPZpICEcAAp2RlZmF1bHTAwMCYoXILDsDAkQHAwpyhaQABAQeRBMDCAMLAwJihZwgPwMCQwMKZoWQJAAYIkQbAwpmhaal0b1N0cmluZzCSBh3AAadkZWZhdWx0wMDAmKFyCwnAwJEFwMKcoWkBAQUJkQjAwgHCwMCYoWcID8DAkMDCl6FvAQAKE5DAmKFnAAELDZDAwpmhZARUDMCSDArAwpmhbKtodG1sRXNjYXBlc5IMEsDAwAqQ2U9XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2VzY2FwZUh0bWxDaGFyLmpzmKFyAAvAwJELwMKYoWcBAQ7AkMDCmaFkBAAPwJQPDRALwMKZoWyuZXNjYXBlSHRtbENoYXKSDyDAwMANkNlPV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19lc2NhcGVIdG1sQ2hhci5qc5ihcgAOwBCRDsDCmKFnAwERwJIREsDCmKFyAA7AEpEBwMKYoXIBC8DAkQvAwpehbwEAFCGQwJihZwABFRuQwMKZoWQEDRYXkhYUwMKZoWyvcmVVbmVzY2FwZWRIdG1skxYaH8DAwBSQ2UZXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvZXNjYXBlLmpzmKFyAA/AwJEVwMKZoWQGABjAlBgUGRXAwpmhbLJyZUhhc1VuZXNjYXBlZEh0bWySGB7AwMAUkNlGV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2VzY2FwZS5qc5ihcgASwBmRF8DCmKFnAwgawJEawMKYoXIHD8DAkRXAwpmhZAENHMCXHR4fIBwXFcDCmaFsp2VzY2FwZTCSHCPAwMDAkNlGV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2VzY2FwZS5qc5ihcgkHwB2RG8DCmKFyFgnAHpEFwMKYoXIdEsAfkRfAwpihch8PwCCRFcDCmKFyAg7AwJEOwMKYoWcBAyLAkMDCmKFnCQsjwJEjwMKYoXIAB8DAkRvAwg==
====catalogjs annotation end====*/