import { default as baseIndexOf } from "./dist/123.js";
import { default as isArrayLike } from "./isArrayLike.js";
import { default as isString } from "./isString.js";
import { default as toInteger } from "./toInteger.js";
import { default as values } from "./values.js";
var nativeMax = Math.max;
function includes(collection, value, fromIndex, guard) {
  collection = isArrayLike(collection) ? collection : values(collection);
  fromIndex = fromIndex && !guard ? toInteger(fromIndex) : 0;
  var length = collection.length;

  if (fromIndex < 0) {
    fromIndex = nativeMax(length + fromIndex, 0);
  }

  return isString(collection) ? fromIndex <= length && collection.indexOf(value, fromIndex) > -1 : !!length && baseIndexOf(collection, value, fromIndex) > -1;
}
export { includes as default };
/*====catalogjs annotation start====
k5WVwq0uL2Rpc3QvMTIzLmpzA8LAlcKwLi9pc0FycmF5TGlrZS5qcwbCwJXCrS4vaXNTdHJpbmcuanMJwsCVwq4uL3RvSW50ZWdlci5qcwzCwJXCqy4vdmFsdWVzLmpzD8LAgadkZWZhdWx0lKFsqGluY2x1ZGVzHcDcAB+XoW8AAAPAkRTAmaFkCQACwJECwMKYoWmrYmFzZUluZGV4T2aSAhvAAKdkZWZhdWx0wMCYoXILC8DAkQHAwpyhaQAYAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmraXNBcnJheUxpa2WSBRbAAadkZWZhdWx0wMCYoXILC8DAkQTAwpyhaQEbBAmQwMIBwsDAmaFkCQAIwJEIwMKYoWmoaXNTdHJpbmeSCBrAAqdkZWZhdWx0wMCYoXILCMDAkQfAwpyhaQEYBwyQwMICwsDAmaFkCQALwJELwMKYoWmpdG9JbnRlZ2VykgsYwAOnZGVmYXVsdMDAmKFyCwnAwJEKwMKcoWkBGQoPkMDCA8LAwJmhZAkADsCRDsDCmKFppnZhbHVlc5IOF8AEp2RlZmF1bHTAwJihcgsGwMCRDcDCnKFpARYNEJDAwgTCwMCXoW8BABEckMCYoWcAARIUkMDCmaFkBAsTwJITEcDCmKFsqW5hdGl2ZU1heJITGcDAwBHZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9pbmNsdWRlcy5qc5ihcgAJwMCREsDCmaFkASYVwJgWFxgZGhsVEsDCmKFsqGluY2x1ZGVzkhUewMDAwNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2luY2x1ZGVzLmpzmKFyCQjAFpEUwMKYoXI3C8AXkQTAwpihchwGwBiRDcDCmKFyMgnAGZEKwMKYoXJbCcAakRLAwpihcicIwBuRB8DCmKFyXgvAwJEBwMKYoWcBAx3AkMDCmKFnCQsewJEewMKYoXIACMDAkRTAwg==
====catalogjs annotation end====*/