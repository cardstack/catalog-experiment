import { default as castPath } from "./17.js";
import { default as toKey } from "./27.js";
function baseGet(object, path) {
  path = castPath(path, object);
  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }

  return index && index == length ? object : undefined;
}
export { baseGet as default };
/*====catalogjs annotation start====
k5KVwqcuLzE3LmpzA8LAlcKnLi8yNy5qcwbCwIGnZGVmYXVsdJWhbKdiYXNlR2V0DcDAn5ehbwAAA8CQwJmhZAkAAsCRAsDCmaFpqGNhc3RQYXRokgIKwACnZGVmYXVsdMDAwJihcgsIwMCRAcDCnKFpABIBBpDAwgDCwMCZoWQJAAXAkQXAwpmhaaV0b0tleZIFC8ABp2RlZmF1bHTAwMCYoXILBcDAkQTAwpyhaQESBAeQwMIBwsDAl6FvAQAIDJDAmaFkAFAJwJMKCwnAwpmhbKdiYXNlR2V0kgkOwMDAwJDZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZUdldC5qc5ihcgkHwAqRCMDCmKFyGgjAC5EBwMKYoXJ/BcDAkQTAwpihZwEDDcCQwMKYoWcJCw7AkQ7AwpihcgAHwMCRCMDC
====catalogjs annotation end====*/