import { default as baseRest } from "./dist/49.js";
import { default as unzipWith } from "./unzipWith.js";
var zipWith = baseRest(function (arrays) {
  var length = arrays.length,
      iteratee = length > 1 ? arrays[length - 1] : undefined;
  iteratee = typeof iteratee == 'function' ? (arrays.pop(), iteratee) : undefined;
  return unzipWith(arrays, iteratee);
});
export { zipWith as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvNDkuanMDwsCVwq4uL3VuemlwV2l0aC5qcwbCwIGnZGVmYXVsdJWhbKd6aXBXaXRoD8DA3AARl6FvAAADwJEJwJmhZAkAAsCRAsDCmaFpqGJhc2VSZXN0kgIMwACnZGVmYXVsdMDAwJihcgsIwMCRAcDCnKFpABcBBpDAwgDCwMCZoWQJAAXAkQXAwpmhaal1bnppcFdpdGiSBQ3AAadkZWZhdWx0wMDAmKFyCwnAwJEEwMKcoWkBGQQHkMDCAcLAwJehbwEACA6QwJihZwABCcCQwMKZoWQEAArAkwoIC8DCmaFsp3ppcFdpdGiSChDAwMAIkNlHV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3ppcFdpdGguanOYoXIAB8ALkQnAwpihZwMWDMCSDA3AwpihcgAIwA2RAcDCmKFyzM0JwMCRBMDCmKFnAQMPwJDAwpihZwkLEMCREMDCmKFyAAfAwJEJwMI=
====catalogjs annotation end====*/