import { default as baseFindKey } from "./dist/164.js";
import { default as baseForOwn } from "./dist/77.js";
import { default as baseIteratee } from "./dist/6.js";
function findKey(object, predicate) {
  return baseFindKey(object, baseIteratee(predicate, 3), baseForOwn);
}
export { findKey as default };
/*====catalogjs annotation start====
k5OVwq0uL2Rpc3QvMTY0LmpzA8LAlcKsLi9kaXN0Lzc3LmpzBsLAlcKrLi9kaXN0LzYuanMJwsCBp2RlZmF1bHSUoWynZmluZEtleRHA3AATl6FvAAADwJELwJmhZAkAAsCRAsDCmKFpq2Jhc2VGaW5kS2V5kgINwACnZGVmYXVsdMDAmKFyCwvAwJEBwMKcoWkAGAEGkMDCAMLAwJmhZAkABcCRBcDCmKFpqmJhc2VGb3JPd26SBQ/AAadkZWZhdWx0wMCYoXILCsDAkQTAwpyhaQEXBAmQwMIBwsDAmaFkCQAIwJEIwMKYoWmsYmFzZUl0ZXJhdGVlkggOwAKnZGVmYXVsdMDAmKFyCwzAwJEHwMKcoWkBFgcKkMDCAsLAwJehbwEACxCQwJmhZAAEDMCUDQ4PDMDCmKFsp2ZpbmRLZXmSDBLAwMDA2UdXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvZmluZEtleS5qc5ihcgkHwA2RC8DCmKFyHwvADpEBwMKYoXIJDMAPkQfAwpihchAKwMCRBMDCmKFnAQMRwJDAwpihZwkLEsCREsDCmKFyAAfAwJELwMI=
====catalogjs annotation end====*/