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
k5OVwq0uL2Rpc3QvMTcxLmpzA8LAlcKsLi9kaXN0LzcwLmpzBsLAlcKtLi90b0Zpbml0ZS5qcwnCwIGnZGVmYXVsdJWhbKZyYW5kb20dwMDcAB+XoW8AAAPAkMCZoWQJAALAkQLAwpmhaapiYXNlUmFuZG9tkgIbwACnZGVmYXVsdMDAwJihcgsKwMCRAcDCnKFpABgBBpDAwgDCwMCZoWQJAAXAkQXAwpmhaa5pc0l0ZXJhdGVlQ2FsbJIFFcABp2RlZmF1bHTAwMCYoXILDsDAkQTAwpyhaQEXBAmQwMIBwsDAmaFkCQAIwJEIwMKZoWmodG9GaW5pdGWTCBYXwAKnZGVmYXVsdMDAwJihcgsIwMCRB8DCnKFpARgHCpDAwgLCwMCXoW8BAAsckMCYoWcAAQwOkMDCmaFkBA0NwJINC8DCmaFsrmZyZWVQYXJzZUZsb2F0kg0awMDAC5DZRlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9yYW5kb20uanOYoXIADsDAkQzAwpihZwEBDxOQwMKZoWQECxARkhAOwMKZoWypbmF0aXZlTWlukhAZwMDADpDZRlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9yYW5kb20uanOYoXIACcDAkQ/AwpmhZAYOEsCSEg7AwpmhbKxuYXRpdmVSYW5kb22SEhjAwMAOkNlGV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3JhbmRvbS5qc5ihcgAMwMCREcDCmaFkAREUwJsVFhcYGRobFBEPDMDCmaFspnJhbmRvbZIUHsDAwMCQ2UZXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvcmFuZG9tLmpzmKFyCQbAFZETwMKYoXJNDsAWkQTAwpihcs0BigjAF5EHwMKYoXJqCMAYkQfAwpihcsymDMAZkRHAwpihcg8JwBqRD8DCmKFyIQ7AG5EMwMKYoXI7CsDAkQHAwpihZwEDHcCQwMKYoWcJCx7AkR7AwpihcgAGwMCRE8DC
====catalogjs annotation end====*/