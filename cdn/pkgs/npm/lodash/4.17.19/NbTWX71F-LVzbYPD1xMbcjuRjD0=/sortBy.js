import { default as baseFlatten } from "./dist/85.js";
import { default as baseOrderBy } from "./dist/4.js";
import { default as baseRest } from "./dist/49.js";
import { default as isIterateeCall } from "./dist/70.js";
var sortBy = baseRest(function (collection, iteratees) {
  if (collection == null) {
    return [];
  }

  var length = iteratees.length;

  if (length > 1 && isIterateeCall(collection, iteratees[0], iteratees[1])) {
    iteratees = [];
  } else if (length > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) {
    iteratees = [iteratees[0]];
  }

  return baseOrderBy(collection, baseFlatten(iteratees, 1), []);
});
export { sortBy as default };
/*====catalogjs annotation start====
k5SVwqwuL2Rpc3QvODUuanMDwsCVwqsuL2Rpc3QvNC5qcwbCwJXCrC4vZGlzdC80OS5qcwnCwJXCrC4vZGlzdC83MC5qcwzCwIGnZGVmYXVsdJWhbKZzb3J0QnkYwMDcABqXoW8AAAPAkQ/AmaFkCQACwJECwMKZoWmrYmFzZUZsYXR0ZW6SAhbAAKdkZWZhdWx0wMDAmKFyCwvAwJEBwMKcoWkAFwEGkMDCAMLAwJmhZAkABcCRBcDCmaFpq2Jhc2VPcmRlckJ5kgUVwAGnZGVmYXVsdMDAwJihcgsLwMCRBMDCnKFpARYECZDAwgHCwMCZoWQJAAjAkQjAwpmhaahiYXNlUmVzdJIIEsACp2RlZmF1bHTAwMCYoXILCMDAkQfAwpyhaQEXBwyQwMICwsDAmaFkCQALwJELwMKZoWmuaXNJdGVyYXRlZUNhbGyTCxMUwAOnZGVmYXVsdMDAwJihcgsOwMCRCsDCnKFpARcKDZDAwgPCwMCXoW8BAA4XkMCYoWcAAQ/AkMDCmaFkBAAQwJMQDhHAwpmhbKZzb3J0QnmSEBnAwMAOkNlGV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3NvcnRCeS5qc5ihcgAGwBGRD8DCmKFnAxcSwJUSExQVFsDCmKFyAAjAE5EHwMKYoXLMig7AFJEKwMKYoXJbDsAVkQrAwpihclwLwBaRBMDCmKFyDQvAwJEBwMKYoWcBAxjAkMDCmKFnCQsZwJEZwMKYoXIABsDAkQ/Awg==
====catalogjs annotation end====*/