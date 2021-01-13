import { default as toString } from "./toString.js";
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g,
    reHasRegExpChar = RegExp(reRegExpChar.source);
function escapeRegExp(string) {
  string = toString(string);
  return string && reHasRegExpChar.test(string) ? string.replace(reRegExpChar, '\\$&') : string;
}
export { escapeRegExp as default };
/*====catalogjs annotation start====
k5GVwq0uL3RvU3RyaW5nLmpzA8LAgadkZWZhdWx0lKFsrGVzY2FwZVJlZ0V4cBLA3AAUl6FvAAADwJIMCMCZoWQJAALAkQLAwpihaah0b1N0cmluZ5ICDsAAp2RlZmF1bHTAwJihcgsIwMCRAcDCnKFpABgBBJDAwgDCwMCXoW8BAAURkMCYoWcAAQYMkMDCmaFkBBgHCJIHBcDCmKFsrHJlUmVnRXhwQ2hhcpMHCxDAwMAF2UxXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvZXNjYXBlUmVnRXhwLmpzmKFyAAzAwJEGwMKZoWQGAAnAlAkFCgbAwpihbK9yZUhhc1JlZ0V4cENoYXKSCQ/AwMAF2UxXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvZXNjYXBlUmVnRXhwLmpzmKFyAA/ACpEIwMKYoWcDCAvAkgsIwMKYoXIHDMDAkQbAwpmhZAEVDcCWDg8QDQgGwMKYoWysZXNjYXBlUmVnRXhwkg0TwMDAwNlMV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2VzY2FwZVJlZ0V4cC5qc5ihcgkMwA6RDMDCmKFyFgjAD5EBwMKYoXIdD8AQkQjAwpihch8MwMCRBsDCmKFnAQMSwJDAwpihZwkLE8CRE8DCmKFyAAzAwJEMwMI=
====catalogjs annotation end====*/