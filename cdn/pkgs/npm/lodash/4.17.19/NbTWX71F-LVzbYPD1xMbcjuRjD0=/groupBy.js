import { default as baseAssignValue } from "./dist/56.js";
import { default as createAggregator } from "./dist/2.js";
var objectProto = Object.prototype;
var hasOwnProperty0 = objectProto.hasOwnProperty;
var groupBy = createAggregator(function (result, value, key) {
  if (hasOwnProperty0.call(result, key)) {
    result[key].push(value);
  } else {
    baseAssignValue(result, key, [value]);
  }
});
export { groupBy as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvNTYuanMDwsCVwqsuL2Rpc3QvMi5qcwfCwIGnZGVmYXVsdJWhbKdncm91cEJ5GcDA3AAbl6FvAAADwJESwJmhZAkAAgSRAsDCmaFpr2Jhc2VBc3NpZ25WYWx1ZZICF8AAp2RlZmF1bHTAwMCYoXILD8DAkQHAwpyhaQABAQeRBMDCAMLAwJihZwgOwMCQwMKZoWQJAAYIkQbAwpmhabBjcmVhdGVBZ2dyZWdhdG9ykgYVwAGnZGVmYXVsdMDAwJihcgsQwMCRBcDCnKFpAQEFCZEIwMIBwsDAmKFnCA3AwJDAwpehbwEAChiQwJihZwABCw2QwMKZoWQEEwzAkgwKwMKZoWyrb2JqZWN0UHJvdG+SDBDAwMAKkNlHV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2dyb3VwQnkuanOYoXIAC8DAkQvAwpihZwEBDhGQwMKZoWQEDw/AlBAPDQvAwpmhbK9oYXNPd25Qcm9wZXJ0eTCSDxbAwMANkNlHV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2dyb3VwQnkuanOYoXIAD8AQkQ7AwpihcgMLwMCRC8DCmKFnAQESwJDAwpmhZAQAE8CUExEUDsDCmaFsp2dyb3VwQnmSExrAwMARkNlHV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2dyb3VwQnkuanOYoXIAB8AUkRLAwpihZwMeFcCTFRYXwMKYoXIAEMAWkQXAwpihcicPwBeRDsDCmKFyQg/AwJEBwMKYoWcBAxnAkMDCmKFnCQsawJEawMKYoXIAB8DAkRLAwg==
====catalogjs annotation end====*/