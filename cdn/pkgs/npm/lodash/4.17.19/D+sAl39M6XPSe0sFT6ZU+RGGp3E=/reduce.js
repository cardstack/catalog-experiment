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
k5WVwq0uL2Rpc3QvMTQ2LmpzA8LAlcKsLi9kaXN0Lzc1LmpzB8LAlcKrLi9kaXN0LzYuanMLwsCVwq0uL2Rpc3QvMTcyLmpzD8LAlcKsLi9pc0FycmF5LmpzE8LAgadkZWZhdWx0laFspnJlZHVjZR7AwNwAIJehbwAAA8CQwJmhZAkAAgSRAsDCmaFpq2FycmF5UmVkdWNlkgIZwACnZGVmYXVsdMDAwJihcgsLwMCRAcDCnKFpAAEBB5EEwMIAwsDAmKFnCA/AwJDAwpmhZAkABgiRBsDCmaFpqGJhc2VFYWNokgYcwAGnZGVmYXVsdMDAwJihcgsIwMCRBcDCnKFpAQEFC5EIwMIBwsDAmKFnCA7AwJDAwpmhZAkACgyRCsDCmaFprGJhc2VJdGVyYXRlZZIKG8ACp2RlZmF1bHTAwMCYoXILDMDAkQnAwpyhaQEBCQ+RDMDCAsLAwJihZwgNwMCQwMKZoWQJAA4QkQ7AwpmhaapiYXNlUmVkdWNlkg4awAOnZGVmYXVsdMDAwJihcgsKwMCRDcDCnKFpAQENE5EQwMIDwsDAmKFnCA/AwJDAwpmhZAkAEhSREsDCmaFpp2lzQXJyYXmSEhjABKdkZWZhdWx0wMDAmKFyCwfAwJERwMKcoWkBAREVkRTAwgTCwMCYoWcIDsDAkMDCl6FvAQAWHZDAmaFkAAQXwJYYGRobHBfAwpmhbKZyZWR1Y2WSFx/AwMDAkNlGV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3JlZHVjZS5qc5ihcgkGwBiRFsDCmKFyMwfAGZERwMKYoXIPC8AakQHAwpihcgMKwBuRDcDCmKFyRAzAHJEJwMKYoXInCMDAkQXAwpihZwEDHsCQwMKYoWcJCx/AkR/AwpihcgAGwMCRFsDC
====catalogjs annotation end====*/