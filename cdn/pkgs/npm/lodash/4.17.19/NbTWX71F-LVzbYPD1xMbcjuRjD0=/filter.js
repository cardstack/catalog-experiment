import { default as arrayFilter } from "./dist/150.js";
import { default as baseFilter } from "./dist/73.js";
import { default as baseIteratee } from "./dist/6.js";
import { default as isArray } from "./isArray.js";
function filter(collection, predicate) {
  var func = isArray(collection) ? arrayFilter : baseFilter;
  return func(collection, baseIteratee(predicate, 3));
}
export { filter as default };
/*====catalogjs annotation start====
k5SVwq0uL2Rpc3QvMTUwLmpzA8LAlcKsLi9kaXN0LzczLmpzBsLAlcKrLi9kaXN0LzYuanMJwsCVwqwuL2lzQXJyYXkuanMMwsCBp2RlZmF1bHSVoWymZmlsdGVyFcDA3AAXl6FvAAADwJDAmaFkCQACwJECwMKZoWmrYXJyYXlGaWx0ZXKSAhHAAKdkZWZhdWx0wMDAmKFyCwvAwJEBwMKcoWkAGAEGkMDCAMLAwJmhZAkABcCRBcDCmaFpqmJhc2VGaWx0ZXKSBRLAAadkZWZhdWx0wMDAmKFyCwrAwJEEwMKcoWkBFwQJkMDCAcLAwJmhZAkACMCRCMDCmaFprGJhc2VJdGVyYXRlZZIIE8ACp2RlZmF1bHTAwMCYoXILDMDAkQfAwpyhaQEWBwyQwMICwsDAmaFkCQALwJELwMKZoWmnaXNBcnJheZILEMADp2RlZmF1bHTAwMCYoXILB8DAkQrAwpyhaQEXCg2QwMIDwsDAl6FvAQAOFJDAmaFkABIPwJUQERITD8DCmaFspmZpbHRlcpIPFsDAwMCQ2UZXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvZmlsdGVyLmpzmKFyCQbAEJEOwMKYoXInB8ARkQrAwpihcg8LwBKRAcDCmKFyAwrAE5EEwMKYoXIcDMDAkQfAwpihZwEDFcCQwMKYoWcJCxbAkRbAwpihcgAGwMCRDsDC
====catalogjs annotation end====*/