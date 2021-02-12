import { default as baseAssignValue } from "./56.js";
import { default as eq } from "../eq.js";
var objectProto = Object.prototype;
var hasOwnProperty0 = objectProto.hasOwnProperty;
function assignValue(object, key, value) {
  var objValue = object[key];

  if (!(hasOwnProperty0.call(object, key) && eq(objValue, value)) || value === undefined && !(key in object)) {
    baseAssignValue(object, key, value);
  }
}
export { assignValue as default };
/*====catalogjs annotation start====
k5KVwqcuLzU2LmpzA8LAlcKoLi4vZXEuanMGwsCBp2RlZmF1bHSVoWyrYXNzaWduVmFsdWUVwMDcABeXoW8AAAPAkMCZoWQJAALAkQLAwpmhaa9iYXNlQXNzaWduVmFsdWWSAhPAAKdkZWZhdWx0wMDAmKFyCw/AwJEBwMKcoWkAEgEGkMDCAMLAwJmhZAkABcCRBcDCmaFpomVxkgUSwAGnZGVmYXVsdMDAwJihcgsCwMCRBMDCnKFpARMEB5DAwgHCwMCXoW8BAAgUkMCYoWcAAQkLkMDCmaFkBBMKwJIKCMDCmaFsq29iamVjdFByb3RvkgoOwMDACJDZTFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYXNzaWduVmFsdWUuanOYoXIAC8DAkQnAwpihZwEBDA+QwMKZoWQEDw3AlA4NCwnAwpmhbK9oYXNPd25Qcm9wZXJ0eTCSDRHAwMALkNlMV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19hc3NpZ25WYWx1ZS5qc5ihcgAPwA6RDMDCmKFyAwvAwJEJwMKZoWQBGxDAlRESExAMwMKZoWyrYXNzaWduVmFsdWWSEBbAwMDAkNlMV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19hc3NpZ25WYWx1ZS5qc5ihcgkLwBGRD8DCmKFyPg/AEpEMwMKYoXIWAsATkQTAwpihckUPwMCRAcDCmKFnAQMVwJDAwpihZwkLFsCRFsDCmKFyAAvAwJEPwMI=
====catalogjs annotation end====*/