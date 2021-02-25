import { default as toFinite } from "./toFinite.js";
import { default as toNumber } from "./toNumber.js";
var nativeMax = Math.max,
    nativeMin = Math.min;
function baseInRange(number, start, end) {
  return number >= nativeMin(start, end) && number < nativeMax(start, end);
}
function inRange(number, start, end) {
  start = toFinite(start);

  if (end === undefined) {
    end = start;
    start = 0;
  } else {
    end = toFinite(end);
  }

  number = toNumber(number);
  return baseInRange(number, start, end);
}
export { inRange as default };
/*====catalogjs annotation start====
k5KVwq0uL3RvRmluaXRlLmpzA8LAlcKtLi90b051bWJlci5qcwfCwIGnZGVmYXVsdJWhbKdpblJhbmdlG8DA3AAdl6FvAAADwJDAmaFkCQACBJECwMKZoWmodG9GaW5pdGWTAhYXwACnZGVmYXVsdMDAwJihcgsIwMCRAcDCnKFpAAEBB5EEwMIAwsDAmKFnCA/AwJDAwpmhZAkABgiRBsDCmaFpqHRvTnVtYmVykgYYwAGnZGVmYXVsdMDAwJihcgsIwMCRBcDCnKFpAQEFCZEIwMIBwsDAmKFnCA/AwJDAwpehbwEAChOQwJihZwABCw+QwMKZoWQECwwNkgwKwMKZoWypbmF0aXZlTWF4kgwSwMDACpDZTFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZUluUmFuZ2UuanOYoXIACcDAkQvAwpmhZAYLDsCSDgrAwpmhbKluYXRpdmVNaW6SDhHAwMAKkNlMV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlSW5SYW5nZS5qc5ihcgAJwMCRDcDCmaFkAQ8QwJUREhANC8DCmaFsq2Jhc2VJblJhbmdlkhAZwMDAwJDZTFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZUluUmFuZ2UuanOYoXIJC8ARkQ/AwpihcioJwBKRDcDCmKFyGQnAwJELwMKXoW8BABQakMCZoWQAFxXAlRYXGBkVwMKZoWynaW5SYW5nZZIVHMDAwMCQ2UdXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvaW5SYW5nZS5qc5ihcgkHwBaRFMDCmKFyIQjAF5EBwMKYoXJaCMAYkQHAwpihchcIwBmRBcDCmKFyEwvAwJEPwMKYoWcBAxvAkMDCmKFnCQscwJEcwMKYoXIAB8DAkRTAwg==
====catalogjs annotation end====*/