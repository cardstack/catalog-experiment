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
k5OVwq0uL2Rpc3QvMTU3LmpzA8LAlcKpLi9rZXlzLmpzBsLAlcKsLi9kaXN0LzQwLmpzCcLAgadkZWZhdWx0lKFsqGNvbmZvcm1zGcDcABuXoW8AAAPAkgsTwJmhZAkAAsCRAsDCmKFprmJhc2VDb25mb3Jtc1RvkgIOwACnZGVmYXVsdMDAmKFyCw7AwJEBwMKcoWkAGAEGkMDCAMLAwJmhZAkABcCRBcDCmKFppGtleXOSBQ3AAadkZWZhdWx0wMCYoXILBMDAkQTAwpyhaQEUBAmQwMIBwsDAmaFkCQAIwJEIwMKYoWmpYmFzZUNsb25lkggWwAKnZGVmYXVsdMDAmKFyCwnAwJEHwMKcoWkBFwcKkMDCAsLAwJehbwEACw+QwJmhZAAfDMCTDQ4MwMKYoWysYmFzZUNvbmZvcm1zkgwVwMDAwNlNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlQ29uZm9ybXMuanOYoXIJDMANkQvAwpihchkEwA6RBMDCmKFyMg7AwJEBwMKXoW8BABAYkMCYoWcAARETkMDCmaFkBAQSwJISEMDCmKFsr0NMT05FX0RFRVBfRkxBR5ISF8DAwBDZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9jb25mb3Jtcy5qc5ihcgAPwMCREcDCmaFkAQUUwJUVFhcUEcDCmKFsqGNvbmZvcm1zkhQawMDAwNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2NvbmZvcm1zLmpzmKFyCQjAFZETwMKYoXIUDMAWkQvAwpihcgEJwBeRB8DCmKFyCQ/AwJERwMKYoWcBAxnAkMDCmKFnCQsawJEawMKYoXIACMDAkRPAwg==
====catalogjs annotation end====*/