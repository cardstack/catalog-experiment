import { default as arrayFilter } from "./dist/150.js";
import { default as baseIteratee } from "./dist/6.js";
import { default as baseRest } from "./dist/49.js";
import { default as baseXor } from "./dist/60.js";
import { default as isArrayLikeObject } from "./isArrayLikeObject.js";
import { default as last } from "./last.js";
var xorBy = baseRest(function (arrays) {
  var iteratee = last(arrays);

  if (isArrayLikeObject(iteratee)) {
    iteratee = undefined;
  }

  return baseXor(arrayFilter(arrays, isArrayLikeObject), baseIteratee(iteratee, 2));
});
export { xorBy as default };
/*====catalogjs annotation start====
k5aVwq0uL2Rpc3QvMTUwLmpzA8LAlcKrLi9kaXN0LzYuanMGwsCVwqwuL2Rpc3QvNDkuanMJwsCVwqwuL2Rpc3QvNjAuanMMwsCVwrYuL2lzQXJyYXlMaWtlT2JqZWN0LmpzD8LAlcKpLi9sYXN0LmpzEsLAgadkZWZhdWx0lKFspXhvckJ5IMDcACKXoW8AAAPAkRXAmaFkCQACwJECwMKYoWmrYXJyYXlGaWx0ZXKSAhzAAKdkZWZhdWx0wMCYoXILC8DAkQHAwpyhaQAYAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmsYmFzZUl0ZXJhdGVlkgUewAGnZGVmYXVsdMDAmKFyCwzAwJEEwMKcoWkBFgQJkMDCAcLAwJmhZAkACMCRCMDCmKFpqGJhc2VSZXN0kggYwAKnZGVmYXVsdMDAmKFyCwjAwJEHwMKcoWkBFwcMkMDCAsLAwJmhZAkAC8CRC8DCmKFpp2Jhc2VYb3KSCxvAA6dkZWZhdWx0wMCYoXILB8DAkQrAwpyhaQEXCg+QwMIDwsDAmaFkCQAOwJEOwMKYoWmxaXNBcnJheUxpa2VPYmplY3STDhodwASnZGVmYXVsdMDAmKFyCxHAwJENwMKcoWkBIQ0SkMDCBMLAwJmhZAkAEcCREcDCmKFppGxhc3SSERnABadkZWZhdWx0wMCYoXILBMDAkRDAwpyhaQEUEBOQwMIFwsDAl6FvAQAUH5DAmKFnAAEVwJDAwpmhZAQAFsCTFhQXwMKYoWyleG9yQnmSFiHAwMAU2UVXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMveG9yQnkuanOYoXIABcAXkRXAwpihZwMSGMCXGBkaGxwdHsDCmKFyAAjAGZEHwMKYoXImBMAakRDAwpihchERwBuRDcDCmKFyNgfAHJEKwMKYoXIBC8AdkQHAwpihcgkRwB6RDcDCmKFyAwzAwJEEwMKYoWcBAyDAkMDCmKFnCQshwJEhwMKYoXIABcDAkRXAwg==
====catalogjs annotation end====*/