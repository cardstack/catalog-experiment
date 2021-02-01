import { default as baseIndexOf } from "./dist/123.js";
import { default as isArrayLike } from "./isArrayLike.js";
import { default as isString } from "./isString.js";
import { default as toInteger } from "./toInteger.js";
import { default as values } from "./values.js";
var nativeMax = Math.max;
function includes(collection, value, fromIndex, guard) {
  collection = isArrayLike(collection) ? collection : values(collection);
  fromIndex = fromIndex && !guard ? toInteger(fromIndex) : 0;
  var length = collection.length;

  if (fromIndex < 0) {
    fromIndex = nativeMax(length + fromIndex, 0);
  }

  return isString(collection) ? fromIndex <= length && collection.indexOf(value, fromIndex) > -1 : !!length && baseIndexOf(collection, value, fromIndex) > -1;
}
export { includes as default };
/*====catalogjs annotation start====
k5WVwq0uL2Rpc3QvMTIzLmpzA8LAlcKwLi9pc0FycmF5TGlrZS5qcwbCwJXCrS4vaXNTdHJpbmcuanMJwsCVwq4uL3RvSW50ZWdlci5qcwzCwJXCqy4vdmFsdWVzLmpzD8LAgadkZWZhdWx0lKFsqGluY2x1ZGVzHcDcAB+XoW8AAAPAkMCZoWQJAALAkQLAwpihaatiYXNlSW5kZXhPZpICG8AAp2RlZmF1bHTAwJihcgsLwMCRAcDCnKFpABgBBpDAwgDCwMCZoWQJAAXAkQXAwpihaatpc0FycmF5TGlrZZIFFsABp2RlZmF1bHTAwJihcgsLwMCRBMDCnKFpARsECZDAwgHCwMCZoWQJAAjAkQjAwpihaahpc1N0cmluZ5IIGsACp2RlZmF1bHTAwJihcgsIwMCRB8DCnKFpARgHDJDAwgLCwMCZoWQJAAvAkQvAwpihaal0b0ludGVnZXKSCxjAA6dkZWZhdWx0wMCYoXILCcDAkQrAwpyhaQEZCg+QwMIDwsDAmaFkCQAOwJEOwMKYoWmmdmFsdWVzkg4XwASnZGVmYXVsdMDAmKFyCwbAwJENwMKcoWkBFg0QkMDCBMLAwJehbwEAERyQwJihZwABEhSQwMKZoWQECxPAkhMRwMKYoWypbmF0aXZlTWF4khMZwMDAEdlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2luY2x1ZGVzLmpzmKFyAAnAwJESwMKZoWQBJhXAmBYXGBkaGxUSwMKYoWyoaW5jbHVkZXOSFR7AwMDA2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvaW5jbHVkZXMuanOYoXIJCMAWkRTAwpihcjcLwBeRBMDCmKFyHAbAGJENwMKYoXIyCcAZkQrAwpihclsJwBqREsDCmKFyJwjAG5EHwMKYoXJeC8DAkQHAwpihZwEDHcCQwMKYoWcJCx7AkR7AwpihcgAIwMCRFMDC
====catalogjs annotation end====*/