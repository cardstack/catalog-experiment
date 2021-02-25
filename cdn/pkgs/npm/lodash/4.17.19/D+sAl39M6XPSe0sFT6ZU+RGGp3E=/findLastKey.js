import { default as baseFindKey } from "./dist/164.js";
import { default as baseForOwnRight } from "./dist/79.js";
import { default as baseIteratee } from "./dist/6.js";
function findLastKey(object, predicate) {
  return baseFindKey(object, baseIteratee(predicate, 3), baseForOwnRight);
}
export { findLastKey as default };
/*====catalogjs annotation start====
k5OVwq0uL2Rpc3QvMTY0LmpzA8LAlcKsLi9kaXN0Lzc5LmpzB8LAlcKrLi9kaXN0LzYuanMLwsCBp2RlZmF1bHSVoWyrZmluZExhc3RLZXkUwMDcABaXoW8AAAPAkMCZoWQJAAIEkQLAwpmhaatiYXNlRmluZEtleZICEMAAp2RlZmF1bHTAwMCYoXILC8DAkQHAwpyhaQABAQeRBMDCAMLAwJihZwgPwMCQwMKZoWQJAAYIkQbAwpmhaa9iYXNlRm9yT3duUmlnaHSSBhLAAadkZWZhdWx0wMDAmKFyCw/AwJEFwMKcoWkBAQULkQjAwgHCwMCYoWcIDsDAkMDCmaFkCQAKDJEKwMKZoWmsYmFzZUl0ZXJhdGVlkgoRwAKnZGVmYXVsdMDAwJihcgsMwMCRCcDCnKFpAQEJDZEMwMICwsDAmKFnCA3AwJDAwpehbwEADhOQwJmhZAAED8CUEBESD8DCmaFsq2ZpbmRMYXN0S2V5kg8VwMDAwJDZS1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9maW5kTGFzdEtleS5qc5ihcgkLwBCRDsDCmKFyHwvAEZEBwMKYoXIJDMASkQnAwpihchAPwMCRBcDCmKFnAQMUwJDAwpihZwkLFcCRFcDCmKFyAAvAwJEOwMI=
====catalogjs annotation end====*/