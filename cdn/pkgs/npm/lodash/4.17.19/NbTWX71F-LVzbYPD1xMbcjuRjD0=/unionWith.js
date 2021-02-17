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
k5WVwqwuL2Rpc3QvODUuanMDwsCVwqwuL2Rpc3QvNDkuanMHwsCVwqwuL2Rpc3QvNjMuanMLwsCVwrYuL2lzQXJyYXlMaWtlT2JqZWN0LmpzD8LAlcKpLi9sYXN0LmpzE8LAgadkZWZhdWx0laFsqXVuaW9uV2l0aCDAwNwAIpehbwAAA8CRF8CZoWQJAAIEkQLAwpmhaatiYXNlRmxhdHRlbpICHcAAp2RlZmF1bHTAwMCYoXILC8DAkQHAwpyhaQABAQeRBMDCAMLAwJihZwgOwMCQwMKZoWQJAAYIkQbAwpmhaahiYXNlUmVzdJIGGsABp2RlZmF1bHTAwMCYoXILCMDAkQXAwpyhaQEBBQuRCMDCAcLAwJihZwgOwMCQwMKZoWQJAAoMkQrAwpmhaahiYXNlVW5pcZIKHMACp2RlZmF1bHTAwMCYoXILCMDAkQnAwpyhaQEBCQ+RDMDCAsLAwJihZwgOwMCQwMKZoWQJAA4QkQ7AwpmhabFpc0FycmF5TGlrZU9iamVjdJIOHsADp2RlZmF1bHTAwMCYoXILEcDAkQ3AwpyhaQEBDROREMDCA8LAwJihZwgYwMCQwMKZoWQJABIUkRLAwpmhaaRsYXN0khIbwASnZGVmYXVsdMDAwJihcgsEwMCREcDCnKFpAQERFZEUwMIEwsDAmKFnCAvAwJDAwpehbwEAFh+QwJihZwABF8CQwMKZoWQEABjAkxgWGcDCmaFsqXVuaW9uV2l0aJIYIcDAwBaQ2UlXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvdW5pb25XaXRoLmpzmKFyAAnAGZEXwMKYoWcDIxrAlRobHB0ewMKYoXIACMAbkQXAwpihcigEwByREcDCmKFyXAjAHZEJwMKYoXIBC8AekQHAwpihcgwRwMCRDcDCmKFnAQMgwJDAwpihZwkLIcCRIcDCmKFyAAnAwJEXwMI=
====catalogjs annotation end====*/