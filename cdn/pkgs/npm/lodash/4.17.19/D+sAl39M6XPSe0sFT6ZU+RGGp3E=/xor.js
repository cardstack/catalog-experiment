import { default as arrayFilter } from "./dist/150.js";
import { default as baseRest } from "./dist/49.js";
import { default as baseXor } from "./dist/60.js";
import { default as isArrayLikeObject } from "./isArrayLikeObject.js";
var xor = baseRest(function (arrays) {
  return baseXor(arrayFilter(arrays, isArrayLikeObject));
});
export { xor as default };
/*====catalogjs annotation start====
k5SVwq0uL2Rpc3QvMTUwLmpzA8LAlcKsLi9kaXN0LzQ5LmpzB8LAlcKsLi9kaXN0LzYwLmpzC8LAlcK2Li9pc0FycmF5TGlrZU9iamVjdC5qcw/CwIGnZGVmYXVsdJWhbKN4b3IbwMDcAB2XoW8AAAPAkRPAmaFkCQACBJECwMKZoWmrYXJyYXlGaWx0ZXKSAhjAAKdkZWZhdWx0wMDAmKFyCwvAwJEBwMKcoWkAAQEHkQTAwgDCwMCYoWcID8DAkMDCmaFkCQAGCJEGwMKZoWmoYmFzZVJlc3SSBhbAAadkZWZhdWx0wMDAmKFyCwjAwJEFwMKcoWkBAQULkQjAwgHCwMCYoWcIDsDAkMDCmaFkCQAKDJEKwMKZoWmnYmFzZVhvcpIKF8ACp2RlZmF1bHTAwMCYoXILB8DAkQnAwpyhaQEBCQ+RDMDCAsLAwJihZwgOwMCQwMKZoWQJAA4QkQ7AwpmhabFpc0FycmF5TGlrZU9iamVjdJIOGcADp2RlZmF1bHTAwMCYoXILEcDAkQ3AwpyhaQEBDRGREMDCA8LAwJihZwgYwMCQwMKXoW8BABIakMCYoWcAARPAkMDCmaFkBAAUwJMUEhXAwpmhbKN4b3KSFBzAwMASkNlDV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3hvci5qc5ihcgADwBWRE8DCmKFnAwYWwJQWFxgZwMKYoXIACMAXkQXAwpihch4HwBiRCcDCmKFyAQvAGZEBwMKYoXIJEcDAkQ3AwpihZwEDG8CQwMKYoWcJCxzAkRzAwpihcgADwMCRE8DC
====catalogjs annotation end====*/