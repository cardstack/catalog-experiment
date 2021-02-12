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
k5GVwrEuLi9pc0FycmF5TGlrZS5qcwPCwIGnZGVmYXVsdJWhbK5jcmVhdGVCYXNlRWFjaAnAwJuXoW8AAAPAkMCZoWQJAALAkQLAwpmhaatpc0FycmF5TGlrZZICB8AAp2RlZmF1bHTAwMCYoXILC8DAkQHAwpyhaQAcAQSQwMIAwsDAl6FvAQAFCJDAmaFkAM0BawbAkgcGwMKZoWyuY3JlYXRlQmFzZUVhY2iSBgrAwMDAkNlPV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19jcmVhdGVCYXNlRWFjaC5qc5ihcgkOwAeRBcDCmKFyzIoLwMCRAcDCmKFnAQMJwJDAwpihZwkLCsCRCsDCmKFyAA7AwJEFwMI=
====catalogjs annotation end====*/