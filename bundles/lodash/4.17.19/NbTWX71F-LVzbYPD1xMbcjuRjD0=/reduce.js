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
k5WVwq0uL2Rpc3QvMTQ2LmpzA8LAlcKsLi9kaXN0Lzc1LmpzBsLAlcKrLi9kaXN0LzYuanMJwsCVwq0uL2Rpc3QvMTcyLmpzDMLAlcKsLi9pc0FycmF5LmpzD8LAgadkZWZhdWx0lKFspnJlZHVjZRnA3AAbl6FvAAADwJERwJmhZAkAAsCRAsDCmKFpq2FycmF5UmVkdWNlkgIUwACnZGVmYXVsdMDAmKFyCwvAwJEBwMKcoWkAGAEGkMDCAMLAwJmhZAkABcCRBcDCmKFpqGJhc2VFYWNokgUXwAGnZGVmYXVsdMDAmKFyCwjAwJEEwMKcoWkBFwQJkMDCAcLAwJmhZAkACMCRCMDCmKFprGJhc2VJdGVyYXRlZZIIFsACp2RlZmF1bHTAwJihcgsMwMCRB8DCnKFpARYHDJDAwgLCwMCZoWQJAAvAkQvAwpihaapiYXNlUmVkdWNlkgsVwAOnZGVmYXVsdMDAmKFyCwrAwJEKwMKcoWkBGAoPkMDCA8LAwJmhZAkADsCRDsDCmKFpp2lzQXJyYXmSDhPABKdkZWZhdWx0wMCYoXILB8DAkQ3AwpyhaQEXDRCQwMIEwsDAl6FvAQARGJDAmaFkAAQSwJYTFBUWFxLAwpihbKZyZWR1Y2WSEhrAwMDA2UZXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvcmVkdWNlLmpzmKFyCQbAE5ERwMKYoXIzB8AUkQ3Awpihcg8LwBWRAcDCmKFyAwrAFpEKwMKYoXJEDMAXkQfAwpihcicIwMCRBMDCmKFnAQMZwJDAwpihZwkLGsCRGsDCmKFyAAbAwJERwMI=
====catalogjs annotation end====*/