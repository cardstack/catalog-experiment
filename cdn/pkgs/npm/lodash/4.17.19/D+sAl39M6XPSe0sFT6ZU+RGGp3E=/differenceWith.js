import { default as baseDifference } from "./dist/61.js";
import { default as baseFlatten } from "./dist/85.js";
import { default as baseRest } from "./dist/49.js";
import { default as isArrayLikeObject } from "./isArrayLikeObject.js";
import { default as last } from "./last.js";
var differenceWith = baseRest(function (array, values) {
  var comparator = last(values);

  if (isArrayLikeObject(comparator)) {
    comparator = undefined;
  }

  return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true), undefined, comparator) : [];
});
export { differenceWith as default };
/*====catalogjs annotation start====
k5WVwqwuL2Rpc3QvNjEuanMDwsCVwqwuL2Rpc3QvODUuanMHwsCVwqwuL2Rpc3QvNDkuanMLwsCVwrYuL2lzQXJyYXlMaWtlT2JqZWN0LmpzD8LAlcKpLi9sYXN0LmpzE8LAgadkZWZhdWx0laFsrmRpZmZlcmVuY2VXaXRoIsDA3AAkl6FvAAADwJEXwJmhZAkAAgSRAsDCmaFprmJhc2VEaWZmZXJlbmNlkgIewACnZGVmYXVsdMDAwJihcgsOwMCRAcDCnKFpAAEBB5EEwMIAwsDAmKFnCA7AwJDAwpmhZAkABgiRBsDCmaFpq2Jhc2VGbGF0dGVukgYfwAGnZGVmYXVsdMDAwJihcgsLwMCRBcDCnKFpAQEFC5EIwMIBwsDAmKFnCA7AwJDAwpmhZAkACgyRCsDCmaFpqGJhc2VSZXN0kgoawAKnZGVmYXVsdMDAwJihcgsIwMCRCcDCnKFpAQEJD5EMwMICwsDAmKFnCA7AwJDAwpmhZAkADhCRDsDCmaFpsWlzQXJyYXlMaWtlT2JqZWN0lA4cHSDAA6dkZWZhdWx0wMDAmKFyCxHAwJENwMKcoWkBAQ0TkRDAwgPCwMCYoWcIGMDAkMDCmaFkCQASFJESwMKZoWmkbGFzdJISG8AEp2RlZmF1bHTAwMCYoXILBMDAkRHAwpyhaQEBERWRFMDCBMLAwJihZwgLwMCQwMKXoW8BABYhkMCYoWcAARfAkMDCmaFkBAAYwJMYFhnAwpmhbK5kaWZmZXJlbmNlV2l0aJIYI8DAwBaQ2U5XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvZGlmZmVyZW5jZVdpdGguanOYoXIADsAZkRfAwpihZwMoGsCXGhscHR4fIMDCmKFyAAjAG5EJwMKYoXIvBMAckRHAwpihchERwB2RDcDCmKFyOhHAHpENwMKYoXIKDsAfkQHAwpihcggLwCCRBcDCmKFyDBHAwJENwMKYoWcBAyLAkMDCmKFnCQsjwJEjwMKYoXIADsDAkRfAwg==
====catalogjs annotation end====*/