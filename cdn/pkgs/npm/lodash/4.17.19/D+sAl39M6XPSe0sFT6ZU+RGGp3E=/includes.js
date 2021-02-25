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
k5WVwq0uL2Rpc3QvMTIzLmpzA8LAlcKwLi9pc0FycmF5TGlrZS5qcwfCwJXCrS4vaXNTdHJpbmcuanMLwsCVwq4uL3RvSW50ZWdlci5qcw/CwJXCqy4vdmFsdWVzLmpzE8LAgadkZWZhdWx0laFsqGluY2x1ZGVzIsDA3AAkl6FvAAADwJDAmaFkCQACBJECwMKZoWmrYmFzZUluZGV4T2aSAiDAAKdkZWZhdWx0wMDAmKFyCwvAwJEBwMKcoWkAAQEHkQTAwgDCwMCYoWcID8DAkMDCmaFkCQAGCJEGwMKZoWmraXNBcnJheUxpa2WSBhvAAadkZWZhdWx0wMDAmKFyCwvAwJEFwMKcoWkBAQULkQjAwgHCwMCYoWcIEsDAkMDCmaFkCQAKDJEKwMKZoWmoaXNTdHJpbmeSCh/AAqdkZWZhdWx0wMDAmKFyCwjAwJEJwMKcoWkBAQkPkQzAwgLCwMCYoWcID8DAkMDCmaFkCQAOEJEOwMKZoWmpdG9JbnRlZ2Vykg4dwAOnZGVmYXVsdMDAwJihcgsJwMCRDcDCnKFpAQENE5EQwMIDwsDAmKFnCBDAwJDAwpmhZAkAEhSREsDCmaFppnZhbHVlc5ISHMAEp2RlZmF1bHTAwMCYoXILBsDAkRHAwpyhaQEBERWRFMDCBMLAwJihZwgNwMCQwMKXoW8BABYhkMCYoWcAARcZkMDCmaFkBAsYwJIYFsDCmaFsqW5hdGl2ZU1heJIYHsDAwBaQ2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvaW5jbHVkZXMuanOYoXIACcDAkRfAwpmhZAEmGsCYGxwdHh8gGhfAwpmhbKhpbmNsdWRlc5IaI8DAwMCQ2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvaW5jbHVkZXMuanOYoXIJCMAbkRnAwpihcjcLwByRBcDCmKFyHAbAHZERwMKYoXIyCcAekQ3AwpihclsJwB+RF8DCmKFyJwjAIJEJwMKYoXJeC8DAkQHAwpihZwEDIsCQwMKYoWcJCyPAkSPAwpihcgAIwMCRGcDC
====catalogjs annotation end====*/