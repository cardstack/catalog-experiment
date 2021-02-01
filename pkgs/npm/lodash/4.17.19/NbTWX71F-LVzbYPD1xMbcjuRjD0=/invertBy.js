import { default as baseIteratee } from "./dist/6.js";
import { default as createInverter } from "./dist/76.js";
var objectProto = Object.prototype;
var hasOwnProperty = objectProto.hasOwnProperty;
var nativeObjectToString = objectProto.toString;
var invertBy = createInverter(function (result, value, key) {
  if (value != null && typeof value.toString != 'function') {
    value = nativeObjectToString.call(value);
  }

  if (hasOwnProperty.call(result, value)) {
    result[value].push(key);
  } else {
    result[value] = [key];
  }
}, baseIteratee);
export { invertBy as default };
/*====catalogjs annotation start====
k5KVwqsuL2Rpc3QvNi5qcwPCwJXCrC4vZGlzdC83Ni5qcwbCwIGnZGVmYXVsdJShbKhpbnZlcnRCeRzA3AAel6FvAAADwJEUwJmhZAkAAsCRAsDCmKFprGJhc2VJdGVyYXRlZZICGsAAp2RlZmF1bHTAwJihcgsMwMCRAcDCnKFpABYBBpDAwgDCwMCZoWQJAAXAkQXAwpihaa5jcmVhdGVJbnZlcnRlcpIFF8ABp2RlZmF1bHTAwJihcgsOwMCRBMDCnKFpARcEB5DAwgHCwMCXoW8BAAgbkMCYoWcAAQkLkMDCmaFkBBMKwJIKCMDCmKFsq29iamVjdFByb3RvkwoOEsDAwAjZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9pbnZlcnRCeS5qc5ihcgALwMCRCcDCmKFnAQEMD5DAwpmhZAQPDcCUDg0LCcDCmKFsrmhhc093blByb3BlcnR5kg0ZwMDAC9lIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2ludmVydEJ5LmpzmKFyAA7ADpEMwMKYoXIDC8DAkQnAwpihZwEBEBOQwMKZoWQECRHAlBIRDwnAwpihbLRuYXRpdmVPYmplY3RUb1N0cmluZ5IRGMDAwA/ZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9pbnZlcnRCeS5qc5ihcgAUwBKREMDCmKFyAwvAwJEJwMKYoWcBARTAkMDCmaFkBAAVwJUVExYQDMDCmKFsqGludmVydEJ5khUdwMDAE9lIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2ludmVydEJ5LmpzmKFyAAjAFpEUwMKYoWcDARfAlBcYGRrAwpihcgAOwBiRBMDCmKFyaxTAGZEQwMKYoXIZDsAakQzAwpihcmIMwMCRAcDCmKFnAQMcwJDAwpihZwkLHcCRHcDCmKFyAAjAwJEUwMI=
====catalogjs annotation end====*/