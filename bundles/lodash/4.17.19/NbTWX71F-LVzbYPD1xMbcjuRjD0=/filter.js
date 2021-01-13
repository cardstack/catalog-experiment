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
k5SVwq0uL2Rpc3QvMTUwLmpzA8LAlcKsLi9kaXN0LzczLmpzBsLAlcKrLi9kaXN0LzYuanMJwsCVwqwuL2lzQXJyYXkuanMMwsCBp2RlZmF1bHSUoWymZmlsdGVyFcDcABeXoW8AAAPAkQ7AmaFkCQACwJECwMKYoWmrYXJyYXlGaWx0ZXKSAhHAAKdkZWZhdWx0wMCYoXILC8DAkQHAwpyhaQAYAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmqYmFzZUZpbHRlcpIFEsABp2RlZmF1bHTAwJihcgsKwMCRBMDCnKFpARcECZDAwgHCwMCZoWQJAAjAkQjAwpihaaxiYXNlSXRlcmF0ZWWSCBPAAqdkZWZhdWx0wMCYoXILDMDAkQfAwpyhaQEWBwyQwMICwsDAmaFkCQALwJELwMKYoWmnaXNBcnJheZILEMADp2RlZmF1bHTAwJihcgsHwMCRCsDCnKFpARcKDZDAwgPCwMCXoW8BAA4UkMCZoWQAEg/AlRAREhMPwMKYoWymZmlsdGVykg8WwMDAwNlGV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2ZpbHRlci5qc5ihcgkGwBCRDsDCmKFyJwfAEZEKwMKYoXIPC8ASkQHAwpihcgMKwBORBMDCmKFyHAzAwJEHwMKYoWcBAxXAkMDCmKFnCQsWwJEWwMKYoXIABsDAkQ7Awg==
====catalogjs annotation end====*/