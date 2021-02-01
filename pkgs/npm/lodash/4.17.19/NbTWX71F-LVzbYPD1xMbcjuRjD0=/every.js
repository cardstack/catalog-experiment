import { default as baseEach } from "./dist/75.js";
import { default as arrayEvery } from "./dist/163.js";
import { default as baseIteratee } from "./dist/6.js";
import { default as isArray } from "./isArray.js";
import { default as isIterateeCall } from "./dist/70.js";
function baseEvery(collection, predicate) {
  var result = true;
  baseEach(collection, function (value, index, collection) {
    result = !!predicate(value, index, collection);
    return result;
  });
  return result;
}
function every(collection, predicate, guard) {
  var func = isArray(collection) ? arrayEvery : baseEvery;

  if (guard && isIterateeCall(collection, predicate, guard)) {
    predicate = undefined;
  }

  return func(collection, baseIteratee(predicate, 3));
}
export { every as default };
/*====catalogjs annotation start====
k5WVwqwuL2Rpc3QvNzUuanMDwsCVwq0uL2Rpc3QvMTYzLmpzBsLAlcKrLi9kaXN0LzYuanMJwsCVwqwuL2lzQXJyYXkuanMMwsCVwqwuL2Rpc3QvNzAuanMPwsCBp2RlZmF1bHSUoWylZXZlcnkdwNwAH5ehbwAAA8CQwJmhZAkAAsCRAsDCmKFpqGJhc2VFYWNokgITwACnZGVmYXVsdMDAmKFyCwjAwJEBwMKcoWkAFwEGkMDCAMLAwJmhZAkABcCRBcDCmKFpqmFycmF5RXZlcnmSBRjAAadkZWZhdWx0wMCYoXILCsDAkQTAwpyhaQEYBAmQwMIBwsDAmaFkCQAIwJEIwMKYoWmsYmFzZUl0ZXJhdGVlkggbwAKnZGVmYXVsdMDAmKFyCwzAwJEHwMKcoWkBFgcMkMDCAsLAwJmhZAkAC8CRC8DCmKFpp2lzQXJyYXmSCxfAA6dkZWZhdWx0wMCYoXILB8DAkQrAwpyhaQEXCg+QwMIDwsDAmaFkCQAOwJEOwMKYoWmuaXNJdGVyYXRlZUNhbGySDhrABKdkZWZhdWx0wMCYoXILDsDAkQ3AwpyhaQEXDRCQwMIEwsDAl6FvAQARFJDAmaFkAMySEsCSExLAwpihbKliYXNlRXZlcnmSEhnAwMDA2UpXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VFdmVyeS5qc5ihcgkJwBOREcDCmKFyMQjAwJEBwMKXoW8BABUckMCZoWQAEhbAlhcYGRobFsDCmKFspWV2ZXJ5khYewMDAwNlFV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2V2ZXJ5LmpzmKFyCQXAF5EVwMKYoXIuB8AYkQrAwpihcg8KwBmRBMDCmKFyAwnAGpERwMKYoXISDsAbkQ3AwpihclwMwMCRB8DCmKFnAQMdwJDAwpihZwkLHsCRHsDCmKFyAAXAwJEVwMI=
====catalogjs annotation end====*/