import { default as baseToString } from "./dist/22.js";
import { default as castSlice } from "./dist/140.js";
import { default as charsStartIndex } from "./dist/122.js";
import { default as stringToArray } from "./dist/143.js";
import { default as toString0 } from "./toString.js";
var reTrimStart = /^\s+/;
function trimStart(string, chars, guard) {
  string = toString0(string);

  if (string && (guard || chars === undefined)) {
    return string.replace(reTrimStart, '');
  }

  if (!string || !(chars = baseToString(chars))) {
    return string;
  }

  var strSymbols = stringToArray(string),
      start = charsStartIndex(strSymbols, stringToArray(chars));
  return castSlice(strSymbols, start).join('');
}
export { trimStart as default };
/*====catalogjs annotation start====
k5WVwqwuL2Rpc3QvMjIuanMDwsCVwq0uL2Rpc3QvMTQwLmpzB8LAlcKtLi9kaXN0LzEyMi5qcwvCwJXCrS4vZGlzdC8xNDMuanMPwsCVwq0uL3RvU3RyaW5nLmpzE8LAgadkZWZhdWx0laFsqXRyaW1TdGFydCPAwNwAJZehbwAAA8CQwJmhZAkAAgSRAsDCmaFprGJhc2VUb1N0cmluZ5ICHcAAp2RlZmF1bHTAwMCYoXILDMDAkQHAwpyhaQABAQeRBMDCAMLAwJihZwgOwMCQwMKZoWQJAAYIkQbAwpmhaaljYXN0U2xpY2WSBiHAAadkZWZhdWx0wMDAmKFyCwnAwJEFwMKcoWkBAQULkQjAwgHCwMCYoWcID8DAkMDCmaFkCQAKDJEKwMKZoWmvY2hhcnNTdGFydEluZGV4kgofwAKnZGVmYXVsdMDAwJihcgsPwMCRCcDCnKFpAQEJD5EMwMICwsDAmKFnCA/AwJDAwpmhZAkADhCRDsDCmaFprXN0cmluZ1RvQXJyYXmTDh4gwAOnZGVmYXVsdMDAwJihcgsNwMCRDcDCnKFpAQENE5EQwMIDwsDAmKFnCA/AwJDAwpmhZAkAEhSREsDCmaFpqXRvU3RyaW5nMJISG8AEp2RlZmF1bHTAwMCYoXILCcDAkRHAwpyhaQEBERWRFMDCBMLAwJihZwgPwMCQwMKXoW8BABYikMCYoWcAARcZkMDCmaFkBAkYwJIYFsDCmaFsq3JlVHJpbVN0YXJ0khgcwMDAFpDZSVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy90cmltU3RhcnQuanOYoXIAC8DAkRfAwpmhZAEfGsCZGxwdHh8gIRoXwMKZoWypdHJpbVN0YXJ0khokwMDAwJDZSVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy90cmltU3RhcnQuanOYoXIJCcAbkRnAwpihciQJwByREcDCmKFyVwvAHZEXwMKYoXInDMAekQHAwpihcjcNwB+RDcDCmKFyGA/AIJEJwMKYoXINDcAhkQ3AwpihchMJwMCRBcDCmKFnAQMjwJDAwpihZwkLJMCRJMDCmKFyAAnAwJEZwMI=
====catalogjs annotation end====*/