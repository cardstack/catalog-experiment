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
k5WVwqwuL2Rpc3QvNzUuanMDwsCVwq0uL2Rpc3QvMTYzLmpzB8LAlcKrLi9kaXN0LzYuanMLwsCVwqwuL2lzQXJyYXkuanMPwsCVwqwuL2Rpc3QvNzAuanMTwsCBp2RlZmF1bHSVoWylZXZlcnkiwMDcACSXoW8AAAPAkMCZoWQJAAIEkQLAwpmhaahiYXNlRWFjaJICGMAAp2RlZmF1bHTAwMCYoXILCMDAkQHAwpyhaQABAQeRBMDCAMLAwJihZwgOwMCQwMKZoWQJAAYIkQbAwpmhaaphcnJheUV2ZXJ5kgYdwAGnZGVmYXVsdMDAwJihcgsKwMCRBcDCnKFpAQEFC5EIwMIBwsDAmKFnCA/AwJDAwpmhZAkACgyRCsDCmaFprGJhc2VJdGVyYXRlZZIKIMACp2RlZmF1bHTAwMCYoXILDMDAkQnAwpyhaQEBCQ+RDMDCAsLAwJihZwgNwMCQwMKZoWQJAA4QkQ7Awpmhaadpc0FycmF5kg4cwAOnZGVmYXVsdMDAwJihcgsHwMCRDcDCnKFpAQENE5EQwMIDwsDAmKFnCA7AwJDAwpmhZAkAEhSREsDCmaFprmlzSXRlcmF0ZWVDYWxskhIfwASnZGVmYXVsdMDAwJihcgsOwMCREcDCnKFpAQERFZEUwMIEwsDAmKFnCA7AwJDAwpehbwEAFhmQwJmhZADMkhfAkhgXwMKZoWypYmFzZUV2ZXJ5khcewMDAwJDZSlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZUV2ZXJ5LmpzmKFyCQnAGJEWwMKYoXIxCMDAkQHAwpehbwEAGiGQwJmhZAASG8CWHB0eHyAbwMKZoWylZXZlcnmSGyPAwMDAkNlFV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2V2ZXJ5LmpzmKFyCQXAHJEawMKYoXIuB8AdkQ3Awpihcg8KwB6RBcDCmKFyAwnAH5EWwMKYoXISDsAgkRHAwpihclwMwMCRCcDCmKFnAQMiwJDAwpihZwkLI8CRI8DCmKFyAAXAwJEawMI=
====catalogjs annotation end====*/