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
k5eVwq0uL2Rpc3QvMTQ4LmpzA8LAlcKtLi9kaXN0LzExNy5qcwbCwJXCrS4vZGlzdC8xNzAuanMJwsCVwqsuL3ZhbHVlcy5qcwzCwJXCrC4vaXNBcnJheS5qcw/CwJXCrC4vZGlzdC83MC5qcxLCwJXCri4vdG9JbnRlZ2VyLmpzFcLAgadkZWZhdWx0laFsqnNhbXBsZVNpemUrwMDcAC2XoW8AAAPAkMCZoWQJAALAkQLAwpmhaaliYXNlQ2xhbXCTAhshwACnZGVmYXVsdMDAwJihcgsJwMCRAcDCnKFpABgBBpDAwgDCwMCZoWQJAAXAkQXAwpmhaaljb3B5QXJyYXmSBRrAAadkZWZhdWx0wMDAmKFyCwnAwJEEwMKcoWkBGAQJkMDCAcLAwJmhZAkACMCRCMDCmaFpq3NodWZmbGVTZWxmkwgZIMACp2RlZmF1bHTAwMCYoXILC8DAkQfAwpyhaQEYBwyQwMICwsDAmaFkCQALwJELwMKZoWmmdmFsdWVzkgsfwAOnZGVmYXVsdMDAwJihcgsGwMCRCsDCnKFpARYKD5DAwgPCwMCZoWQJAA7AkQ7Awpmhaadpc0FycmF5kg4nwASnZGVmYXVsdMDAwJihcgsHwMCRDcDCnKFpARcNEpDAwgTCwMCZoWQJABHAkRHAwpmhaa5pc0l0ZXJhdGVlQ2FsbJIRJcAFp2RlZmF1bHTAwMCYoXILDsDAkRDAwpyhaQEXEBWQwMIFwsDAmaFkCQAUwJEUwMKZoWmpdG9JbnRlZ2VykhQmwAanZGVmYXVsdMDAwJihcgsJwMCRE8DCnKFpARkTFpDAwgbCwMCXoW8BABcckMCZoWQAGBjAlBkaGxjAwpmhbK9hcnJheVNhbXBsZVNpemWSGCjAwMDAkNlQV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19hcnJheVNhbXBsZVNpemUuanOYoXIJD8AZkRfAwpihchYLwBqRB8DCmKFyAQnAG5EEwMKYoXIJCcDAkQHAwpehbwEAHSKQwJmhZAAYHsCUHyAhHsDCmaFsrmJhc2VTYW1wbGVTaXplkh4pwMDAwJDZT1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZVNhbXBsZVNpemUuanOYoXIJDsAfkR3AwpihciAGwCCRCsDCmKFyFwvAIZEHwMKYoXIICcDAkQHAwpehbwEAIyqQwJmhZAAhJMCWJSYnKCkkwMKZoWyqc2FtcGxlU2l6ZZIkLMDAwMCQ2UpXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvc2FtcGxlU2l6ZS5qc5ihcgkKwCWRI8DCmKFyJw7AJpEQwMKYoXJKCcAnkRPAwpihchcHwCiRDcDCmKFyDw/AKZEXwMKYoXIDDsDAkR3AwpihZwEDK8CQwMKYoWcJCyzAkSzAwpihcgAKwMCRI8DC
====catalogjs annotation end====*/