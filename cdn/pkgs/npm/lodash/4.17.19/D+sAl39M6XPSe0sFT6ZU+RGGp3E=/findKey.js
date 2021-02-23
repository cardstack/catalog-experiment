import { default as baseFindKey } from "./dist/164.js";
import { default as baseForOwn } from "./dist/77.js";
import { default as baseIteratee } from "./dist/6.js";
function findKey(object, predicate) {
  return baseFindKey(object, baseIteratee(predicate, 3), baseForOwn);
}
export { findKey as default };
/*====catalogjs annotation start====
k5OVwq0uL2Rpc3QvMTY0LmpzA8LAlcKsLi9kaXN0Lzc3LmpzB8LAlcKrLi9kaXN0LzYuanMLwsCBp2RlZmF1bHSVoWynZmluZEtleRTAwNwAFpehbwAAA8CQwJmhZAkAAgSRAsDCmaFpq2Jhc2VGaW5kS2V5kgIQwACnZGVmYXVsdMDAwJihcgsLwMCRAcDCnKFpAAEBB5EEwMIAwsDAmKFnCA/AwJDAwpmhZAkABgiRBsDCmaFpqmJhc2VGb3JPd26SBhLAAadkZWZhdWx0wMDAmKFyCwrAwJEFwMKcoWkBAQULkQjAwgHCwMCYoWcIDsDAkMDCmaFkCQAKDJEKwMKZoWmsYmFzZUl0ZXJhdGVlkgoRwAKnZGVmYXVsdMDAwJihcgsMwMCRCcDCnKFpAQEJDZEMwMICwsDAmKFnCA3AwJDAwpehbwEADhOQwJmhZAAED8CUEBESD8DCmaFsp2ZpbmRLZXmSDxXAwMDAkNlHV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2ZpbmRLZXkuanOYoXIJB8AQkQ7Awpihch8LwBGRAcDCmKFyCQzAEpEJwMKYoXIQCsDAkQXAwpihZwEDFMCQwMKYoWcJCxXAkRXAwpihcgAHwMCRDsDC
====catalogjs annotation end====*/