import { default as arrayPush } from "./dist/139.js";
import { default as baseFlatten } from "./dist/85.js";
import { default as copyArray } from "./dist/117.js";
import { default as isArray } from "./isArray.js";
function concat() {
  var length = arguments.length;

  if (!length) {
    return [];
  }

  var args = Array(length - 1),
      array = arguments[0],
      index = length;

  while (index--) {
    args[index - 1] = arguments[index];
  }

  return arrayPush(isArray(array) ? copyArray(array) : [array], baseFlatten(args, 1));
}
export { concat as default };
/*====catalogjs annotation start====
k5SVwq0uL2Rpc3QvMTM5LmpzA8LAlcKsLi9kaXN0Lzg1LmpzB8LAlcKtLi9kaXN0LzExNy5qcwvCwJXCrC4vaXNBcnJheS5qcw/CwIGnZGVmYXVsdJWhbKZjb25jYXQZwMDcABuXoW8AAAPAkMCZoWQJAAIEkQLAwpmhaalhcnJheVB1c2iSAhTAAKdkZWZhdWx0wMDAmKFyCwnAwJEBwMKcoWkAAQEHkQTAwgDCwMCYoWcID8DAkMDCmaFkCQAGCJEGwMKZoWmrYmFzZUZsYXR0ZW6SBhfAAadkZWZhdWx0wMDAmKFyCwvAwJEFwMKcoWkBAQULkQjAwgHCwMCYoWcIDsDAkMDCmaFkCQAKDJEKwMKZoWmpY29weUFycmF5kgoWwAKnZGVmYXVsdMDAwJihcgsJwMCRCcDCnKFpAQEJD5EMwMICwsDAmKFnCA/AwJDAwpmhZAkADhCRDsDCmaFpp2lzQXJyYXmSDhXAA6dkZWZhdWx0wMDAmKFyCwfAwJENwMKcoWkBAQ0RkRDAwgPCwMCYoWcIDsDAkMDCl6FvAQASGJDAmaFkAA0TwJUUFRYXE8DCmaFspmNvbmNhdJITGsDAwMCQ2UZXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvY29uY2F0LmpzmKFyCQbAFJESwMKYoXLM6QnAFZEBwMKYoXIBB8AWkQ3AwpihcgoJwBeRCcDCmKFyEwvAwJEFwMKYoWcBAxnAkMDCmKFnCQsawJEawMKYoXIABsDAkRLAwg==
====catalogjs annotation end====*/