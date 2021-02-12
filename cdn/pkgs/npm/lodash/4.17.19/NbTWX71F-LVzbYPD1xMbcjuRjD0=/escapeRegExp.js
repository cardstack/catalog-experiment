import { default as toString0 } from "./toString.js";
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g,
    reHasRegExpChar = RegExp(reRegExpChar.source);
function escapeRegExp(string) {
  string = toString0(string);
  return string && reHasRegExpChar.test(string) ? string.replace(reRegExpChar, '\\$&') : string;
}
export { escapeRegExp as default };
/*====catalogjs annotation start====
k5GVwq0uL3RvU3RyaW5nLmpzA8LAgadkZWZhdWx0laFsrGVzY2FwZVJlZ0V4cBLAwNwAFJehbwAAA8CRCMCZoWQJAALAkQLAwpmhaal0b1N0cmluZzCSAg7AAKdkZWZhdWx0wMDAmKFyCwnAwJEBwMKcoWkAGAEEkMDCAMLAwJehbwEABRGQwJihZwABBgyQwMKZoWQEGAcIkgcFwMKZoWyscmVSZWdFeHBDaGFykwcLEMDAwAWQ2UxXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvZXNjYXBlUmVnRXhwLmpzmKFyAAzAwJEGwMKZoWQGAAnAlAkFCgbAwpmhbK9yZUhhc1JlZ0V4cENoYXKSCQ/AwMAFkNlMV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2VzY2FwZVJlZ0V4cC5qc5ihcgAPwAqRCMDCmKFnAwgLwJELwMKYoXIHDMDAkQbAwpmhZAEVDcCWDg8QDQgGwMKZoWysZXNjYXBlUmVnRXhwkg0TwMDAwJDZTFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9lc2NhcGVSZWdFeHAuanOYoXIJDMAOkQzAwpihchYJwA+RAcDCmKFyHQ/AEJEIwMKYoXIfDMDAkQbAwpihZwEDEsCQwMKYoWcJCxPAkRPAwpihcgAMwMCRDMDC
====catalogjs annotation end====*/