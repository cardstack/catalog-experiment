import { default as baseFlatten } from "./dist/85.js";
import { default as baseRest } from "./dist/49.js";
import { default as baseUniq } from "./dist/63.js";
import { default as isArrayLikeObject } from "./isArrayLikeObject.js";
import { default as last } from "./last.js";
var unionWith = baseRest(function (arrays) {
  var comparator = last(arrays);
  comparator = typeof comparator == 'function' ? comparator : undefined;
  return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), undefined, comparator);
});
export { unionWith as default };
/*====catalogjs annotation start====
k5WVwqwuL2Rpc3QvODUuanMDwsCVwqwuL2Rpc3QvNDkuanMGwsCVwqwuL2Rpc3QvNjMuanMJwsCVwrYuL2lzQXJyYXlMaWtlT2JqZWN0LmpzDMLAlcKpLi9sYXN0LmpzD8LAgadkZWZhdWx0lKFsqXVuaW9uV2l0aBvA3AAdl6FvAAADwJESwJmhZAkAAsCRAsDCmKFpq2Jhc2VGbGF0dGVukgIYwACnZGVmYXVsdMDAmKFyCwvAwJEBwMKcoWkAFwEGkMDCAMLAwJmhZAkABcCRBcDCmKFpqGJhc2VSZXN0kgUVwAGnZGVmYXVsdMDAmKFyCwjAwJEEwMKcoWkBFwQJkMDCAcLAwJmhZAkACMCRCMDCmKFpqGJhc2VVbmlxkggXwAKnZGVmYXVsdMDAmKFyCwjAwJEHwMKcoWkBFwcMkMDCAsLAwJmhZAkAC8CRC8DCmKFpsWlzQXJyYXlMaWtlT2JqZWN0kgsZwAOnZGVmYXVsdMDAmKFyCxHAwJEKwMKcoWkBIQoPkMDCA8LAwJmhZAkADsCRDsDCmKFppGxhc3SSDhbABKdkZWZhdWx0wMCYoXILBMDAkQ3AwpyhaQEUDRCQwMIEwsDAl6FvAQARGpDAmKFnAAESwJDAwpmhZAQAE8CTExEUwMKYoWypdW5pb25XaXRokhMcwMDAEdlJV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3VuaW9uV2l0aC5qc5ihcgAJwBSREsDCmKFnAyMVwJYVFhcYGRLAwpihcgAIwBaRBMDCmKFyKATAF5ENwMKYoXJcCMAYkQfAwpihcgELwBmRAcDCmKFyDBHAwJEKwMKYoWcBAxvAkMDCmKFnCQscwJEcwMKYoXIACcDAkRLAwg==
====catalogjs annotation end====*/