import { default as baseRest } from "./dist/49.js";
import { default as createWrap } from "./dist/23.js";
import { default as getHolder } from "./dist/126.js";
import { default as replaceHolders } from "./dist/129.js";
var WRAP_BIND_FLAG = 1,
    WRAP_PARTIAL_FLAG = 32;
var bind = baseRest(function (func, thisArg, partials) {
  var bitmask = WRAP_BIND_FLAG;

  if (partials.length) {
    var holders = replaceHolders(partials, getHolder(bind));
    bitmask |= WRAP_PARTIAL_FLAG;
  }

  return createWrap(func, bitmask, thisArg, partials, holders);
});
bind.placeholder = {};
export { bind as default };
/*====catalogjs annotation start====
k5SVwqwuL2Rpc3QvNDkuanMDwsCVwqwuL2Rpc3QvMjMuanMHwsCVwq0uL2Rpc3QvMTI2LmpzC8LAlcKtLi9kaXN0LzEyOS5qcw/CwIGnZGVmYXVsdJWhbKRiaW5kJcDA3AAnl6FvAAADwJEiwJmhZAkAAgSRAsDCmaFpqGJhc2VSZXN0kgIbwACnZGVmYXVsdMDAwJihcgsIwMCRAcDCnKFpAAEBB5EEwMIAwsDAmKFnCA7AwJDAwpmhZAkABgiRBsDCmaFpqmNyZWF0ZVdyYXCSBiHAAadkZWZhdWx0wMDAmKFyCwrAwJEFwMKcoWkBAQULkQjAwgHCwMCYoWcIDsDAkMDCmaFkCQAKDJEKwMKZoWmpZ2V0SG9sZGVykgoewAKnZGVmYXVsdMDAwJihcgsJwMCRCcDCnKFpAQEJD5EMwMICwsDAmKFnCA/AwJDAwpmhZAkADhCRDsDCmaFprnJlcGxhY2VIb2xkZXJzkg4dwAOnZGVmYXVsdMDAwJihcgsOwMCRDcDCnKFpAQENEZEQwMIDwsDAmKFnCA/AwJDAwpehbwEAEiSQwJihZwABExeQwMKZoWQEBBQVkhQSwMKZoWyuV1JBUF9CSU5EX0ZMQUeSFBzAwMASkNlEV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2JpbmQuanOYoXIADsDAkRPAwpmhZAYFFsCSFhLAwpmhbLFXUkFQX1BBUlRJQUxfRkxBR5IWIMDAwBKQ2URXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvYmluZC5qc5ihcgARwMCRFcDCmKFnAQEYIpDAwpmhZAQAGcCVGRcaExXAwpmhbKRiaW5klBkfIybAwMAXkSLZRFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9iaW5kLmpzmKFyAATAGpEYwMKYoWcDLxvAlxscHR4fICHAwpihcgAIwByRAcDCmKFyNg7AHZETwMKYoXIuDsAekQ3AwpihcgsJwB+RCcDCmKFyAQTAIJEYwMKYoXITEcAhkRXAwpihchAKwMCRBcDCmKFnARIjwJEjwMOYoXIABMDAkRjAwpihZwEDJcCQwMKYoWcJCybAkSbAwpihcgAEwMCRGMDC
====catalogjs annotation end====*/