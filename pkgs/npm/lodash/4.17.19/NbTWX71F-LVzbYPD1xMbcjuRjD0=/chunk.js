import { default as baseSlice } from "./dist/142.js";
import { default as isIterateeCall } from "./dist/70.js";
import { default as toInteger } from "./toInteger.js";
var nativeCeil = Math.ceil,
    nativeMax = Math.max;
function chunk(array, size, guard) {
  if (guard ? isIterateeCall(array, size, guard) : size === undefined) {
    size = 1;
  } else {
    size = nativeMax(toInteger(size), 0);
  }

  var length = array == null ? 0 : array.length;

  if (!length || size < 1) {
    return [];
  }

  var index = 0,
      resIndex = 0,
      result = Array(nativeCeil(length / size));

  while (index < length) {
    result[resIndex++] = baseSlice(array, index, index += size);
  }

  return result;
}
export { chunk as default };
/*====catalogjs annotation start====
k5OVwq0uL2Rpc3QvMTQyLmpzA8LAlcKsLi9kaXN0LzcwLmpzBsLAlcKuLi90b0ludGVnZXIuanMJwsCBp2RlZmF1bHSUoWylY2h1bmsYwNwAGpehbwAAA8CQwJmhZAkAAsCRAsDCmKFpqWJhc2VTbGljZZICFsAAp2RlZmF1bHTAwJihcgsJwMCRAcDCnKFpABgBBpDAwgDCwMCZoWQJAAXAkQXAwpihaa5pc0l0ZXJhdGVlQ2FsbJIFEsABp2RlZmF1bHTAwJihcgsOwMCRBMDCnKFpARcECZDAwgHCwMCZoWQJAAjAkQjAwpihaal0b0ludGVnZXKSCBTAAqdkZWZhdWx0wMCYoXILCcDAkQfAwpyhaQEZBwqQwMICwsDAl6FvAQALF5DAmKFnAAEMEJDAwpmhZAQMDQ6SDQvAwpihbKpuYXRpdmVDZWlskg0VwMDAC9lFV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2NodW5rLmpzmKFyAArAwJEMwMKZoWQGCw/Akg8LwMKYoWypbmF0aXZlTWF4kg8TwMDAC9lFV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2NodW5rLmpzmKFyAAnAwJEOwMKZoWQBNhHAmBITFBUWEQ4MwMKYoWylY2h1bmuSERnAwMDA2UVXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvY2h1bmsuanOYoXIJBcASkRDAwpihciUOwBORBMDCmKFyUQnAFJEOwMKYoXIBCcAVkQfAwpihcsyuCsAWkQzAwpihckcJwMCRAcDCmKFnAQMYwJDAwpihZwkLGcCRGcDCmKFyAAXAwJEQwMI=
====catalogjs annotation end====*/