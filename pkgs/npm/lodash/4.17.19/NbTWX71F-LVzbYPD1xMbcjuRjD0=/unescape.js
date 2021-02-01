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
k5KVwq0uL2Rpc3QvMTQ3LmpzA8LAlcKtLi90b1N0cmluZy5qcwbCwIGnZGVmYXVsdJShbKh1bmVzY2FwZSDA3AAil6FvAAADwJIMFcCZoWQJAALAkQLAwpihaa5iYXNlUHJvcGVydHlPZpICD8AAp2RlZmF1bHTAwJihcgsOwMCRAcDCnKFpABgBBpDAwgDCwMCZoWQJAAXAkQXAwpihaah0b1N0cmluZ5IFG8ABp2RlZmF1bHTAwJihcgsIwMCRBMDCnKFpARgEB5DAwgHCwMCXoW8BAAgRkMCYoWcAAQkLkMDCmaFkBFQKwJIKCMDCmKFsrWh0bWxVbmVzY2FwZXOSChDAwMAI2VFXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX3VuZXNjYXBlSHRtbENoYXIuanOYoXIADcDAkQnAwpihZwEBDMCQwMKZoWQEAA3AlA0LDgnAwpihbLB1bmVzY2FwZUh0bWxDaGFykg0ewMDAC9lRV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL191bmVzY2FwZUh0bWxDaGFyLmpzmKFyABDADpEMwMKYoWcDAQ/Akg8QwMKYoXIADsAQkQHAwpihcgENwMCRCcDCl6FvAQASH5DAmKFnAAETGZDAwpmhZAQeFBWSFBLAwpihbK1yZUVzY2FwZWRIdG1skxQYHcDAwBLZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy91bmVzY2FwZS5qc5ihcgANwMCRE8DCmaFkBgAWwJQWEhcTwMKYoWywcmVIYXNFc2NhcGVkSHRtbJIWHMDAwBLZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy91bmVzY2FwZS5qc5ihcgAQwBeRFcDCmKFnAwgYwJEYwMKYoXIHDcDAkRPAwpmhZAENGsCXGxwdHhoVE8DCmKFsqHVuZXNjYXBlkhohwMDAwNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3VuZXNjYXBlLmpzmKFyCQjAG5EZwMKYoXIWCMAckQTAwpihch0QwB2RFcDCmKFyHw3AHpETwMKYoXICEMDAkQzAwpihZwEDIMCQwMKYoWcJCyHAkSHAwpihcgAIwMCRGcDC
====catalogjs annotation end====*/