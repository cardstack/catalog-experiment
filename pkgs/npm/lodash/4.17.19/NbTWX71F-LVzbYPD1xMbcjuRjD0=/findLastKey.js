import { default as baseFindKey } from "./dist/164.js";
import { default as baseForOwnRight } from "./dist/79.js";
import { default as baseIteratee } from "./dist/6.js";
function findLastKey(object, predicate) {
  return baseFindKey(object, baseIteratee(predicate, 3), baseForOwnRight);
}
export { findLastKey as default };
/*====catalogjs annotation start====
k5OVwq0uL2Rpc3QvMTY0LmpzA8LAlcKsLi9kaXN0Lzc5LmpzBsLAlcKrLi9kaXN0LzYuanMJwsCBp2RlZmF1bHSUoWyrZmluZExhc3RLZXkRwNwAE5ehbwAAA8CQwJmhZAkAAsCRAsDCmKFpq2Jhc2VGaW5kS2V5kgINwACnZGVmYXVsdMDAmKFyCwvAwJEBwMKcoWkAGAEGkMDCAMLAwJmhZAkABcCRBcDCmKFpr2Jhc2VGb3JPd25SaWdodJIFD8ABp2RlZmF1bHTAwJihcgsPwMCRBMDCnKFpARcECZDAwgHCwMCZoWQJAAjAkQjAwpihaaxiYXNlSXRlcmF0ZWWSCA7AAqdkZWZhdWx0wMCYoXILDMDAkQfAwpyhaQEWBwqQwMICwsDAl6FvAQALEJDAmaFkAAQMwJQNDg8MwMKYoWyrZmluZExhc3RLZXmSDBLAwMDA2UtXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvZmluZExhc3RLZXkuanOYoXIJC8ANkQvAwpihch8LwA6RAcDCmKFyCQzAD5EHwMKYoXIQD8DAkQTAwpihZwEDEcCQwMKYoWcJCxLAkRLAwpihcgALwMCRC8DC
====catalogjs annotation end====*/