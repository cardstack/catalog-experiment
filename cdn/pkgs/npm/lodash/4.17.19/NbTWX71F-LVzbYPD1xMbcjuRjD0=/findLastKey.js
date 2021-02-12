import { default as baseFindKey } from "./dist/164.js";
import { default as baseForOwnRight } from "./dist/79.js";
import { default as baseIteratee } from "./dist/6.js";
function findLastKey(object, predicate) {
  return baseFindKey(object, baseIteratee(predicate, 3), baseForOwnRight);
}
export { findLastKey as default };
/*====catalogjs annotation start====
k5OVwq0uL2Rpc3QvMTY0LmpzA8LAlcKsLi9kaXN0Lzc5LmpzBsLAlcKrLi9kaXN0LzYuanMJwsCBp2RlZmF1bHSVoWyrZmluZExhc3RLZXkRwMDcABOXoW8AAAPAkMCZoWQJAALAkQLAwpmhaatiYXNlRmluZEtleZICDcAAp2RlZmF1bHTAwMCYoXILC8DAkQHAwpyhaQAYAQaQwMIAwsDAmaFkCQAFwJEFwMKZoWmvYmFzZUZvck93blJpZ2h0kgUPwAGnZGVmYXVsdMDAwJihcgsPwMCRBMDCnKFpARcECZDAwgHCwMCZoWQJAAjAkQjAwpmhaaxiYXNlSXRlcmF0ZWWSCA7AAqdkZWZhdWx0wMDAmKFyCwzAwJEHwMKcoWkBFgcKkMDCAsLAwJehbwEACxCQwJmhZAAEDMCUDQ4PDMDCmaFsq2ZpbmRMYXN0S2V5kgwSwMDAwJDZS1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9maW5kTGFzdEtleS5qc5ihcgkLwA2RC8DCmKFyHwvADpEBwMKYoXIJDMAPkQfAwpihchAPwMCRBMDCmKFnAQMRwJDAwpihZwkLEsCREsDCmKFyAAvAwJELwMI=
====catalogjs annotation end====*/