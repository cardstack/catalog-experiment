import { default as baseIndexOf } from "./dist/123.js";
import { default as toInteger } from "./toInteger.js";
var nativeMax = Math.max;
function indexOf(array, value, fromIndex) {
  var length = array == null ? 0 : array.length;

  if (!length) {
    return -1;
  }

  var index = fromIndex == null ? 0 : toInteger(fromIndex);

  if (index < 0) {
    index = nativeMax(length + index, 0);
  }

  return baseIndexOf(array, value, index);
}
export { indexOf as default };
/*====catalogjs annotation start====
k5KVwq0uL2Rpc3QvMTIzLmpzA8LAlcKuLi90b0ludGVnZXIuanMHwsCBp2RlZmF1bHSVoWynaW5kZXhPZhPAwNwAFZehbwAAA8CQwJmhZAkAAgSRAsDCmaFpq2Jhc2VJbmRleE9mkgIRwACnZGVmYXVsdMDAwJihcgsLwMCRAcDCnKFpAAEBB5EEwMIAwsDAmKFnCA/AwJDAwpmhZAkABgiRBsDCmaFpqXRvSW50ZWdlcpIGD8ABp2RlZmF1bHTAwMCYoXILCcDAkQXAwpyhaQEBBQmRCMDCAcLAwJihZwgQwMCQwMKXoW8BAAoSkMCYoWcAAQsNkMDCmaFkBAsMwJIMCsDCmaFsqW5hdGl2ZU1heJIMEMDAwAqQ2UdXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvaW5kZXhPZi5qc5ihcgAJwMCRC8DCmaFkARgOwJUPEBEOC8DCmaFsp2luZGV4T2aSDhTAwMDAkNlHV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2luZGV4T2YuanOYoXIJB8APkQ3AwpihcsyZCcAQkQXAwpihci0JwBGRC8DCmKFyIwvAwJEBwMKYoWcBAxPAkMDCmKFnCQsUwJEUwMKYoXIAB8DAkQ3Awg==
====catalogjs annotation end====*/