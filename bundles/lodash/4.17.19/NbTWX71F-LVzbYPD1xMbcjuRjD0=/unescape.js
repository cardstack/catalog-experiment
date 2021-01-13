import { default as basePropertyOf } from "./dist/147.js";
import { default as toString } from "./toString.js";
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
function unescape(string) {
  string = toString(string);
  return string && reHasEscapedHtml.test(string) ? string.replace(reEscapedHtml, unescapeHtmlChar) : string;
}
export { unescape as default };
/*====catalogjs annotation start====
k5KVwq0uL2Rpc3QvMTQ3LmpzA8LAlcKtLi90b1N0cmluZy5qcwbCwIGnZGVmYXVsdJShbKh1bmVzY2FwZSDA3AAil6FvAAADwJMMGRXAmaFkCQACwJECwMKYoWmuYmFzZVByb3BlcnR5T2aSAg/AAKdkZWZhdWx0wMCYoXILDsDAkQHAwpyhaQAYAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmodG9TdHJpbmeSBRvAAadkZWZhdWx0wMCYoXILCMDAkQTAwpyhaQEYBAeQwMIBwsDAl6FvAQAIEZDAmKFnAAEJC5DAwpmhZARUCsCSCgjAwpihbK1odG1sVW5lc2NhcGVzkgoQwMDACNlRV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL191bmVzY2FwZUh0bWxDaGFyLmpzmKFyAA3AwJEJwMKYoWcBAQzAkMDCmaFkBAANwJQNCw4JwMKYoWywdW5lc2NhcGVIdG1sQ2hhcpINHsDAwAvZUVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fdW5lc2NhcGVIdG1sQ2hhci5qc5ihcgAQwA6RDMDCmKFnAwEPwJMPEAzAwpihcgAOwBCRAcDCmKFyAQ3AwJEJwMKXoW8BABIfkMCYoWcAARMZkMDCmaFkBB4UFZIUEsDCmKFsrXJlRXNjYXBlZEh0bWyTFBgdwMDAEtlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3VuZXNjYXBlLmpzmKFyAA3AwJETwMKZoWQGABbAlBYSFxPAwpihbLByZUhhc0VzY2FwZWRIdG1skhYcwMDAEtlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3VuZXNjYXBlLmpzmKFyABDAF5EVwMKYoWcDCBjAkhgVwMKYoXIHDcDAkRPAwpmhZAENGsCXGxwdHhoVE8DCmKFsqHVuZXNjYXBlkhohwMDAwNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3VuZXNjYXBlLmpzmKFyCQjAG5EZwMKYoXIWCMAckQTAwpihch0QwB2RFcDCmKFyHw3AHpETwMKYoXICEMDAkQzAwpihZwEDIMCQwMKYoWcJCyHAkSHAwpihcgAIwMCRGcDC
====catalogjs annotation end====*/