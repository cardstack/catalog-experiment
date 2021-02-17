import { default as arrayEach } from "./dist/119.js";
import { default as baseEach } from "./dist/75.js";
import { default as castFunction } from "./dist/108.js";
import { default as isArray } from "./isArray.js";
function forEach(collection, iteratee) {
  var func = isArray(collection) ? arrayEach : baseEach;
  return func(collection, castFunction(iteratee));
}
export { forEach as default };
/*====catalogjs annotation start====
k5SVwq0uL2Rpc3QvMTE5LmpzA8LAlcKsLi9kaXN0Lzc1LmpzB8LAlcKtLi9kaXN0LzEwOC5qcwvCwJXCrC4vaXNBcnJheS5qcw/CwIGnZGVmYXVsdJWhbKdmb3JFYWNoGcDA3AAbl6FvAAADwJDAmaFkCQACBJECwMKZoWmpYXJyYXlFYWNokgIVwACnZGVmYXVsdMDAwJihcgsJwMCRAcDCnKFpAAEBB5EEwMIAwsDAmKFnCA/AwJDAwpmhZAkABgiRBsDCmaFpqGJhc2VFYWNokgYWwAGnZGVmYXVsdMDAwJihcgsIwMCRBcDCnKFpAQEFC5EIwMIBwsDAmKFnCA7AwJDAwpmhZAkACgyRCsDCmaFprGNhc3RGdW5jdGlvbpIKF8ACp2RlZmF1bHTAwMCYoXILDMDAkQnAwpyhaQEBCQ+RDMDCAsLAwJihZwgPwMCQwMKZoWQJAA4QkQ7Awpmhaadpc0FycmF5kg4UwAOnZGVmYXVsdMDAwJihcgsHwMCRDcDCnKFpAQENEZEQwMIDwsDAmKFnCA7AwJDAwpehbwEAEhiQwJmhZAAOE8CVFBUWFxPAwpmhbKdmb3JFYWNokhMawMDAwJDZR1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9mb3JFYWNoLmpzmKFyCQfAFJESwMKYoXImB8AVkQ3Awpihcg8JwBaRAcDCmKFyAwjAF5EFwMKYoXIcDMDAkQnAwpihZwEDGcCQwMKYoWcJCxrAkRrAwpihcgAHwMCREsDC
====catalogjs annotation end====*/