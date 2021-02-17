import { default as isArrayLike } from "../isArrayLike.js";
function createBaseEach(eachFunc, fromRight) {
  return function (collection, iteratee) {
    if (collection == null) {
      return collection;
    }

    if (!isArrayLike(collection)) {
      return eachFunc(collection, iteratee);
    }

    var length = collection.length,
        index = fromRight ? length : -1,
        iterable = Object(collection);

    while (fromRight ? index-- : ++index < length) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }

    return collection;
  };
}
export { createBaseEach as default };
/*====catalogjs annotation start====
k5GVwrEuLi9pc0FycmF5TGlrZS5qcwPCwIGnZGVmYXVsdJWhbK5jcmVhdGVCYXNlRWFjaArAwJyXoW8AAAPAkMCZoWQJAAIEkQLAwpmhaatpc0FycmF5TGlrZZICCMAAp2RlZmF1bHTAwMCYoXILC8DAkQHAwpyhaQABAQWRBMDCAMLAwJihZwgTwMCQwMKXoW8BAAYJkMCZoWQAzQFrB8CSCAfAwpmhbK5jcmVhdGVCYXNlRWFjaJIHC8DAwMCQ2U9XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2NyZWF0ZUJhc2VFYWNoLmpzmKFyCQ7ACJEGwMKYoXLMigvAwJEBwMKYoWcBAwrAkMDCmKFnCQsLwJELwMKYoXIADsDAkQbAwg==
====catalogjs annotation end====*/