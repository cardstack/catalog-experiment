import { default as baseGet } from "./14.js";
import { default as baseSet } from "./16.js";
import { default as castPath } from "./17.js";
function basePickBy(object, paths, predicate) {
  var index = -1,
      length = paths.length,
      result = {};

  while (++index < length) {
    var path = paths[index],
        value = baseGet(object, path);

    if (predicate(value, path)) {
      baseSet(result, castPath(path, object), value);
    }
  }

  return result;
}
export { basePickBy as default };
/*====catalogjs annotation start====
k5OVwqcuLzE0LmpzA8LAlcKnLi8xNi5qcwbCwJXCpy4vMTcuanMJwsCBp2RlZmF1bHSVoWyqYmFzZVBpY2tCeRHAwNwAE5ehbwAAA8CQwJmhZAkAAsCRAsDCmaFpp2Jhc2VHZXSSAg3AAKdkZWZhdWx0wMDAmKFyCwfAwJEBwMKcoWkAEgEGkMDCAMLAwJmhZAkABcCRBcDCmaFpp2Jhc2VTZXSSBQ7AAadkZWZhdWx0wMDAmKFyCwfAwJEEwMKcoWkBEgQJkMDCAcLAwJmhZAkACMCRCMDCmaFpqGNhc3RQYXRokggPwAKnZGVmYXVsdMDAwJihcgsIwMCRB8DCnKFpARIHCpDAwgLCwMCXoW8BAAsQkMCZoWQANQzAlA0ODwzAwpmhbKpiYXNlUGlja0J5kgwSwMDAwJDZS1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZVBpY2tCeS5qc5ihcgkKwA2RC8DCmKFyzKoHwA6RAcDCmKFyOQfAD5EEwMKYoXIJCMDAkQfAwpihZwEDEcCQwMKYoWcJCxLAkRLAwpihcgAKwMCRC8DC
====catalogjs annotation end====*/