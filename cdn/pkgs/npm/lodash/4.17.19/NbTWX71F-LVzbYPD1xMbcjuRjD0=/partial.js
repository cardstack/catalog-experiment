import { default as baseRest } from "./dist/49.js";
import { default as createWrap } from "./dist/23.js";
import { default as getHolder } from "./dist/126.js";
import { default as replaceHolders } from "./dist/129.js";
var WRAP_PARTIAL_FLAG = 32;
var partial = baseRest(function (func, partials) {
  var holders = replaceHolders(partials, getHolder(partial));
  return createWrap(func, WRAP_PARTIAL_FLAG, undefined, partials, holders);
});
partial.placeholder = {};
export { partial as default };
/*====catalogjs annotation start====
k5SVwqwuL2Rpc3QvNDkuanMDwsCVwqwuL2Rpc3QvMjMuanMHwsCVwq0uL2Rpc3QvMTI2LmpzC8LAlcKtLi9kaXN0LzEyOS5qcw/CwIGnZGVmYXVsdJWhbKdwYXJ0aWFsIsDA3AAkl6FvAAADwJEfwJmhZAkAAgSRAsDCmaFpqGJhc2VSZXN0kgIZwACnZGVmYXVsdMDAwJihcgsIwMCRAcDCnKFpAAEBB5EEwMIAwsDAmKFnCA7AwJDAwpmhZAkABgiRBsDCmaFpqmNyZWF0ZVdyYXCSBh3AAadkZWZhdWx0wMDAmKFyCwrAwJEFwMKcoWkBAQULkQjAwgHCwMCYoWcIDsDAkMDCmaFkCQAKDJEKwMKZoWmpZ2V0SG9sZGVykgobwAKnZGVmYXVsdMDAwJihcgsJwMCRCcDCnKFpAQEJD5EMwMICwsDAmKFnCA/AwJDAwpmhZAkADhCRDsDCmaFprnJlcGxhY2VIb2xkZXJzkg4awAOnZGVmYXVsdMDAwJihcgsOwMCRDcDCnKFpAQENEZEQwMIDwsDAmKFnCA/AwJDAwpehbwEAEiGQwJihZwABExWQwMKZoWQEBRTAkhQSwMKZoWyxV1JBUF9QQVJUSUFMX0ZMQUeSFB7AwMASkNlHV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3BhcnRpYWwuanOYoXIAEcDAkRPAwpihZwEBFh+QwMKZoWQEABfAlBcVGBPAwpmhbKdwYXJ0aWFslBccICPAwMAVkR/ZR1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9wYXJ0aWFsLmpzmKFyAAfAGJEWwMKYoWcDIxnAlhkaGxwdHsDCmKFyAAjAGpEBwMKYoXItDsAbkQ3AwpihcgsJwByRCcDCmKFyAQfAHZEWwMKYoXINCsAekQXAwpihcgcRwMCRE8DCmKFnARIgwJEgwMOYoXIAB8DAkRbAwpihZwEDIsCQwMKYoWcJCyPAkSPAwpihcgAHwMCRFsDC
====catalogjs annotation end====*/