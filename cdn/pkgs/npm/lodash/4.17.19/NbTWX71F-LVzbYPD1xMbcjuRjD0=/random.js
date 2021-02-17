import { default as baseRandom } from "./dist/171.js";
import { default as isIterateeCall } from "./dist/70.js";
import { default as toFinite } from "./toFinite.js";
var freeParseFloat = parseFloat;
var nativeMin = Math.min,
    nativeRandom = Math.random;
function random(lower, upper, floating) {
  if (floating && typeof floating != 'boolean' && isIterateeCall(lower, upper, floating)) {
    upper = floating = undefined;
  }

  if (floating === undefined) {
    if (typeof upper == 'boolean') {
      floating = upper;
      upper = undefined;
    } else if (typeof lower == 'boolean') {
      floating = lower;
      lower = undefined;
    }
  }

  if (lower === undefined && upper === undefined) {
    lower = 0;
    upper = 1;
  } else {
    lower = toFinite(lower);

    if (upper === undefined) {
      upper = lower;
      lower = 0;
    } else {
      upper = toFinite(upper);
    }
  }

  if (lower > upper) {
    var temp = lower;
    lower = upper;
    upper = temp;
  }

  if (floating || lower % 1 || upper % 1) {
    var rand = nativeRandom();
    return nativeMin(lower + rand * (upper - lower + freeParseFloat('1e-' + ((rand + '').length - 1))), upper);
  }

  return baseRandom(lower, upper);
}
export { random as default };
/*====catalogjs annotation start====
k5OVwq0uL2Rpc3QvMTcxLmpzA8LAlcKsLi9kaXN0LzcwLmpzB8LAlcKtLi90b0Zpbml0ZS5qcwvCwIGnZGVmYXVsdJWhbKZyYW5kb20gwMDcACKXoW8AAAPAkMCZoWQJAAIEkQLAwpmhaapiYXNlUmFuZG9tkgIewACnZGVmYXVsdMDAwJihcgsKwMCRAcDCnKFpAAEBB5EEwMIAwsDAmKFnCA/AwJDAwpmhZAkABgiRBsDCmaFprmlzSXRlcmF0ZWVDYWxskgYYwAGnZGVmYXVsdMDAwJihcgsOwMCRBcDCnKFpAQEFC5EIwMIBwsDAmKFnCA7AwJDAwpmhZAkACgyRCsDCmaFpqHRvRmluaXRlkwoZGsACp2RlZmF1bHTAwMCYoXILCMDAkQnAwpyhaQEBCQ2RDMDCAsLAwJihZwgPwMCQwMKXoW8BAA4fkMCYoWcAAQ8RkMDCmaFkBA0QwJIQDsDCmaFsrmZyZWVQYXJzZUZsb2F0khAdwMDADpDZRlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9yYW5kb20uanOYoXIADsDAkQ/AwpihZwEBEhaQwMKZoWQECxMUkhMRwMKZoWypbmF0aXZlTWlukhMcwMDAEZDZRlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9yYW5kb20uanOYoXIACcDAkRLAwpmhZAYOFcCSFRHAwpmhbKxuYXRpdmVSYW5kb22SFRvAwMARkNlGV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3JhbmRvbS5qc5ihcgAMwMCRFMDCmaFkAREXwJsYGRobHB0eFxQSD8DCmaFspnJhbmRvbZIXIcDAwMCQ2UZXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvcmFuZG9tLmpzmKFyCQbAGJEWwMKYoXJNDsAZkQXAwpihcs0BigjAGpEJwMKYoXJqCMAbkQnAwpihcsymDMAckRTAwpihcg8JwB2REsDCmKFyIQ7AHpEPwMKYoXI7CsDAkQHAwpihZwEDIMCQwMKYoWcJCyHAkSHAwpihcgAGwMCRFsDC
====catalogjs annotation end====*/