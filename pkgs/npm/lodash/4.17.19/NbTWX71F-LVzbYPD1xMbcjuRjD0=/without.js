import { default as baseDifference } from "./dist/61.js";
import { default as baseRest } from "./dist/49.js";
import { default as isArrayLikeObject } from "./isArrayLikeObject.js";
var without = baseRest(function (array, values) {
  return isArrayLikeObject(array) ? baseDifference(array, values) : [];
});
export { without as default };
/*====catalogjs annotation start====
k5OVwqwuL2Rpc3QvNjEuanMDwsCVwqwuL2Rpc3QvNDkuanMGwsCVwrYuL2lzQXJyYXlMaWtlT2JqZWN0LmpzCcLAgadkZWZhdWx0lKFsp3dpdGhvdXQTwNwAFZehbwAAA8CRDMCZoWQJAALAkQLAwpihaa5iYXNlRGlmZmVyZW5jZZICEcAAp2RlZmF1bHTAwJihcgsOwMCRAcDCnKFpABcBBpDAwgDCwMCZoWQJAAXAkQXAwpihaahiYXNlUmVzdJIFD8ABp2RlZmF1bHTAwJihcgsIwMCRBMDCnKFpARcECZDAwgHCwMCZoWQJAAjAkQjAwpihabFpc0FycmF5TGlrZU9iamVjdJIIEMACp2RlZmF1bHTAwJihcgsRwMCRB8DCnKFpASEHCpDAwgLCwMCXoW8BAAsSkMCYoWcAAQzAkMDCmaFkBAANwJMNCw7AwpihbKd3aXRob3V0kg0UwMDAC9lHV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3dpdGhvdXQuanOYoXIAB8AOkQzAwpihZwMYD8CTDxARwMKYoXIACMAQkQTAwpihciURwBGRB8DCmKFyCg7AwJEBwMKYoWcBAxPAkMDCmKFnCQsUwJEUwMKYoXIAB8DAkQzAwg==
====catalogjs annotation end====*/