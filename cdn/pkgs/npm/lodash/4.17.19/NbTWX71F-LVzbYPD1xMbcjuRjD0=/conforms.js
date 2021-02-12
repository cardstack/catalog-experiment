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
k5OVwq0uL2Rpc3QvMTU3LmpzA8LAlcKpLi9rZXlzLmpzBsLAlcKsLi9kaXN0LzQwLmpzCcLAgadkZWZhdWx0laFsqGNvbmZvcm1zGcDA3AAbl6FvAAADwJDAmaFkCQACwJECwMKZoWmuYmFzZUNvbmZvcm1zVG+SAg7AAKdkZWZhdWx0wMDAmKFyCw7AwJEBwMKcoWkAGAEGkMDCAMLAwJmhZAkABcCRBcDCmaFppGtleXOSBQ3AAadkZWZhdWx0wMDAmKFyCwTAwJEEwMKcoWkBFAQJkMDCAcLAwJmhZAkACMCRCMDCmaFpqWJhc2VDbG9uZZIIFsACp2RlZmF1bHTAwMCYoXILCcDAkQfAwpyhaQEXBwqQwMICwsDAl6FvAQALD5DAmaFkAB8MwJMNDgzAwpmhbKxiYXNlQ29uZm9ybXOSDBXAwMDAkNlNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlQ29uZm9ybXMuanOYoXIJDMANkQvAwpihchkEwA6RBMDCmKFyMg7AwJEBwMKXoW8BABAYkMCYoWcAARETkMDCmaFkBAQSwJISEMDCmaFsr0NMT05FX0RFRVBfRkxBR5ISF8DAwBCQ2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvY29uZm9ybXMuanOYoXIAD8DAkRHAwpmhZAEFFMCVFRYXFBHAwpmhbKhjb25mb3Jtc5IUGsDAwMCQ2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvY29uZm9ybXMuanOYoXIJCMAVkRPAwpihchQMwBaRC8DCmKFyAQnAF5EHwMKYoXIJD8DAkRHAwpihZwEDGcCQwMKYoWcJCxrAkRrAwpihcgAIwMCRE8DC
====catalogjs annotation end====*/