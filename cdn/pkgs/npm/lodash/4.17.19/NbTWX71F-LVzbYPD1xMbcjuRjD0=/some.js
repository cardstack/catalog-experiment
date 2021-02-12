import { default as baseEach } from "./dist/75.js";
import { default as arraySome } from "./dist/151.js";
import { default as baseIteratee } from "./dist/6.js";
import { default as isArray } from "./isArray.js";
import { default as isIterateeCall } from "./dist/70.js";
function baseSome(collection, predicate) {
  var result;
  baseEach(collection, function (value, index, collection) {
    result = predicate(value, index, collection);
    return !result;
  });
  return !!result;
}
function some(collection, predicate, guard) {
  var func = isArray(collection) ? arraySome : baseSome;

  if (guard && isIterateeCall(collection, predicate, guard)) {
    predicate = undefined;
  }

  return func(collection, baseIteratee(predicate, 3));
}
export { some as default };
/*====catalogjs annotation start====
k5WVwqwuL2Rpc3QvNzUuanMDwsCVwq0uL2Rpc3QvMTUxLmpzBsLAlcKrLi9kaXN0LzYuanMJwsCVwqwuL2lzQXJyYXkuanMMwsCVwqwuL2Rpc3QvNzAuanMPwsCBp2RlZmF1bHSVoWykc29tZR3AwNwAH5ehbwAAA8CQwJmhZAkAAsCRAsDCmaFpqGJhc2VFYWNokgITwACnZGVmYXVsdMDAwJihcgsIwMCRAcDCnKFpABcBBpDAwgDCwMCZoWQJAAXAkQXAwpmhaalhcnJheVNvbWWSBRjAAadkZWZhdWx0wMDAmKFyCwnAwJEEwMKcoWkBGAQJkMDCAcLAwJmhZAkACMCRCMDCmaFprGJhc2VJdGVyYXRlZZIIG8ACp2RlZmF1bHTAwMCYoXILDMDAkQfAwpyhaQEWBwyQwMICwsDAmaFkCQALwJELwMKZoWmnaXNBcnJheZILF8ADp2RlZmF1bHTAwMCYoXILB8DAkQrAwpyhaQEXCg+QwMIDwsDAmaFkCQAOwJEOwMKZoWmuaXNJdGVyYXRlZUNhbGySDhrABKdkZWZhdWx0wMDAmKFyCw7AwJENwMKcoWkBFw0QkMDCBMLAwJehbwEAERSQwJmhZADMkxLAkhMSwMKZoWyoYmFzZVNvbWWSEhnAwMDAkNlJV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlU29tZS5qc5ihcgkIwBOREcDCmKFyKgjAwJEBwMKXoW8BABUckMCZoWQAEhbAlhcYGRobFsDCmaFspHNvbWWSFh7AwMDAkNlEV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3NvbWUuanOYoXIJBMAXkRXAwpihci4HwBiRCsDCmKFyDwnAGZEEwMKYoXIDCMAakRHAwpihchIOwBuRDcDCmKFyXAzAwJEHwMKYoWcBAx3AkMDCmKFnCQsewJEewMKYoXIABMDAkRXAwg==
====catalogjs annotation end====*/