import { default as baseLodash } from "./dist/114.js";
import { default as wrapperClone } from "./dist/101.js";
function wrapperPlant(value) {
  var result,
      parent = this;

  while (parent instanceof baseLodash) {
    var clone = wrapperClone(parent);
    clone.__index__ = 0;
    clone.__values__ = undefined;

    if (result) {
      previous.__wrapped__ = clone;
    } else {
      result = clone;
    }

    var previous = clone;
    parent = parent.__wrapped__;
  }

  previous.__wrapped__ = value;
  return result;
}
export { wrapperPlant as default };
/*====catalogjs annotation start====
k5KVwq0uL2Rpc3QvMTE0LmpzA8LAlcKtLi9kaXN0LzEwMS5qcwfCwIGnZGVmYXVsdJWhbKx3cmFwcGVyUGxhbnQPwMDcABGXoW8AAAPAkMCZoWQJAAIEkQLAwpmhaapiYXNlTG9kYXNokgIMwACnZGVmYXVsdMDAwJihcgsKwMCRAcDCnKFpAAEBB5EEwMIAwsDAmKFnCA/AwJDAwpmhZAkABgiRBsDCmaFprHdyYXBwZXJDbG9uZZIGDcABp2RlZmF1bHTAwMCYoXILDMDAkQXAwpyhaQEBBQmRCMDCAcLAwJihZwgPwMCQwMKXoW8BAAoOkMCZoWQAzQEYC8CTDA0LwMKZoWysd3JhcHBlclBsYW50kgsQwMDAwJDZRVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9wbGFudC5qc5ihcgkMwAyRCsDCmKFySQrADZEBwMKYoXIUDMDAkQXAwpihZwEDD8CQwMKYoWcJCxDAkRDAwpihcgAMwMCRCsDC
====catalogjs annotation end====*/