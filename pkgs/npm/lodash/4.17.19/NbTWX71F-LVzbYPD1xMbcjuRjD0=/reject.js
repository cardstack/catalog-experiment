import { default as arrayFilter } from "./dist/150.js";
import { default as baseFilter } from "./dist/73.js";
import { default as baseIteratee } from "./dist/6.js";
import { default as isArray } from "./isArray.js";
import { default as negate } from "./negate.js";
function reject(collection, predicate) {
  var func = isArray(collection) ? arrayFilter : baseFilter;
  return func(collection, negate(baseIteratee(predicate, 3)));
}
export { reject as default };
/*====catalogjs annotation start====
k5WVwq0uL2Rpc3QvMTUwLmpzA8LAlcKsLi9kaXN0LzczLmpzBsLAlcKrLi9kaXN0LzYuanMJwsCVwqwuL2lzQXJyYXkuanMMwsCVwqsuL25lZ2F0ZS5qcw/CwIGnZGVmYXVsdJShbKZyZWplY3QZwNwAG5ehbwAAA8CQwJmhZAkAAsCRAsDCmKFpq2FycmF5RmlsdGVykgIUwACnZGVmYXVsdMDAmKFyCwvAwJEBwMKcoWkAGAEGkMDCAMLAwJmhZAkABcCRBcDCmKFpqmJhc2VGaWx0ZXKSBRXAAadkZWZhdWx0wMCYoXILCsDAkQTAwpyhaQEXBAmQwMIBwsDAmaFkCQAIwJEIwMKYoWmsYmFzZUl0ZXJhdGVlkggXwAKnZGVmYXVsdMDAmKFyCwzAwJEHwMKcoWkBFgcMkMDCAsLAwJmhZAkAC8CRC8DCmKFpp2lzQXJyYXmSCxPAA6dkZWZhdWx0wMCYoXILB8DAkQrAwpyhaQEXCg+QwMIDwsDAmaFkCQAOwJEOwMKYoWmmbmVnYXRlkg4WwASnZGVmYXVsdMDAmKFyCwbAwJENwMKcoWkBFg0QkMDCBMLAwJehbwEAERiQwJmhZAATEsCWExQVFhcSwMKYoWymcmVqZWN0khIawMDAwNlGV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3JlamVjdC5qc5ihcgkGwBOREcDCmKFyJwfAFJEKwMKYoXIPC8AVkQHAwpihcgMKwBaRBMDCmKFyHAbAF5ENwMKYoXIBDMDAkQfAwpihZwEDGcCQwMKYoWcJCxrAkRrAwpihcgAGwMCREcDC
====catalogjs annotation end====*/