import { default as baseClamp } from "./dist/148.js";
import { default as copyArray } from "./dist/117.js";
import { default as shuffleSelf } from "./dist/170.js";
import { default as values } from "./values.js";
import { default as isArray } from "./isArray.js";
import { default as isIterateeCall } from "./dist/70.js";
import { default as toInteger } from "./toInteger.js";
function arraySampleSize(array, n) {
  return shuffleSelf(copyArray(array), baseClamp(n, 0, array.length));
}
function baseSampleSize(collection, n) {
  var array = values(collection);
  return shuffleSelf(array, baseClamp(n, 0, array.length));
}
function sampleSize(collection, n, guard) {
  if (guard ? isIterateeCall(collection, n, guard) : n === undefined) {
    n = 1;
  } else {
    n = toInteger(n);
  }

  var func = isArray(collection) ? arraySampleSize : baseSampleSize;
  return func(collection, n);
}
export { sampleSize as default };
/*====catalogjs annotation start====
k5eVwq0uL2Rpc3QvMTQ4LmpzA8LAlcKtLi9kaXN0LzExNy5qcwbCwJXCrS4vZGlzdC8xNzAuanMJwsCVwqsuL3ZhbHVlcy5qcwzCwJXCrC4vaXNBcnJheS5qcw/CwJXCrC4vZGlzdC83MC5qcxLCwJXCri4vdG9JbnRlZ2VyLmpzFcLAgadkZWZhdWx0lKFsqnNhbXBsZVNpemUrwNwALZehbwAAA8CTFx0jwJmhZAkAAsCRAsDCmKFpqWJhc2VDbGFtcJMCGyHAAKdkZWZhdWx0wMCYoXILCcDAkQHAwpyhaQAYAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmpY29weUFycmF5kgUawAGnZGVmYXVsdMDAmKFyCwnAwJEEwMKcoWkBGAQJkMDCAcLAwJmhZAkACMCRCMDCmKFpq3NodWZmbGVTZWxmkwgZIMACp2RlZmF1bHTAwJihcgsLwMCRB8DCnKFpARgHDJDAwgLCwMCZoWQJAAvAkQvAwpihaaZ2YWx1ZXOSCx/AA6dkZWZhdWx0wMCYoXILBsDAkQrAwpyhaQEWCg+QwMIDwsDAmaFkCQAOwJEOwMKYoWmnaXNBcnJheZIOJ8AEp2RlZmF1bHTAwJihcgsHwMCRDcDCnKFpARcNEpDAwgTCwMCZoWQJABHAkRHAwpihaa5pc0l0ZXJhdGVlQ2FsbJIRJcAFp2RlZmF1bHTAwJihcgsOwMCREMDCnKFpARcQFZDAwgXCwMCZoWQJABTAkRTAwpihaal0b0ludGVnZXKSFCbABqdkZWZhdWx0wMCYoXILCcDAkRPAwpyhaQEZExaQwMIGwsDAl6FvAQAXHJDAmaFkABgYwJQZGhsYwMKYoWyvYXJyYXlTYW1wbGVTaXplkhgowMDAwNlQV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19hcnJheVNhbXBsZVNpemUuanOYoXIJD8AZkRfAwpihchYLwBqRB8DCmKFyAQnAG5EEwMKYoXIJCcDAkQHAwpehbwEAHSKQwJmhZAAYHsCUHyAhHsDCmKFsrmJhc2VTYW1wbGVTaXplkh4pwMDAwNlPV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlU2FtcGxlU2l6ZS5qc5ihcgkOwB+RHcDCmKFyIAbAIJEKwMKYoXIXC8AhkQfAwpihcggJwMCRAcDCl6FvAQAjKpDAmaFkACEkwJYlJicoKSTAwpihbKpzYW1wbGVTaXplkiQswMDAwNlKV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3NhbXBsZVNpemUuanOYoXIJCsAlkSPAwpihcicOwCaREMDCmKFySgnAJ5ETwMKYoXIXB8AokQ3Awpihcg8PwCmRF8DCmKFyAw7AwJEdwMKYoWcBAyvAkMDCmKFnCQsswJEswMKYoXIACsDAkSPAwg==
====catalogjs annotation end====*/