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
k5WVwq0uL2Rpc3QvMTUwLmpzA8LAlcKsLi9kaXN0LzczLmpzB8LAlcKrLi9kaXN0LzYuanMLwsCVwqwuL2lzQXJyYXkuanMPwsCVwqsuL25lZ2F0ZS5qcxPCwIGnZGVmYXVsdJWhbKZyZWplY3QewMDcACCXoW8AAAPAkMCZoWQJAAIEkQLAwpmhaathcnJheUZpbHRlcpICGcAAp2RlZmF1bHTAwMCYoXILC8DAkQHAwpyhaQABAQeRBMDCAMLAwJihZwgPwMCQwMKZoWQJAAYIkQbAwpmhaapiYXNlRmlsdGVykgYawAGnZGVmYXVsdMDAwJihcgsKwMCRBcDCnKFpAQEFC5EIwMIBwsDAmKFnCA7AwJDAwpmhZAkACgyRCsDCmaFprGJhc2VJdGVyYXRlZZIKHMACp2RlZmF1bHTAwMCYoXILDMDAkQnAwpyhaQEBCQ+RDMDCAsLAwJihZwgNwMCQwMKZoWQJAA4QkQ7Awpmhaadpc0FycmF5kg4YwAOnZGVmYXVsdMDAwJihcgsHwMCRDcDCnKFpAQENE5EQwMIDwsDAmKFnCA7AwJDAwpmhZAkAEhSREsDCmaFppm5lZ2F0ZZISG8AEp2RlZmF1bHTAwMCYoXILBsDAkRHAwpyhaQEBERWRFMDCBMLAwJihZwgNwMCQwMKXoW8BABYdkMCZoWQAExfAlhgZGhscF8DCmaFspnJlamVjdJIXH8DAwMCQ2UZXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvcmVqZWN0LmpzmKFyCQbAGJEWwMKYoXInB8AZkQ3Awpihcg8LwBqRAcDCmKFyAwrAG5EFwMKYoXIcBsAckRHAwpihcgEMwMCRCcDCmKFnAQMewJDAwpihZwkLH8CRH8DCmKFyAAbAwJEWwMI=
====catalogjs annotation end====*/