import { default as arrayPush } from "./dist/139.js";
import { default as baseFlatten } from "./dist/85.js";
import { default as copyArray } from "./dist/117.js";
import { default as isArray } from "./isArray.js";
function concat() {
  var length = arguments.length;

  if (!length) {
    return [];
  }

  var args = Array(length - 1),
      array = arguments[0],
      index = length;

  while (index--) {
    args[index - 1] = arguments[index];
  }

  return arrayPush(isArray(array) ? copyArray(array) : [array], baseFlatten(args, 1));
}
export { concat as default };
/*====catalogjs annotation start====
k5SVwq0uL2Rpc3QvMTM5LmpzA8LAlcKsLi9kaXN0Lzg1LmpzBsLAlcKtLi9kaXN0LzExNy5qcwnCwJXCrC4vaXNBcnJheS5qcwzCwIGnZGVmYXVsdJShbKZjb25jYXQVwNwAF5ehbwAAA8CRDsCZoWQJAALAkQLAwpihaalhcnJheVB1c2iSAhDAAKdkZWZhdWx0wMCYoXILCcDAkQHAwpyhaQAYAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmrYmFzZUZsYXR0ZW6SBRPAAadkZWZhdWx0wMCYoXILC8DAkQTAwpyhaQEXBAmQwMIBwsDAmaFkCQAIwJEIwMKYoWmpY29weUFycmF5kggSwAKnZGVmYXVsdMDAmKFyCwnAwJEHwMKcoWkBGAcMkMDCAsLAwJmhZAkAC8CRC8DCmKFpp2lzQXJyYXmSCxHAA6dkZWZhdWx0wMCYoXILB8DAkQrAwpyhaQEXCg2QwMIDwsDAl6FvAQAOFJDAmaFkAA0PwJUQERITD8DCmKFspmNvbmNhdJIPFsDAwMDZRlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9jb25jYXQuanOYoXIJBsAQkQ7AwpihcszpCcARkQHAwpihcgEHwBKRCsDCmKFyCgnAE5EHwMKYoXITC8DAkQTAwpihZwEDFcCQwMKYoWcJCxbAkRbAwpihcgAGwMCRDsDC
====catalogjs annotation end====*/