import { default as baseFindKey } from "./dist/164.js";
import { default as baseForOwn } from "./dist/77.js";
import { default as baseIteratee } from "./dist/6.js";
function findKey(object, predicate) {
  return baseFindKey(object, baseIteratee(predicate, 3), baseForOwn);
}
export { findKey as default };
/*====catalogjs annotation start====
k5OVwq0uL2Rpc3QvMTY0LmpzA8LAlcKsLi9kaXN0Lzc3LmpzBsLAlcKrLi9kaXN0LzYuanMJwsCBp2RlZmF1bHSVoWynZmluZEtleRHAwNwAE5ehbwAAA8CQwJmhZAkAAsCRAsDCmaFpq2Jhc2VGaW5kS2V5kgINwACnZGVmYXVsdMDAwJihcgsLwMCRAcDCnKFpABgBBpDAwgDCwMCZoWQJAAXAkQXAwpmhaapiYXNlRm9yT3dukgUPwAGnZGVmYXVsdMDAwJihcgsKwMCRBMDCnKFpARcECZDAwgHCwMCZoWQJAAjAkQjAwpmhaaxiYXNlSXRlcmF0ZWWSCA7AAqdkZWZhdWx0wMDAmKFyCwzAwJEHwMKcoWkBFgcKkMDCAsLAwJehbwEACxCQwJmhZAAEDMCUDQ4PDMDCmaFsp2ZpbmRLZXmSDBLAwMDAkNlHV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2ZpbmRLZXkuanOYoXIJB8ANkQvAwpihch8LwA6RAcDCmKFyCQzAD5EHwMKYoXIQCsDAkQTAwpihZwEDEcCQwMKYoWcJCxLAkRLAwpihcgAHwMCRC8DC
====catalogjs annotation end====*/