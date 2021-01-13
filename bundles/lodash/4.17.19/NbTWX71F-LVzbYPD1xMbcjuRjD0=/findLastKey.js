import { default as baseFindKey } from "./dist/164.js";
import { default as baseForOwnRight } from "./dist/79.js";
import { default as baseIteratee } from "./dist/6.js";
function findLastKey(object, predicate) {
  return baseFindKey(object, baseIteratee(predicate, 3), baseForOwnRight);
}
export { findLastKey as default };
/*====catalogjs annotation start====
k5OVwq0uL2Rpc3QvMTY0LmpzA8LAlcKsLi9kaXN0Lzc5LmpzBsLAlcKrLi9kaXN0LzYuanMJwsCBp2RlZmF1bHSUoWyrZmluZExhc3RLZXkRwNwAE5ehbwAAA8CRC8CZoWQJAALAkQLAwpihaatiYXNlRmluZEtleZICDcAAp2RlZmF1bHTAwJihcgsLwMCRAcDCnKFpABgBBpDAwgDCwMCZoWQJAAXAkQXAwpihaa9iYXNlRm9yT3duUmlnaHSSBQ/AAadkZWZhdWx0wMCYoXILD8DAkQTAwpyhaQEXBAmQwMIBwsDAmaFkCQAIwJEIwMKYoWmsYmFzZUl0ZXJhdGVlkggOwAKnZGVmYXVsdMDAmKFyCwzAwJEHwMKcoWkBFgcKkMDCAsLAwJehbwEACxCQwJmhZAAEDMCUDQ4PDMDCmKFsq2ZpbmRMYXN0S2V5kgwSwMDAwNlLV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2ZpbmRMYXN0S2V5LmpzmKFyCQvADZELwMKYoXIfC8AOkQHAwpihcgkMwA+RB8DCmKFyEA/AwJEEwMKYoWcBAxHAkMDCmKFnCQsSwJESwMKYoXIAC8DAkQvAwg==
====catalogjs annotation end====*/