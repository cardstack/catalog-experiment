import { default as toString } from "./toString.js";
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g,
    reHasRegExpChar = RegExp(reRegExpChar.source);
function escapeRegExp(string) {
  string = toString(string);
  return string && reHasRegExpChar.test(string) ? string.replace(reRegExpChar, '\\$&') : string;
}
export { escapeRegExp as default };
/*====catalogjs annotation start====
k5GVwq0uL3RvU3RyaW5nLmpzA8LAgadkZWZhdWx0lKFsrGVzY2FwZVJlZ0V4cBLA3AAUl6FvAAADwJEIwJmhZAkAAsCRAsDCmKFpqHRvU3RyaW5nkgIOwACnZGVmYXVsdMDAmKFyCwjAwJEBwMKcoWkAGAEEkMDCAMLAwJehbwEABRGQwJihZwABBgyQwMKZoWQEGAcIkgcFwMKYoWyscmVSZWdFeHBDaGFykwcLEMDAwAXZTFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9lc2NhcGVSZWdFeHAuanOYoXIADMDAkQbAwpmhZAYACcCUCQUKBsDCmKFsr3JlSGFzUmVnRXhwQ2hhcpIJD8DAwAXZTFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9lc2NhcGVSZWdFeHAuanOYoXIAD8AKkQjAwpihZwMIC8CRC8DCmKFyBwzAwJEGwMKZoWQBFQ3Alg4PEA0IBsDCmKFsrGVzY2FwZVJlZ0V4cJINE8DAwMDZTFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9lc2NhcGVSZWdFeHAuanOYoXIJDMAOkQzAwpihchYIwA+RAcDCmKFyHQ/AEJEIwMKYoXIfDMDAkQbAwpihZwEDEsCQwMKYoWcJCxPAkRPAwpihcgAMwMCRDMDC
====catalogjs annotation end====*/