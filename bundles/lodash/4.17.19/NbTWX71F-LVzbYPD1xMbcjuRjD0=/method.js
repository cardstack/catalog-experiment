import { default as baseInvoke } from "./dist/8.js";
import { default as baseRest } from "./dist/49.js";
var method = baseRest(function (path, args) {
  return function (object) {
    return baseInvoke(object, path, args);
  };
});
export { method as default };
/*====catalogjs annotation start====
k5KVwqsuL2Rpc3QvOC5qcwPCwJXCrC4vZGlzdC80OS5qcwbCwIGnZGVmYXVsdJShbKZtZXRob2QPwNwAEZehbwAAA8CRCcCZoWQJAALAkQLAwpihaapiYXNlSW52b2tlkgINwACnZGVmYXVsdMDAmKFyCwrAwJEBwMKcoWkAFgEGkMDCAMLAwJmhZAkABcCRBcDCmKFpqGJhc2VSZXN0kgUMwAGnZGVmYXVsdMDAmKFyCwjAwJEEwMKcoWkBFwQHkMDCAcLAwJehbwEACA6QwJihZwABCcCQwMKZoWQEAArAkwoIC8DCmKFspm1ldGhvZJIKEMDAwAjZRlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9tZXRob2QuanOYoXIABsALkQnAwpihZwMdDMCTDA0JwMKYoXIACMANkQTAwpihckEKwMCRAcDCmKFnAQMPwJDAwpihZwkLEMCREMDCmKFyAAbAwJEJwMI=
====catalogjs annotation end====*/