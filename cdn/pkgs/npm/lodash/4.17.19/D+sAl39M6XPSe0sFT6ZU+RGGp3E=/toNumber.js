import { default as isObject } from "./isObject.js";
import { default as isSymbol } from "./isSymbol.js";
var NAN = 0 / 0;
var reTrim = /^\s+|\s+$/g;
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
var reIsBinary = /^0b[01]+$/i;
var reIsOctal = /^0o[0-7]+$/i;
var freeParseInt = parseInt;
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }

  if (isSymbol(value)) {
    return NAN;
  }

  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? other + '' : other;
  }

  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }

  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
}
export { toNumber as default };
/*====catalogjs annotation start====
k5KVwq0uL2lzT2JqZWN0LmpzA8LAlcKtLi9pc1N5bWJvbC5qcwfCwIGnZGVmYXVsdJWhbKh0b051bWJlcinAwNwAK5ehbwAAA8CQwJmhZAkAAgSRAsDCmaFpqGlzT2JqZWN0kwIgIcAAp2RlZmF1bHTAwMCYoXILCMDAkQHAwpyhaQABAQeRBMDCAMLAwJihZwgPwMCQwMKZoWQJAAYIkQbAwpmhaahpc1N5bWJvbJIGHsABp2RlZmF1bHTAwMCYoXILCMDAkQXAwpyhaQEBBQmRCMDCAcLAwJihZwgPwMCQwMKXoW8BAAookMCYoWcAAQsNkMDCmaFkBAgMwJIMCsDCmaFso05BTpMMHyfAwMAKkNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3RvTnVtYmVyLmpzmKFyAAPAwJELwMKYoWcBAQ4QkMDCmaFkBA8PwJIPDcDCmaFspnJlVHJpbZIPIsDAwA2Q2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvdG9OdW1iZXIuanOYoXIABsDAkQ7AwpihZwEBEROQwMKZoWQEFxLAkhIQwMKZoWyqcmVJc0JhZEhleJISJsDAwBCQ2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvdG9OdW1iZXIuanOYoXIACsDAkRHAwpihZwEBFBaQwMKZoWQEDxXAkhUTwMKZoWyqcmVJc0JpbmFyeZIVI8DAwBOQ2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvdG9OdW1iZXIuanOYoXIACsDAkRTAwpihZwEBFxmQwMKZoWQEEBjAkhgWwMKZoWypcmVJc09jdGFskhgkwMDAFpDZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy90b051bWJlci5qc5ihcgAJwMCRF8DCmKFnAQEaHJDAwpmhZAQLG8CSGxnAwpmhbKxmcmVlUGFyc2VJbnSSGyXAwMAZkNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3RvTnVtYmVyLmpzmKFyAAzAwJEawMKZoWQBDB3A3AARHh8gISIjJCUmJx0LDhQXGhHAwpmhbKh0b051bWJlcpIdKsDAwMCQ2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvdG9OdW1iZXIuanOYoXIJCMAekRzAwpihckkIwB+RBcDCmKFyFgPAIJELwMKYoXINCMAhkQHAwpihcmUIwCKRAcDCmKFyzIsGwCORDsDCmKFyGArAJJEUwMKYoXIjCcAlkRfAwpihcg8MwCaRGsDCmKFyJQrAJ5ERwMKYoXIPA8DAkQvAwpihZwEDKcCQwMKYoWcJCyrAkSrAwpihcgAIwMCRHMDC
====catalogjs annotation end====*/