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
k5qVwq0uL2Rpc3QvMTE5LmpzA8LAlcKtLi9kaXN0LzEwNi5qcwbCwJXCrC4vZGlzdC83Ny5qcwnCwJXCqy4vZGlzdC82LmpzDMLAlcKtLi9kaXN0LzEzNy5qcw/CwJXCrC4vaXNBcnJheS5qcxLCwJXCrS4vaXNCdWZmZXIuanMVwsCVwq8uL2lzRnVuY3Rpb24uanMYwsCVwq0uL2lzT2JqZWN0LmpzG8LAlcKxLi9pc1R5cGVkQXJyYXkuanMewsCBp2RlZmF1bHSUoWypdHJhbnNmb3JtLcDcAC+XoW8AAAPAkSDAmaFkCQACwJECwMKYoWmpYXJyYXlFYWNokgIqwACnZGVmYXVsdMDAmKFyCwnAwJEBwMKcoWkAGAEGkMDCAMLAwJmhZAkABcCRBcDCmKFpqmJhc2VDcmVhdGWSBSjAAadkZWZhdWx0wMCYoXILCsDAkQTAwpyhaQEYBAmQwMIBwsDAmaFkCQAIwJEIwMKYoWmqYmFzZUZvck93bpIIK8ACp2RlZmF1bHTAwJihcgsKwMCRB8DCnKFpARcHDJDAwgLCwMCZoWQJAAvAkQvAwpihaaxiYXNlSXRlcmF0ZWWSCyXAA6dkZWZhdWx0wMCYoXILDMDAkQrAwpyhaQEWCg+QwMIDwsDAmaFkCQAOwJEOwMKYoWmsZ2V0UHJvdG90eXBlkg4pwASnZGVmYXVsdMDAmKFyCwzAwJENwMKcoWkBGA0SkMDCBMLAwJmhZAkAEcCREcDCmKFpp2lzQXJyYXmSESLABadkZWZhdWx0wMCYoXILB8DAkRDAwpyhaQEXEBWQwMIFwsDAmaFkCQAUwJEUwMKYoWmoaXNCdWZmZXKSFCPABqdkZWZhdWx0wMCYoXILCMDAkRPAwpyhaQEYExiQwMIGwsDAmaFkCQAXwJEXwMKYoWmqaXNGdW5jdGlvbpIXJ8AHp2RlZmF1bHTAwJihcgsKwMCRFsDCnKFpARoWG5DAwgfCwMCZoWQJABrAkRrAwpihaahpc09iamVjdJIaJsAIp2RlZmF1bHTAwJihcgsIwMCRGcDCnKFpARgZHpDAwgjCwMCZoWQJAB3AkR3Awpihaaxpc1R5cGVkQXJyYXmSHSTACadkZWZhdWx0wMCYoXILDMDAkRzAwpyhaQEcHB+QwMIJwsDAl6FvAQAgLJDAmaFkAMyBIcCbIiMkJSYnKCkqKyHAwpihbKl0cmFuc2Zvcm2SIS7AwMDA2UlXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvdHJhbnNmb3JtLmpzmKFyCQnAIpEgwMKYoXIwB8AjkRDAwpihciUIwCSRE8DCmKFyDAzAJZEcwMKYoXIXDMAmkQrAwpihcsysCMAnkRnAwpihciAKwCiRFsDCmKFyCQrAKZEEwMKYoXIBDMAqkQ3Awpihck8JwCuRAcDCmKFyAwrAwJEHwMKYoWcBAy3AkMDCmKFnCQsuwJEuwMKYoXIACcDAkSDAwg==
====catalogjs annotation end====*/