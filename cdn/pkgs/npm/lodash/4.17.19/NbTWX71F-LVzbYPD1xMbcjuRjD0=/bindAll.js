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
k5WVwq0uL2Rpc3QvMTE5LmpzA8LAlcKsLi9kaXN0LzU2LmpzBsLAlcKpLi9iaW5kLmpzCcLAlcKsLi9kaXN0LzUwLmpzDMLAlcKsLi9kaXN0LzI3LmpzD8LAgadkZWZhdWx0laFsp2JpbmRBbGwbwMDcAB2XoW8AAAPAkRLAmaFkCQACwJECwMKZoWmpYXJyYXlFYWNokgIWwACnZGVmYXVsdMDAwJihcgsJwMCRAcDCnKFpABgBBpDAwgDCwMCZoWQJAAXAkQXAwpmhaa9iYXNlQXNzaWduVmFsdWWSBRjAAadkZWZhdWx0wMDAmKFyCw/AwJEEwMKcoWkBFwQJkMDCAcLAwJmhZAkACMCRCMDCmaFppGJpbmSSCBnAAqdkZWZhdWx0wMDAmKFyCwTAwJEHwMKcoWkBFAcMkMDCAsLAwJmhZAkAC8CRC8DCmaFpqGZsYXRSZXN0kgsVwAOnZGVmYXVsdMDAwJihcgsIwMCRCsDCnKFpARcKD5DAwgPCwMCZoWQJAA7AkQ7AwpmhaaV0b0tleZIOF8AEp2RlZmF1bHTAwMCYoXILBcDAkQ3AwpyhaQEXDRCQwMIEwsDAl6FvAQARGpDAmKFnAAESwJDAwpmhZAQAE8CTExEUwMKZoWynYmluZEFsbJITHMDAwBGQ2UdXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvYmluZEFsbC5qc5ihcgAHwBSREsDCmKFnAzEVwJUVFhcYGcDCmKFyAAjAFpEKwMKYoXIkCcAXkQHAwpihcikFwBiRDcDCmKFyCw/AGZEEwMKYoXIOBMDAkQfAwpihZwEDG8CQwMKYoWcJCxzAkRzAwpihcgAHwMCREsDC
====catalogjs annotation end====*/