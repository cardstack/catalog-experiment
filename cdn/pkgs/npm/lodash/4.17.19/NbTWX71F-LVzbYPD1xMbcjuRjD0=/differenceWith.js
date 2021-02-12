import { default as baseDifference } from "./dist/61.js";
import { default as baseFlatten } from "./dist/85.js";
import { default as baseRest } from "./dist/49.js";
import { default as isArrayLikeObject } from "./isArrayLikeObject.js";
import { default as last } from "./last.js";
var differenceWith = baseRest(function (array, values) {
  var comparator = last(values);

  if (isArrayLikeObject(comparator)) {
    comparator = undefined;
  }

  return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true), undefined, comparator) : [];
});
export { differenceWith as default };
/*====catalogjs annotation start====
k5WVwqwuL2Rpc3QvNjEuanMDwsCVwqwuL2Rpc3QvODUuanMGwsCVwqwuL2Rpc3QvNDkuanMJwsCVwrYuL2lzQXJyYXlMaWtlT2JqZWN0LmpzDMLAlcKpLi9sYXN0LmpzD8LAgadkZWZhdWx0laFsrmRpZmZlcmVuY2VXaXRoHcDA3AAfl6FvAAADwJESwJmhZAkAAsCRAsDCmaFprmJhc2VEaWZmZXJlbmNlkgIZwACnZGVmYXVsdMDAwJihcgsOwMCRAcDCnKFpABcBBpDAwgDCwMCZoWQJAAXAkQXAwpmhaatiYXNlRmxhdHRlbpIFGsABp2RlZmF1bHTAwMCYoXILC8DAkQTAwpyhaQEXBAmQwMIBwsDAmaFkCQAIwJEIwMKZoWmoYmFzZVJlc3SSCBXAAqdkZWZhdWx0wMDAmKFyCwjAwJEHwMKcoWkBFwcMkMDCAsLAwJmhZAkAC8CRC8DCmaFpsWlzQXJyYXlMaWtlT2JqZWN0lAsXGBvAA6dkZWZhdWx0wMDAmKFyCxHAwJEKwMKcoWkBIQoPkMDCA8LAwJmhZAkADsCRDsDCmaFppGxhc3SSDhbABKdkZWZhdWx0wMDAmKFyCwTAwJENwMKcoWkBFA0QkMDCBMLAwJehbwEAERyQwJihZwABEsCQwMKZoWQEABPAkxMRFMDCmaFsrmRpZmZlcmVuY2VXaXRokhMewMDAEZDZTlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9kaWZmZXJlbmNlV2l0aC5qc5ihcgAOwBSREsDCmKFnAygVwJcVFhcYGRobwMKYoXIACMAWkQfAwpihci8EwBeRDcDCmKFyERHAGJEKwMKYoXI6EcAZkQrAwpihcgoOwBqRAcDCmKFyCAvAG5EEwMKYoXIMEcDAkQrAwpihZwEDHcCQwMKYoWcJCx7AkR7AwpihcgAOwMCREsDC
====catalogjs annotation end====*/