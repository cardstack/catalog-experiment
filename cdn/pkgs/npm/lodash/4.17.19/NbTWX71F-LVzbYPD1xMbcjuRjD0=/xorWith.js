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
k5WVwq0uL2Rpc3QvMTUwLmpzA8LAlcKsLi9kaXN0LzQ5LmpzB8LAlcKsLi9kaXN0LzYwLmpzC8LAlcK2Li9pc0FycmF5TGlrZU9iamVjdC5qcw/CwJXCqS4vbGFzdC5qcxPCwIGnZGVmYXVsdJWhbKd4b3JXaXRoIMDA3AAil6FvAAADwJEXwJmhZAkAAgSRAsDCmaFpq2FycmF5RmlsdGVykgIdwACnZGVmYXVsdMDAwJihcgsLwMCRAcDCnKFpAAEBB5EEwMIAwsDAmKFnCA/AwJDAwpmhZAkABgiRBsDCmaFpqGJhc2VSZXN0kgYawAGnZGVmYXVsdMDAwJihcgsIwMCRBcDCnKFpAQEFC5EIwMIBwsDAmKFnCA7AwJDAwpmhZAkACgyRCsDCmaFpp2Jhc2VYb3KSChzAAqdkZWZhdWx0wMDAmKFyCwfAwJEJwMKcoWkBAQkPkQzAwgLCwMCYoWcIDsDAkMDCmaFkCQAOEJEOwMKZoWmxaXNBcnJheUxpa2VPYmplY3SSDh7AA6dkZWZhdWx0wMDAmKFyCxHAwJENwMKcoWkBAQ0TkRDAwgPCwMCYoWcIGMDAkMDCmaFkCQASFJESwMKZoWmkbGFzdJISG8AEp2RlZmF1bHTAwMCYoXILBMDAkRHAwpyhaQEBERWRFMDCBMLAwJihZwgLwMCQwMKXoW8BABYfkMCYoWcAARfAkMDCmaFkBAAYwJMYFhnAwpmhbKd4b3JXaXRokhghwMDAFpDZR1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy94b3JXaXRoLmpzmKFyAAfAGZEXwMKYoWcDHRrAlRobHB0ewMKYoXIACMAbkQXAwpihcigEwByREcDCmKFyXAfAHZEJwMKYoXIBC8AekQHAwpihcgkRwMCRDcDCmKFnAQMgwJDAwpihZwkLIcCRIcDCmKFyAAfAwJEXwMI=
====catalogjs annotation end====*/