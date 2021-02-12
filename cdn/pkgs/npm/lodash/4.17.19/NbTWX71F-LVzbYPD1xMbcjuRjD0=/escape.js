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
k5KVwq0uL2Rpc3QvMTQ3LmpzA8LAlcKtLi90b1N0cmluZy5qcwbCwIGnZGVmYXVsdJWhbKdlc2NhcGUwIMDA3AAil6FvAAADwJIMFcCZoWQJAALAkQLAwpmhaa5iYXNlUHJvcGVydHlPZpICD8AAp2RlZmF1bHTAwMCYoXILDsDAkQHAwpyhaQAYAQaQwMIAwsDAmaFkCQAFwJEFwMKZoWmpdG9TdHJpbmcwkgUbwAGnZGVmYXVsdMDAwJihcgsJwMCRBMDCnKFpARgEB5DAwgHCwMCXoW8BAAgRkMCYoWcAAQkLkMDCmaFkBFQKwJIKCMDCmaFsq2h0bWxFc2NhcGVzkgoQwMDACJDZT1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fZXNjYXBlSHRtbENoYXIuanOYoXIAC8DAkQnAwpihZwEBDMCQwMKZoWQEAA3AlA0LDgnAwpmhbK5lc2NhcGVIdG1sQ2hhcpINHsDAwAuQ2U9XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2VzY2FwZUh0bWxDaGFyLmpzmKFyAA7ADpEMwMKYoWcDAQ/Akg8QwMKYoXIADsAQkQHAwpihcgELwMCRCcDCl6FvAQASH5DAmKFnAAETGZDAwpmhZAQNFBWSFBLAwpmhbK9yZVVuZXNjYXBlZEh0bWyTFBgdwMDAEpDZRlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9lc2NhcGUuanOYoXIAD8DAkRPAwpmhZAYAFsCUFhIXE8DCmaFssnJlSGFzVW5lc2NhcGVkSHRtbJIWHMDAwBKQ2UZXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvZXNjYXBlLmpzmKFyABLAF5EVwMKYoWcDCBjAkRjAwpihcgcPwMCRE8DCmaFkAQ0awJcbHB0eGhUTwMKZoWynZXNjYXBlMJIaIcDAwMCQ2UZXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvZXNjYXBlLmpzmKFyCQfAG5EZwMKYoXIWCcAckQTAwpihch0SwB2RFcDCmKFyHw/AHpETwMKYoXICDsDAkQzAwpihZwEDIMCQwMKYoWcJCyHAkSHAwpihcgAHwMCRGcDC
====catalogjs annotation end====*/