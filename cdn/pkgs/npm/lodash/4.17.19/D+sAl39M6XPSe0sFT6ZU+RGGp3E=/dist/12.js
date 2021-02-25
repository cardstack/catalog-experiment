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
k5OVwqcuLzE0LmpzA8LAlcKnLi8xNi5qcwfCwJXCpy4vMTcuanMLwsCBp2RlZmF1bHSVoWyqYmFzZVBpY2tCeRTAwNwAFpehbwAAA8CQwJmhZAkAAgSRAsDCmaFpp2Jhc2VHZXSSAhDAAKdkZWZhdWx0wMDAmKFyCwfAwJEBwMKcoWkAAQEHkQTAwgDCwMCYoWcICcDAkMDCmaFkCQAGCJEGwMKZoWmnYmFzZVNldJIGEcABp2RlZmF1bHTAwMCYoXILB8DAkQXAwpyhaQEBBQuRCMDCAcLAwJihZwgJwMCQwMKZoWQJAAoMkQrAwpmhaahjYXN0UGF0aJIKEsACp2RlZmF1bHTAwMCYoXILCMDAkQnAwpyhaQEBCQ2RDMDCAsLAwJihZwgJwMCQwMKXoW8BAA4TkMCZoWQANQ/AlBAREg/AwpmhbKpiYXNlUGlja0J5kg8VwMDAwJDZS1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZVBpY2tCeS5qc5ihcgkKwBCRDsDCmKFyzKoHwBGRAcDCmKFyOQfAEpEFwMKYoXIJCMDAkQnAwpihZwEDFMCQwMKYoWcJCxXAkRXAwpihcgAKwMCRDsDC
====catalogjs annotation end====*/