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
k5OVwq0uL2Rpc3QvMTQyLmpzA8LAlcKsLi9kaXN0LzcwLmpzBsLAlcKuLi90b0ludGVnZXIuanMJwsCBp2RlZmF1bHSUoWylY2h1bmsYwNwAGpehbwAAA8CREMCZoWQJAALAkQLAwpihaaliYXNlU2xpY2WSAhbAAKdkZWZhdWx0wMCYoXILCcDAkQHAwpyhaQAYAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmuaXNJdGVyYXRlZUNhbGySBRLAAadkZWZhdWx0wMCYoXILDsDAkQTAwpyhaQEXBAmQwMIBwsDAmaFkCQAIwJEIwMKYoWmpdG9JbnRlZ2VykggUwAKnZGVmYXVsdMDAmKFyCwnAwJEHwMKcoWkBGQcKkMDCAsLAwJehbwEACxeQwJihZwABDBCQwMKZoWQEDA0Okg0LwMKYoWyqbmF0aXZlQ2VpbJINFcDAwAvZRVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9jaHVuay5qc5ihcgAKwMCRDMDCmaFkBgsPwJIPC8DCmKFsqW5hdGl2ZU1heJIPE8DAwAvZRVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9jaHVuay5qc5ihcgAJwMCRDsDCmaFkATYRwJgSExQVFhEODMDCmKFspWNodW5rkhEZwMDAwNlFV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2NodW5rLmpzmKFyCQXAEpEQwMKYoXIlDsATkQTAwpihclEJwBSRDsDCmKFyAQnAFZEHwMKYoXLMrgrAFpEMwMKYoXJHCcDAkQHAwpihZwEDGMCQwMKYoWcJCxnAkRnAwpihcgAFwMCREMDC
====catalogjs annotation end====*/