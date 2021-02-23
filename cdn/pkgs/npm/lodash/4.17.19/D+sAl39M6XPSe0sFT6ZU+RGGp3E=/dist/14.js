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
k5KVwqcuLzE3LmpzA8LAlcKnLi8yNy5qcwfCwIGnZGVmYXVsdJWhbKdiYXNlR2V0D8DA3AARl6FvAAADwJDAmaFkCQACBJECwMKZoWmoY2FzdFBhdGiSAgzAAKdkZWZhdWx0wMDAmKFyCwjAwJEBwMKcoWkAAQEHkQTAwgDCwMCYoWcICcDAkMDCmaFkCQAGCJEGwMKZoWmldG9LZXmSBg3AAadkZWZhdWx0wMDAmKFyCwXAwJEFwMKcoWkBAQUJkQjAwgHCwMCYoWcICcDAkMDCl6FvAQAKDpDAmaFkAFALwJMMDQvAwpmhbKdiYXNlR2V0kgsQwMDAwJDZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZUdldC5qc5ihcgkHwAyRCsDCmKFyGgjADZEBwMKYoXJ/BcDAkQXAwpihZwEDD8CQwMKYoWcJCxDAkRDAwpihcgAHwMCRCsDC
====catalogjs annotation end====*/