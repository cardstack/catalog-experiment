import { default as baseIteratee } from "./6.js";
import { default as isArrayLike } from "../isArrayLike.js";
import { default as keys } from "../keys.js";
function createFind(findIndexFunc) {
  return function (collection, predicate, fromIndex) {
    var iterable = Object(collection);

    if (!isArrayLike(collection)) {
      var iteratee = baseIteratee(predicate, 3);
      collection = keys(collection);

      predicate = function (key) {
        return iteratee(iterable[key], key, iterable);
      };
    }

    var index = findIndexFunc(collection, predicate, fromIndex);
    return index > -1 ? iterable[iteratee ? collection[index] : index] : undefined;
  };
}
export { createFind as default };
/*====catalogjs annotation start====
k5OVwqYuLzYuanMDwsCVwrEuLi9pc0FycmF5TGlrZS5qcwfCwJXCqi4uL2tleXMuanMLwsCBp2RlZmF1bHSVoWyqY3JlYXRlRmluZBTAwNwAFpehbwAAA8CQwJmhZAkAAgSRAsDCmaFprGJhc2VJdGVyYXRlZZICEcAAp2RlZmF1bHTAwMCYoXILDMDAkQHAwpyhaQABAQeRBMDCAMLAwJihZwgIwMCQwMKZoWQJAAYIkQbAwpmhaatpc0FycmF5TGlrZZIGEMABp2RlZmF1bHTAwMCYoXILC8DAkQXAwpyhaQEBBQuRCMDCAcLAwJihZwgTwMCQwMKZoWQJAAoMkQrAwpmhaaRrZXlzkgoSwAKnZGVmYXVsdMDAwJihcgsEwMCRCcDCnKFpAQEJDZEMwMICwsDAmKFnCAzAwJDAwpehbwEADhOQwJmhZADNARQPwJQQERIPwMKZoWyqY3JlYXRlRmluZJIPFcDAwMCQ2UtXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2NyZWF0ZUZpbmQuanOYoXIJCsAQkQ7AwpihcnoLwBGRBcDCmKFyJQzAEpEBwMKYoXIjBMDAkQnAwpihZwEDFMCQwMKYoWcJCxXAkRXAwpihcgAKwMCRDsDC
====catalogjs annotation end====*/