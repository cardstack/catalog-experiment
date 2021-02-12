import { default as arrayReduce } from "./dist/146.js";
import { default as baseEach } from "./dist/75.js";
import { default as baseIteratee } from "./dist/6.js";
import { default as baseReduce } from "./dist/172.js";
import { default as isArray } from "./isArray.js";
function reduce(collection, iteratee, accumulator) {
  var func = isArray(collection) ? arrayReduce : baseReduce,
      initAccum = arguments.length < 3;
  return func(collection, baseIteratee(iteratee, 4), accumulator, initAccum, baseEach);
}
export { reduce as default };
/*====catalogjs annotation start====
k5WVwq0uL2Rpc3QvMTQ2LmpzA8LAlcKsLi9kaXN0Lzc1LmpzBsLAlcKrLi9kaXN0LzYuanMJwsCVwq0uL2Rpc3QvMTcyLmpzDMLAlcKsLi9pc0FycmF5LmpzD8LAgadkZWZhdWx0laFspnJlZHVjZRnAwNwAG5ehbwAAA8CQwJmhZAkAAsCRAsDCmaFpq2FycmF5UmVkdWNlkgIUwACnZGVmYXVsdMDAwJihcgsLwMCRAcDCnKFpABgBBpDAwgDCwMCZoWQJAAXAkQXAwpmhaahiYXNlRWFjaJIFF8ABp2RlZmF1bHTAwMCYoXILCMDAkQTAwpyhaQEXBAmQwMIBwsDAmaFkCQAIwJEIwMKZoWmsYmFzZUl0ZXJhdGVlkggWwAKnZGVmYXVsdMDAwJihcgsMwMCRB8DCnKFpARYHDJDAwgLCwMCZoWQJAAvAkQvAwpmhaapiYXNlUmVkdWNlkgsVwAOnZGVmYXVsdMDAwJihcgsKwMCRCsDCnKFpARgKD5DAwgPCwMCZoWQJAA7AkQ7Awpmhaadpc0FycmF5kg4TwASnZGVmYXVsdMDAwJihcgsHwMCRDcDCnKFpARcNEJDAwgTCwMCXoW8BABEYkMCZoWQABBLAlhMUFRYXEsDCmaFspnJlZHVjZZISGsDAwMCQ2UZXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvcmVkdWNlLmpzmKFyCQbAE5ERwMKYoXIzB8AUkQ3Awpihcg8LwBWRAcDCmKFyAwrAFpEKwMKYoXJEDMAXkQfAwpihcicIwMCRBMDCmKFnAQMZwJDAwpihZwkLGsCRGsDCmKFyAAbAwJERwMI=
====catalogjs annotation end====*/