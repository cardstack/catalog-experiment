import { default as arrayEach } from "./dist/119.js";
import { default as baseCreate } from "./dist/106.js";
import { default as baseForOwn } from "./dist/77.js";
import { default as baseIteratee } from "./dist/6.js";
import { default as getPrototype } from "./dist/137.js";
import { default as isArray } from "./isArray.js";
import { default as isBuffer } from "./isBuffer.js";
import { default as isFunction } from "./isFunction.js";
import { default as isObject } from "./isObject.js";
import { default as isTypedArray } from "./isTypedArray.js";
function transform(object, iteratee, accumulator) {
  var isArr = isArray(object),
      isArrLike = isArr || isBuffer(object) || isTypedArray(object);
  iteratee = baseIteratee(iteratee, 4);

  if (accumulator == null) {
    var Ctor = object && object.constructor;

    if (isArrLike) {
      accumulator = isArr ? new Ctor() : [];
    } else if (isObject(object)) {
      accumulator = isFunction(Ctor) ? baseCreate(getPrototype(object)) : {};
    } else {
      accumulator = {};
    }
  }

  (isArrLike ? arrayEach : baseForOwn)(object, function (value, index, object) {
    return iteratee(accumulator, value, index, object);
  });
  return accumulator;
}
export { transform as default };
/*====catalogjs annotation start====
k5qVwq0uL2Rpc3QvMTE5LmpzA8LAlcKtLi9kaXN0LzEwNi5qcwfCwJXCrC4vZGlzdC83Ny5qcwvCwJXCqy4vZGlzdC82LmpzD8LAlcKtLi9kaXN0LzEzNy5qcxPCwJXCrC4vaXNBcnJheS5qcxfCwJXCrS4vaXNCdWZmZXIuanMbwsCVwq8uL2lzRnVuY3Rpb24uanMfwsCVwq0uL2lzT2JqZWN0LmpzI8LAlcKxLi9pc1R5cGVkQXJyYXkuanMnwsCBp2RlZmF1bHSVoWypdHJhbnNmb3JtN8DA3AA5l6FvAAADwJDAmaFkCQACBJECwMKZoWmpYXJyYXlFYWNokgI0wACnZGVmYXVsdMDAwJihcgsJwMCRAcDCnKFpAAEBB5EEwMIAwsDAmKFnCA/AwJDAwpmhZAkABgiRBsDCmaFpqmJhc2VDcmVhdGWSBjLAAadkZWZhdWx0wMDAmKFyCwrAwJEFwMKcoWkBAQULkQjAwgHCwMCYoWcID8DAkMDCmaFkCQAKDJEKwMKZoWmqYmFzZUZvck93bpIKNcACp2RlZmF1bHTAwMCYoXILCsDAkQnAwpyhaQEBCQ+RDMDCAsLAwJihZwgOwMCQwMKZoWQJAA4QkQ7AwpmhaaxiYXNlSXRlcmF0ZWWSDi/AA6dkZWZhdWx0wMDAmKFyCwzAwJENwMKcoWkBAQ0TkRDAwgPCwMCYoWcIDcDAkMDCmaFkCQASFJESwMKZoWmsZ2V0UHJvdG90eXBlkhIzwASnZGVmYXVsdMDAwJihcgsMwMCREcDCnKFpAQERF5EUwMIEwsDAmKFnCA/AwJDAwpmhZAkAFhiRFsDCmaFpp2lzQXJyYXmSFizABadkZWZhdWx0wMDAmKFyCwfAwJEVwMKcoWkBARUbkRjAwgXCwMCYoWcIDsDAkMDCmaFkCQAaHJEawMKZoWmoaXNCdWZmZXKSGi3ABqdkZWZhdWx0wMDAmKFyCwjAwJEZwMKcoWkBARkfkRzAwgbCwMCYoWcID8DAkMDCmaFkCQAeIJEewMKZoWmqaXNGdW5jdGlvbpIeMcAHp2RlZmF1bHTAwMCYoXILCsDAkR3AwpyhaQEBHSORIMDCB8LAwJihZwgRwMCQwMKZoWQJACIkkSLAwpmhaahpc09iamVjdJIiMMAIp2RlZmF1bHTAwMCYoXILCMDAkSHAwpyhaQEBISeRJMDCCMLAwJihZwgPwMCQwMKZoWQJACYokSbAwpmhaaxpc1R5cGVkQXJyYXmSJi7ACadkZWZhdWx0wMDAmKFyCwzAwJElwMKcoWkBASUpkSjAwgnCwMCYoWcIE8DAkMDCl6FvAQAqNpDAmaFkAMyBK8CbLC0uLzAxMjM0NSvAwpmhbKl0cmFuc2Zvcm2SKzjAwMDAkNlJV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3RyYW5zZm9ybS5qc5ihcgkJwCyRKsDCmKFyMAfALZEVwMKYoXIlCMAukRnAwpihcgwMwC+RJcDCmKFyFwzAMJENwMKYoXLMrAjAMZEhwMKYoXIgCsAykR3AwpihcgkKwDORBcDCmKFyAQzANJERwMKYoXJPCcA1kQHAwpihcgMKwMCRCcDCmKFnAQM3wJDAwpihZwkLOMCROMDCmKFyAAnAwJEqwMI=
====catalogjs annotation end====*/