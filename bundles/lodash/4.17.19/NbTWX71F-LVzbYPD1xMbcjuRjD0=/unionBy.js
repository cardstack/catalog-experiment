import { default as baseFlatten } from "./dist/85.js";
import { default as baseIteratee } from "./dist/6.js";
import { default as baseRest } from "./dist/49.js";
import { default as baseUniq } from "./dist/63.js";
import { default as isArrayLikeObject } from "./isArrayLikeObject.js";
import { default as last } from "./last.js";
var unionBy = baseRest(function (arrays) {
  var iteratee = last(arrays);

  if (isArrayLikeObject(iteratee)) {
    iteratee = undefined;
  }

  return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), baseIteratee(iteratee, 2));
});
export { unionBy as default };
/*====catalogjs annotation start====
k5aVwqwuL2Rpc3QvODUuanMDwsCVwqsuL2Rpc3QvNi5qcwbCwJXCrC4vZGlzdC80OS5qcwnCwJXCrC4vZGlzdC82My5qcwzCwJXCti4vaXNBcnJheUxpa2VPYmplY3QuanMPwsCVwqkuL2xhc3QuanMSwsCBp2RlZmF1bHSUoWyndW5pb25CeSDA3AAil6FvAAADwJEVwJmhZAkAAsCRAsDCmKFpq2Jhc2VGbGF0dGVukgIcwACnZGVmYXVsdMDAmKFyCwvAwJEBwMKcoWkAFwEGkMDCAMLAwJmhZAkABcCRBcDCmKFprGJhc2VJdGVyYXRlZZIFHsABp2RlZmF1bHTAwJihcgsMwMCRBMDCnKFpARYECZDAwgHCwMCZoWQJAAjAkQjAwpihaahiYXNlUmVzdJIIGMACp2RlZmF1bHTAwJihcgsIwMCRB8DCnKFpARcHDJDAwgLCwMCZoWQJAAvAkQvAwpihaahiYXNlVW5pcZILG8ADp2RlZmF1bHTAwJihcgsIwMCRCsDCnKFpARcKD5DAwgPCwMCZoWQJAA7AkQ7AwpihabFpc0FycmF5TGlrZU9iamVjdJMOGh3ABKdkZWZhdWx0wMCYoXILEcDAkQ3AwpyhaQEhDRKQwMIEwsDAmaFkCQARwJERwMKYoWmkbGFzdJIRGcAFp2RlZmF1bHTAwJihcgsEwMCREMDCnKFpARQQE5DAwgXCwMCXoW8BABQfkMCYoWcAARXAkMDCmaFkBAAWwJMWFBfAwpihbKd1bmlvbkJ5khYhwMDAFNlHV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3VuaW9uQnkuanOYoXIAB8AXkRXAwpihZwMSGMCYGBkaGxwdHhXAwpihcgAIwBmRB8DCmKFyJgTAGpEQwMKYoXIREcAbkQ3AwpihcjYIwByRCsDCmKFyAQvAHZEBwMKYoXIMEcAekQ3AwpihcgkMwMCRBMDCmKFnAQMgwJDAwpihZwkLIcCRIcDCmKFyAAfAwJEVwMI=
====catalogjs annotation end====*/