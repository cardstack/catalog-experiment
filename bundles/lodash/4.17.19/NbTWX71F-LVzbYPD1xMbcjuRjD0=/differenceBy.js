import { default as baseDifference } from "./dist/61.js";
import { default as baseFlatten } from "./dist/85.js";
import { default as baseIteratee } from "./dist/6.js";
import { default as baseRest } from "./dist/49.js";
import { default as isArrayLikeObject } from "./isArrayLikeObject.js";
import { default as last } from "./last.js";
var differenceBy = baseRest(function (array, values) {
  var iteratee = last(values);

  if (isArrayLikeObject(iteratee)) {
    iteratee = undefined;
  }

  return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true), baseIteratee(iteratee, 2)) : [];
});
export { differenceBy as default };
/*====catalogjs annotation start====
k5aVwqwuL2Rpc3QvNjEuanMDwsCVwqwuL2Rpc3QvODUuanMGwsCVwqsuL2Rpc3QvNi5qcwnCwJXCrC4vZGlzdC80OS5qcwzCwJXCti4vaXNBcnJheUxpa2VPYmplY3QuanMPwsCVwqkuL2xhc3QuanMSwsCBp2RlZmF1bHSUoWysZGlmZmVyZW5jZUJ5IcDcACOXoW8AAAPAkRXAmaFkCQACwJECwMKYoWmuYmFzZURpZmZlcmVuY2WSAhzAAKdkZWZhdWx0wMCYoXILDsDAkQHAwpyhaQAXAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmrYmFzZUZsYXR0ZW6SBR3AAadkZWZhdWx0wMCYoXILC8DAkQTAwpyhaQEXBAmQwMIBwsDAmaFkCQAIwJEIwMKYoWmsYmFzZUl0ZXJhdGVlkggfwAKnZGVmYXVsdMDAmKFyCwzAwJEHwMKcoWkBFgcMkMDCAsLAwJmhZAkAC8CRC8DCmKFpqGJhc2VSZXN0kgsYwAOnZGVmYXVsdMDAmKFyCwjAwJEKwMKcoWkBFwoPkMDCA8LAwJmhZAkADsCRDsDCmKFpsWlzQXJyYXlMaWtlT2JqZWN0lA4aGx7ABKdkZWZhdWx0wMCYoXILEcDAkQ3AwpyhaQEhDRKQwMIEwsDAmaFkCQARwJERwMKYoWmkbGFzdJIRGcAFp2RlZmF1bHTAwJihcgsEwMCREMDCnKFpARQQE5DAwgXCwMCXoW8BABQgkMCYoWcAARXAkMDCmaFkBAAWwJMWFBfAwpihbKxkaWZmZXJlbmNlQnmSFiLAwMAU2UxXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvZGlmZmVyZW5jZUJ5LmpzmKFyAAzAF5EVwMKYoWcDFxjAmRgZGhscHR4fFcDCmKFyAAjAGZEKwMKYoXItBMAakRDAwpihchERwBuRDcDCmKFyNhHAHJENwMKYoXIKDsAdkQHAwpihcggLwB6RBMDCmKFyDBHAH5ENwMKYoXIJDMDAkQfAwpihZwEDIcCQwMKYoWcJCyLAkSLAwpihcgAMwMCRFcDC
====catalogjs annotation end====*/