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
k5KVwq0uL2Rpc3QvMTQ3LmpzA8LAlcKtLi90b1N0cmluZy5qcwbCwIGnZGVmYXVsdJShbKZlc2NhcGUgwNwAIpehbwAAA8CSDBXAmaFkCQACwJECwMKYoWmuYmFzZVByb3BlcnR5T2aSAg/AAKdkZWZhdWx0wMCYoXILDsDAkQHAwpyhaQAYAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmodG9TdHJpbmeSBRvAAadkZWZhdWx0wMCYoXILCMDAkQTAwpyhaQEYBAeQwMIBwsDAl6FvAQAIEZDAmKFnAAEJC5DAwpmhZARUCsCSCgjAwpihbKtodG1sRXNjYXBlc5IKEMDAwAjZT1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fZXNjYXBlSHRtbENoYXIuanOYoXIAC8DAkQnAwpihZwEBDMCQwMKZoWQEAA3AlA0LDgnAwpihbK5lc2NhcGVIdG1sQ2hhcpINHsDAwAvZT1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fZXNjYXBlSHRtbENoYXIuanOYoXIADsAOkQzAwpihZwMBD8CSDxDAwpihcgAOwBCRAcDCmKFyAQvAwJEJwMKXoW8BABIfkMCYoWcAARMZkMDCmaFkBA0UFZIUEsDCmKFsr3JlVW5lc2NhcGVkSHRtbJMUGB3AwMAS2UZXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvZXNjYXBlLmpzmKFyAA/AwJETwMKZoWQGABbAlBYSFxPAwpihbLJyZUhhc1VuZXNjYXBlZEh0bWySFhzAwMAS2UZXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvZXNjYXBlLmpzmKFyABLAF5EVwMKYoWcDCBjAkRjAwpihcgcPwMCRE8DCmaFkAQ0awJcbHB0eGhUTwMKYoWymZXNjYXBlkhohwMDAwNlGV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2VzY2FwZS5qc5ihcgkGwBuRGcDCmKFyFgjAHJEEwMKYoXIdEsAdkRXAwpihch8PwB6RE8DCmKFyAg7AwJEMwMKYoWcBAyDAkMDCmKFnCQshwJEhwMKYoXIABsDAkRnAwg==
====catalogjs annotation end====*/