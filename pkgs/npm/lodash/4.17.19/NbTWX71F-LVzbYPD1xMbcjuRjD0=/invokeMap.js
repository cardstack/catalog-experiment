import { default as apply } from "./dist/111.js";
import { default as baseEach } from "./dist/75.js";
import { default as baseInvoke } from "./dist/8.js";
import { default as baseRest } from "./dist/49.js";
import { default as isArrayLike } from "./isArrayLike.js";
var invokeMap = baseRest(function (collection, path, args) {
  var index = -1,
      isFunc = typeof path == 'function',
      result = isArrayLike(collection) ? Array(collection.length) : [];
  baseEach(collection, function (value) {
    result[++index] = isFunc ? apply(path, value, args) : baseInvoke(value, path, args);
  });
  return result;
});
export { invokeMap as default };
/*====catalogjs annotation start====
k5WVwq0uL2Rpc3QvMTExLmpzA8LAlcKsLi9kaXN0Lzc1LmpzBsLAlcKrLi9kaXN0LzguanMJwsCVwqwuL2Rpc3QvNDkuanMMwsCVwrAuL2lzQXJyYXlMaWtlLmpzD8LAgadkZWZhdWx0lKFsqWludm9rZU1hcBvA3AAdl6FvAAADwJESwJmhZAkAAsCRAsDCmKFppWFwcGx5kgIYwACnZGVmYXVsdMDAmKFyCwXAwJEBwMKcoWkAGAEGkMDCAMLAwJmhZAkABcCRBcDCmKFpqGJhc2VFYWNokgUXwAGnZGVmYXVsdMDAmKFyCwjAwJEEwMKcoWkBFwQJkMDCAcLAwJmhZAkACMCRCMDCmKFpqmJhc2VJbnZva2WSCBnAAqdkZWZhdWx0wMCYoXILCsDAkQfAwpyhaQEWBwyQwMICwsDAmaFkCQALwJELwMKYoWmoYmFzZVJlc3SSCxXAA6dkZWZhdWx0wMCYoXILCMDAkQrAwpyhaQEXCg+QwMIDwsDAmaFkCQAOwJEOwMKYoWmraXNBcnJheUxpa2WSDhbABKdkZWZhdWx0wMCYoXILC8DAkQ3AwpyhaQEbDRCQwMIEwsDAl6FvAQARGpDAmKFnAAESwJDAwpmhZAQAE8CTExEUwMKYoWypaW52b2tlTWFwkhMcwMDAEdlJV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2ludm9rZU1hcC5qc5ihcgAJwBSREsDCmKFnAy4VwJUVFhcYGcDCmKFyAAjAFpEKwMKYoXJwC8AXkQ3AwpihcjAIwBiRBMDCmKFyPwXAGZEBwMKYoXIWCsDAkQfAwpihZwEDG8CQwMKYoWcJCxzAkRzAwpihcgAJwMCREsDC
====catalogjs annotation end====*/