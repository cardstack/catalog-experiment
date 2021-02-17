import { default as baseAssignValue } from "./dist/56.js";
import { default as createAggregator } from "./dist/2.js";
var objectProto = Object.prototype;
var hasOwnProperty0 = objectProto.hasOwnProperty;
var countBy = createAggregator(function (result, value, key) {
  if (hasOwnProperty0.call(result, key)) {
    ++result[key];
  } else {
    baseAssignValue(result, key, 1);
  }
});
export { countBy as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvNTYuanMDwsCVwqsuL2Rpc3QvMi5qcwfCwIGnZGVmYXVsdJWhbKdjb3VudEJ5GcDA3AAbl6FvAAADwJESwJmhZAkAAgSRAsDCmaFpr2Jhc2VBc3NpZ25WYWx1ZZICF8AAp2RlZmF1bHTAwMCYoXILD8DAkQHAwpyhaQABAQeRBMDCAMLAwJihZwgOwMCQwMKZoWQJAAYIkQbAwpmhabBjcmVhdGVBZ2dyZWdhdG9ykgYVwAGnZGVmYXVsdMDAwJihcgsQwMCRBcDCnKFpAQEFCZEIwMIBwsDAmKFnCA3AwJDAwpehbwEAChiQwJihZwABCw2QwMKZoWQEEwzAkgwKwMKZoWyrb2JqZWN0UHJvdG+SDBDAwMAKkNlHV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2NvdW50QnkuanOYoXIAC8DAkQvAwpihZwEBDhGQwMKZoWQEDw/AlBAPDQvAwpmhbK9oYXNPd25Qcm9wZXJ0eTCSDxbAwMANkNlHV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2NvdW50QnkuanOYoXIAD8AQkQ7AwpihcgMLwMCRC8DCmKFnAQESwJDAwpmhZAQAE8CUExEUDsDCmaFsp2NvdW50QnmSExrAwMARkNlHV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2NvdW50QnkuanOYoXIAB8AUkRLAwpihZwMYFcCTFRYXwMKYoXIAEMAWkQXAwpihcicPwBeRDsDCmKFyOA/AwJEBwMKYoWcBAxnAkMDCmKFnCQsawJEawMKYoXIAB8DAkRLAwg==
====catalogjs annotation end====*/