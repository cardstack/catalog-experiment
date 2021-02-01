import { default as baseConformsTo } from "./dist/157.js";
import { default as keys } from "./keys.js";
import { default as baseClone } from "./dist/40.js";
function baseConforms(source) {
  var props = keys(source);
  return function (object) {
    return baseConformsTo(object, source, props);
  };
}
var CLONE_DEEP_FLAG = 1;
function conforms(source) {
  return baseConforms(baseClone(source, CLONE_DEEP_FLAG));
}
export { conforms as default };
/*====catalogjs annotation start====
k5OVwq0uL2Rpc3QvMTU3LmpzA8LAlcKpLi9rZXlzLmpzBsLAlcKsLi9kaXN0LzQwLmpzCcLAgadkZWZhdWx0lKFsqGNvbmZvcm1zGcDcABuXoW8AAAPAkMCZoWQJAALAkQLAwpihaa5iYXNlQ29uZm9ybXNUb5ICDsAAp2RlZmF1bHTAwJihcgsOwMCRAcDCnKFpABgBBpDAwgDCwMCZoWQJAAXAkQXAwpihaaRrZXlzkgUNwAGnZGVmYXVsdMDAmKFyCwTAwJEEwMKcoWkBFAQJkMDCAcLAwJmhZAkACMCRCMDCmKFpqWJhc2VDbG9uZZIIFsACp2RlZmF1bHTAwJihcgsJwMCRB8DCnKFpARcHCpDAwgLCwMCXoW8BAAsPkMCZoWQAHwzAkw0ODMDCmKFsrGJhc2VDb25mb3Jtc5IMFcDAwMDZTVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZUNvbmZvcm1zLmpzmKFyCQzADZELwMKYoXIZBMAOkQTAwpihcjIOwMCRAcDCl6FvAQAQGJDAmKFnAAERE5DAwpmhZAQEEsCSEhDAwpihbK9DTE9ORV9ERUVQX0ZMQUeSEhfAwMAQ2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvY29uZm9ybXMuanOYoXIAD8DAkRHAwpmhZAEFFMCVFRYXFBHAwpihbKhjb25mb3Jtc5IUGsDAwMDZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9jb25mb3Jtcy5qc5ihcgkIwBWRE8DCmKFyFAzAFpELwMKYoXIBCcAXkQfAwpihcgkPwMCREcDCmKFnAQMZwJDAwpihZwkLGsCRGsDCmKFyAAjAwJETwMI=
====catalogjs annotation end====*/