import { default as baseSlice } from "./dist/142.js";
import { default as toInteger } from "./toInteger.js";
function takeRight(array, n, guard) {
  var length = array == null ? 0 : array.length;

  if (!length) {
    return [];
  }

  n = guard || n === undefined ? 1 : toInteger(n);
  n = length - n;
  return baseSlice(array, n < 0 ? 0 : n, length);
}
export { takeRight as default };
/*====catalogjs annotation start====
k5KVwq0uL2Rpc3QvMTQyLmpzA8LAlcKuLi90b0ludGVnZXIuanMGwsCBp2RlZmF1bHSUoWypdGFrZVJpZ2h0DcCfl6FvAAADwJEIwJmhZAkAAsCRAsDCmKFpqWJhc2VTbGljZZICC8AAp2RlZmF1bHTAwJihcgsJwMCRAcDCnKFpABgBBpDAwgDCwMCZoWQJAAXAkQXAwpihaal0b0ludGVnZXKSBQrAAadkZWZhdWx0wMCYoXILCcDAkQTAwpyhaQEZBAeQwMIBwsDAl6FvAQAIDJDAmaFkACEJwJMKCwnAwpihbKl0YWtlUmlnaHSSCQ7AwMDA2UlXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvdGFrZVJpZ2h0LmpzmKFyCQnACpEIwMKYoXLMkAnAC5EEwMKYoXIgCcDAkQHAwpihZwEDDcCQwMKYoWcJCw7AkQ7AwpihcgAJwMCRCMDC
====catalogjs annotation end====*/