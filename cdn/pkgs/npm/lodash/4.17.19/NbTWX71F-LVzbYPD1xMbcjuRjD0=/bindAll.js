import { default as arrayEach } from "./dist/119.js";
import { default as baseAssignValue } from "./dist/56.js";
import { default as bind } from "./bind.js";
import { default as flatRest } from "./dist/50.js";
import { default as toKey } from "./dist/27.js";
var bindAll = flatRest(function (object, methodNames) {
  arrayEach(methodNames, function (key) {
    key = toKey(key);
    baseAssignValue(object, key, bind(object[key], object));
  });
  return object;
});
export { bindAll as default };
/*====catalogjs annotation start====
k5WVwq0uL2Rpc3QvMTE5LmpzA8LAlcKsLi9kaXN0LzU2LmpzB8LAlcKpLi9iaW5kLmpzC8LAlcKsLi9kaXN0LzUwLmpzD8LAlcKsLi9kaXN0LzI3LmpzE8LAgadkZWZhdWx0laFsp2JpbmRBbGwgwMDcACKXoW8AAAPAkRfAmaFkCQACBJECwMKZoWmpYXJyYXlFYWNokgIbwACnZGVmYXVsdMDAwJihcgsJwMCRAcDCnKFpAAEBB5EEwMIAwsDAmKFnCA/AwJDAwpmhZAkABgiRBsDCmaFpr2Jhc2VBc3NpZ25WYWx1ZZIGHcABp2RlZmF1bHTAwMCYoXILD8DAkQXAwpyhaQEBBQuRCMDCAcLAwJihZwgOwMCQwMKZoWQJAAoMkQrAwpmhaaRiaW5kkgoewAKnZGVmYXVsdMDAwJihcgsEwMCRCcDCnKFpAQEJD5EMwMICwsDAmKFnCAvAwJDAwpmhZAkADhCRDsDCmaFpqGZsYXRSZXN0kg4awAOnZGVmYXVsdMDAwJihcgsIwMCRDcDCnKFpAQENE5EQwMIDwsDAmKFnCA7AwJDAwpmhZAkAEhSREsDCmaFppXRvS2V5khIcwASnZGVmYXVsdMDAwJihcgsFwMCREcDCnKFpAQERFZEUwMIEwsDAmKFnCA7AwJDAwpehbwEAFh+QwJihZwABF8CQwMKZoWQEABjAkxgWGcDCmaFsp2JpbmRBbGySGCHAwMAWkNlHV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2JpbmRBbGwuanOYoXIAB8AZkRfAwpihZwMxGsCVGhscHR7AwpihcgAIwBuRDcDCmKFyJAnAHJEBwMKYoXIpBcAdkRHAwpihcgsPwB6RBcDCmKFyDgTAwJEJwMKYoWcBAyDAkMDCmKFnCQshwJEhwMKYoXIAB8DAkRfAwg==
====catalogjs annotation end====*/