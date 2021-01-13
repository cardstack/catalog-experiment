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
k5WVwqwuL2Rpc3QvNjEuanMDwsCVwqwuL2Rpc3QvODUuanMGwsCVwqwuL2Rpc3QvNDkuanMJwsCVwrYuL2lzQXJyYXlMaWtlT2JqZWN0LmpzDMLAlcKpLi9sYXN0LmpzD8LAgadkZWZhdWx0lKFsrmRpZmZlcmVuY2VXaXRoHcDcAB+XoW8AAAPAkRLAmaFkCQACwJECwMKYoWmuYmFzZURpZmZlcmVuY2WSAhnAAKdkZWZhdWx0wMCYoXILDsDAkQHAwpyhaQAXAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmrYmFzZUZsYXR0ZW6SBRrAAadkZWZhdWx0wMCYoXILC8DAkQTAwpyhaQEXBAmQwMIBwsDAmaFkCQAIwJEIwMKYoWmoYmFzZVJlc3SSCBXAAqdkZWZhdWx0wMCYoXILCMDAkQfAwpyhaQEXBwyQwMICwsDAmaFkCQALwJELwMKYoWmxaXNBcnJheUxpa2VPYmplY3SUCxcYG8ADp2RlZmF1bHTAwJihcgsRwMCRCsDCnKFpASEKD5DAwgPCwMCZoWQJAA7AkQ7AwpihaaRsYXN0kg4WwASnZGVmYXVsdMDAmKFyCwTAwJENwMKcoWkBFA0QkMDCBMLAwJehbwEAERyQwJihZwABEsCQwMKZoWQEABPAkxMRFMDCmKFsrmRpZmZlcmVuY2VXaXRokhMewMDAEdlOV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2RpZmZlcmVuY2VXaXRoLmpzmKFyAA7AFJESwMKYoWcDKBXAmBUWFxgZGhsSwMKYoXIACMAWkQfAwpihci8EwBeRDcDCmKFyERHAGJEKwMKYoXI6EcAZkQrAwpihcgoOwBqRAcDCmKFyCAvAG5EEwMKYoXIMEcDAkQrAwpihZwEDHcCQwMKYoWcJCx7AkR7AwpihcgAOwMCREsDC
====catalogjs annotation end====*/