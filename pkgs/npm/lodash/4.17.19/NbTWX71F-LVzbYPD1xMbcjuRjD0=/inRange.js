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
k5KVwq0uL3RvRmluaXRlLmpzA8LAlcKtLi90b051bWJlci5qcwbCwIGnZGVmYXVsdJShbKdpblJhbmdlGcDcABuXoW8AAAPAkMCZoWQJAALAkQLAwpihaah0b0Zpbml0ZZMCFBXAAKdkZWZhdWx0wMCYoXILCMDAkQHAwpyhaQAYAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmodG9OdW1iZXKSBRbAAadkZWZhdWx0wMCYoXILCMDAkQTAwpyhaQEYBAeQwMIBwsDAl6FvAQAIEZDAmKFnAAEJDZDAwpmhZAQLCguSCgjAwpihbKluYXRpdmVNYXiSChDAwMAI2UxXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VJblJhbmdlLmpzmKFyAAnAwJEJwMKZoWQGCwzAkgwIwMKYoWypbmF0aXZlTWlukgwPwMDACNlMV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlSW5SYW5nZS5qc5ihcgAJwMCRC8DCmaFkAQ8OwJUPEA4LCcDCmKFsq2Jhc2VJblJhbmdlkg4XwMDAwNlMV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlSW5SYW5nZS5qc5ihcgkLwA+RDcDCmKFyKgnAEJELwMKYoXIZCcDAkQnAwpehbwEAEhiQwJmhZAAXE8CVFBUWFxPAwpihbKdpblJhbmdlkhMawMDAwNlHV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2luUmFuZ2UuanOYoXIJB8AUkRLAwpihciEIwBWRAcDCmKFyWgjAFpEBwMKYoXIXCMAXkQTAwpihchMLwMCRDcDCmKFnAQMZwJDAwpihZwkLGsCRGsDCmKFyAAfAwJESwMI=
====catalogjs annotation end====*/