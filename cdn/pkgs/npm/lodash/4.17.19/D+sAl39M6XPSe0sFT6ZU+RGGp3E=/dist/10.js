import { default as castPath } from "./17.js";
import { default as last } from "../last.js";
import { default as parent0 } from "./11.js";
import { default as toKey } from "./27.js";
function baseUnset(object, path) {
  path = castPath(path, object);
  object = parent0(object, path);
  return object == null || delete object[toKey(last(path))];
}
export { baseUnset as default };
/*====catalogjs annotation start====
k5SVwqcuLzE3LmpzA8LAlcKqLi4vbGFzdC5qcwfCwJXCpy4vMTEuanMLwsCVwqcuLzI3LmpzD8LAgadkZWZhdWx0laFsqWJhc2VVbnNldBnAwNwAG5ehbwAAA8CQwJmhZAkAAgSRAsDCmaFpqGNhc3RQYXRokgIUwACnZGVmYXVsdMDAwJihcgsIwMCRAcDCnKFpAAEBB5EEwMIAwsDAmKFnCAnAwJDAwpmhZAkABgiRBsDCmaFppGxhc3SSBhfAAadkZWZhdWx0wMDAmKFyCwTAwJEFwMKcoWkBAQULkQjAwgHCwMCYoWcIDMDAkMDCmaFkCQAKDJEKwMKZoWmncGFyZW50MJIKFcACp2RlZmF1bHTAwMCYoXILB8DAkQnAwpyhaQEBCQ+RDMDCAsLAwJihZwgJwMCQwMKZoWQJAA4QkQ7AwpmhaaV0b0tleZIOFsADp2RlZmF1bHTAwMCYoXILBcDAkQ3AwpyhaQEBDRGREMDCA8LAwJihZwgJwMCQwMKXoW8BABIYkMCZoWQACxPAlRQVFhcTwMKZoWypYmFzZVVuc2V0khMawMDAwJDZSlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZVVuc2V0LmpzmKFyCQnAFJESwMKYoXIaCMAVkQHAwpihchsHwBaRCcDCmKFyOQXAF5ENwMKYoXIBBMDAkQXAwpihZwEDGcCQwMKYoWcJCxrAkRrAwpihcgAJwMCREsDC
====catalogjs annotation end====*/