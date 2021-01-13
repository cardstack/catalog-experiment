import { default as constant } from "./constant.js";
import { default as createInverter } from "./dist/76.js";
import { default as identity } from "./identity.js";
var objectProto = Object.prototype;
var nativeObjectToString = objectProto.toString;
var invert = createInverter(function (result, value, key) {
  if (value != null && typeof value.toString != 'function') {
    value = nativeObjectToString.call(value);
  }

  result[value] = key;
}, constant(identity));
export { invert as default };
/*====catalogjs annotation start====
k5OVwq0uL2NvbnN0YW50LmpzA8LAlcKsLi9kaXN0Lzc2LmpzBsLAlcKtLi9pZGVudGl0eS5qcwnCwIGnZGVmYXVsdJShbKZpbnZlcnQbwNwAHZehbwAAA8CRE8CZoWQJAALAkQLAwpihaahjb25zdGFudJICGMAAp2RlZmF1bHTAwJihcgsIwMCRAcDCnKFpABgBBpDAwgDCwMCZoWQJAAXAkQXAwpihaa5jcmVhdGVJbnZlcnRlcpIFFsABp2RlZmF1bHTAwJihcgsOwMCRBMDCnKFpARcECZDAwgHCwMCZoWQJAAjAkQjAwpihaahpZGVudGl0eZIIGcACp2RlZmF1bHTAwJihcgsIwMCRB8DCnKFpARgHCpDAwgLCwMCXoW8BAAsakMCYoWcAAQwOkMDCmaFkBBMNwJINC8DCmKFsq29iamVjdFByb3Rvkg0RwMDAC9lGV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2ludmVydC5qc5ihcgALwMCRDMDCmKFnAQEPEpDAwpmhZAQJEMCUERAODMDCmKFstG5hdGl2ZU9iamVjdFRvU3RyaW5nkhAXwMDADtlGV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2ludmVydC5qc5ihcgAUwBGRD8DCmKFyAwvAwJEMwMKYoWcBARPAkMDCmaFkBAAUwJQUEhUPwMKYoWymaW52ZXJ0khQcwMDAEtlGV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2ludmVydC5qc5ihcgAGwBWRE8DCmKFnAwIWwJUWFxgZE8DCmKFyAA7AF5EEwMKYoXJrFMAYkQ/Awpihci0IwBmRAcDCmKFyAQjAwJEHwMKYoWcBAxvAkMDCmKFnCQscwJEcwMKYoXIABsDAkRPAwg==
====catalogjs annotation end====*/