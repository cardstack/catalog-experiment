import { default as arrayFilter } from "./dist/150.js";
import { default as baseRest } from "./dist/49.js";
import { default as baseXor } from "./dist/60.js";
import { default as isArrayLikeObject } from "./isArrayLikeObject.js";
import { default as last } from "./last.js";
var xorWith = baseRest(function (arrays) {
  var comparator = last(arrays);
  comparator = typeof comparator == 'function' ? comparator : undefined;
  return baseXor(arrayFilter(arrays, isArrayLikeObject), undefined, comparator);
});
export { xorWith as default };
/*====catalogjs annotation start====
k5WVwq0uL2Rpc3QvMTUwLmpzA8LAlcKsLi9kaXN0LzQ5LmpzBsLAlcKsLi9kaXN0LzYwLmpzCcLAlcK2Li9pc0FycmF5TGlrZU9iamVjdC5qcwzCwJXCqS4vbGFzdC5qcw/CwIGnZGVmYXVsdJWhbKd4b3JXaXRoG8DA3AAdl6FvAAADwJESwJmhZAkAAsCRAsDCmaFpq2FycmF5RmlsdGVykgIYwACnZGVmYXVsdMDAwJihcgsLwMCRAcDCnKFpABgBBpDAwgDCwMCZoWQJAAXAkQXAwpmhaahiYXNlUmVzdJIFFcABp2RlZmF1bHTAwMCYoXILCMDAkQTAwpyhaQEXBAmQwMIBwsDAmaFkCQAIwJEIwMKZoWmnYmFzZVhvcpIIF8ACp2RlZmF1bHTAwMCYoXILB8DAkQfAwpyhaQEXBwyQwMICwsDAmaFkCQALwJELwMKZoWmxaXNBcnJheUxpa2VPYmplY3SSCxnAA6dkZWZhdWx0wMDAmKFyCxHAwJEKwMKcoWkBIQoPkMDCA8LAwJmhZAkADsCRDsDCmaFppGxhc3SSDhbABKdkZWZhdWx0wMDAmKFyCwTAwJENwMKcoWkBFA0QkMDCBMLAwJehbwEAERqQwJihZwABEsCQwMKZoWQEABPAkxMRFMDCmaFsp3hvcldpdGiSExzAwMARkNlHV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3hvcldpdGguanOYoXIAB8AUkRLAwpihZwMdFcCVFRYXGBnAwpihcgAIwBaRBMDCmKFyKATAF5ENwMKYoXJcB8AYkQfAwpihcgELwBmRAcDCmKFyCRHAwJEKwMKYoWcBAxvAkMDCmKFnCQscwJEcwMKYoXIAB8DAkRLAwg==
====catalogjs annotation end====*/