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
k5WVwq0uL2Rpc3QvMTExLmpzA8LAlcKsLi9kaXN0Lzc1LmpzB8LAlcKrLi9kaXN0LzguanMLwsCVwqwuL2Rpc3QvNDkuanMPwsCVwrAuL2lzQXJyYXlMaWtlLmpzE8LAgadkZWZhdWx0laFsqWludm9rZU1hcCDAwNwAIpehbwAAA8CRF8CZoWQJAAIEkQLAwpmhaaVhcHBseZICHcAAp2RlZmF1bHTAwMCYoXILBcDAkQHAwpyhaQABAQeRBMDCAMLAwJihZwgPwMCQwMKZoWQJAAYIkQbAwpmhaahiYXNlRWFjaJIGHMABp2RlZmF1bHTAwMCYoXILCMDAkQXAwpyhaQEBBQuRCMDCAcLAwJihZwgOwMCQwMKZoWQJAAoMkQrAwpmhaapiYXNlSW52b2tlkgoewAKnZGVmYXVsdMDAwJihcgsKwMCRCcDCnKFpAQEJD5EMwMICwsDAmKFnCA3AwJDAwpmhZAkADhCRDsDCmaFpqGJhc2VSZXN0kg4awAOnZGVmYXVsdMDAwJihcgsIwMCRDcDCnKFpAQENE5EQwMIDwsDAmKFnCA7AwJDAwpmhZAkAEhSREsDCmaFpq2lzQXJyYXlMaWtlkhIbwASnZGVmYXVsdMDAwJihcgsLwMCREcDCnKFpAQERFZEUwMIEwsDAmKFnCBLAwJDAwpehbwEAFh+QwJihZwABF8CQwMKZoWQEABjAkxgWGcDCmaFsqWludm9rZU1hcJIYIcDAwBaQ2UlXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvaW52b2tlTWFwLmpzmKFyAAnAGZEXwMKYoWcDLhrAlRobHB0ewMKYoXIACMAbkQ3AwpihcnALwByREcDCmKFyMAjAHZEFwMKYoXI/BcAekQHAwpihchYKwMCRCcDCmKFnAQMgwJDAwpihZwkLIcCRIcDCmKFyAAnAwJEXwMI=
====catalogjs annotation end====*/