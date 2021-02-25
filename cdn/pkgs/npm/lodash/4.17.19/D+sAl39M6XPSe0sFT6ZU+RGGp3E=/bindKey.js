import { default as baseRest } from "./dist/49.js";
import { default as createWrap } from "./dist/23.js";
import { default as getHolder } from "./dist/126.js";
import { default as replaceHolders } from "./dist/129.js";
var WRAP_BIND_FLAG = 1,
    WRAP_BIND_KEY_FLAG = 2,
    WRAP_PARTIAL_FLAG = 32;
var bindKey = baseRest(function (object, key, partials) {
  var bitmask = WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG;

  if (partials.length) {
    var holders = replaceHolders(partials, getHolder(bindKey));
    bitmask |= WRAP_PARTIAL_FLAG;
  }

  return createWrap(key, bitmask, object, partials, holders);
});
bindKey.placeholder = {};
export { bindKey as default };
/*====catalogjs annotation start====
k5SVwqwuL2Rpc3QvNDkuanMDwsCVwqwuL2Rpc3QvMjMuanMHwsCVwq0uL2Rpc3QvMTI2LmpzC8LAlcKtLi9kaXN0LzEyOS5qcw/CwIGnZGVmYXVsdJWhbKdiaW5kS2V5KMDA3AAql6FvAAADwJElwJmhZAkAAgSRAsDCmaFpqGJhc2VSZXN0kgIdwACnZGVmYXVsdMDAwJihcgsIwMCRAcDCnKFpAAEBB5EEwMIAwsDAmKFnCA7AwJDAwpmhZAkABgiRBsDCmaFpqmNyZWF0ZVdyYXCSBiTAAadkZWZhdWx0wMDAmKFyCwrAwJEFwMKcoWkBAQULkQjAwgHCwMCYoWcIDsDAkMDCmaFkCQAKDJEKwMKZoWmpZ2V0SG9sZGVykgohwAKnZGVmYXVsdMDAwJihcgsJwMCRCcDCnKFpAQEJD5EMwMICwsDAmKFnCA/AwJDAwpmhZAkADhCRDsDCmaFprnJlcGxhY2VIb2xkZXJzkg4gwAOnZGVmYXVsdMDAwJihcgsOwMCRDcDCnKFpAQENEZEQwMIDwsDAmKFnCA/AwJDAwpehbwEAEieQwJihZwABExmQwMKZoWQEBBQVkhQSwMKZoWyuV1JBUF9CSU5EX0ZMQUeSFB7AwMASkNlHV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2JpbmRLZXkuanOYoXIADsDAkRPAwpmhZAYEFheSFhLAwpmhbLJXUkFQX0JJTkRfS0VZX0ZMQUeSFh/AwMASkNlHV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2JpbmRLZXkuanOYoXIAEsDAkRXAwpmhZAYFGMCSGBLAwpmhbLFXUkFQX1BBUlRJQUxfRkxBR5IYI8DAwBKQ2UdXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvYmluZEtleS5qc5ihcgARwMCRF8DCmKFnAQEaJZDAwpmhZAQAG8CWGxkcExUXwMKZoWynYmluZEtleZQbIiYpwMDAGZEl2UdXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvYmluZEtleS5qc5ihcgAHwByRGsDCmKFnAy0dwJgdHh8gISIjJMDCmKFyAAjAHpEBwMKYoXI0DsAfkRPAwpihcgMSwCCRFcDCmKFyLg7AIZENwMKYoXILCcAikQnAwpihcgEHwCORGsDCmKFyExHAJJEXwMKYoXIQCsDAkQXAwpihZwESJsCRJsDDmKFyAAfAwJEawMKYoWcBAyjAkMDCmKFnCQspwJEpwMKYoXIAB8DAkRrAwg==
====catalogjs annotation end====*/