import { default as apply } from "./dist/111.js";
import { default as arrayPush } from "./dist/139.js";
import { default as baseRest } from "./dist/49.js";
import { default as castSlice } from "./dist/140.js";
import { default as toInteger } from "./toInteger.js";
var FUNC_ERROR_TEXT = 'Expected a function';
var nativeMax = Math.max;
function spread(func, start) {
  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }

  start = start == null ? 0 : nativeMax(toInteger(start), 0);
  return baseRest(function (args) {
    var array = args[start],
        otherArgs = castSlice(args, 0, start);

    if (array) {
      arrayPush(otherArgs, array);
    }

    return apply(func, this, otherArgs);
  });
}
export { spread as default };
/*====catalogjs annotation start====
k5WVwq0uL2Rpc3QvMTExLmpzA8LAlcKtLi9kaXN0LzEzOS5qcwbCwJXCrC4vZGlzdC80OS5qcwnCwJXCrS4vZGlzdC8xNDAuanMMwsCVwq4uL3RvSW50ZWdlci5qcw/CwIGnZGVmYXVsdJShbKZzcHJlYWQhwNwAI5ehbwAAA8CRF8CZoWQJAALAkQLAwpihaaVhcHBseZICH8AAp2RlZmF1bHTAwJihcgsFwMCRAcDCnKFpABgBBpDAwgDCwMCZoWQJAAXAkQXAwpihaalhcnJheVB1c2iSBR7AAadkZWZhdWx0wMCYoXILCcDAkQTAwpyhaQEYBAmQwMIBwsDAmaFkCQAIwJEIwMKYoWmoYmFzZVJlc3SSCBzAAqdkZWZhdWx0wMCYoXILCMDAkQfAwpyhaQEXBwyQwMICwsDAmaFkCQALwJELwMKYoWmpY2FzdFNsaWNlkgsdwAOnZGVmYXVsdMDAmKFyCwnAwJEKwMKcoWkBGAoPkMDCA8LAwJmhZAkADsCRDsDCmKFpqXRvSW50ZWdlcpIOG8AEp2RlZmF1bHTAwJihcgsJwMCRDcDCnKFpARkNEJDAwgTCwMCXoW8BABEgkMCYoWcAARIUkMDCmaFkBBgTwJITEcDCmKFsr0ZVTkNfRVJST1JfVEVYVJITGcDAwBHZRlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9zcHJlYWQuanOYoXIAD8DAkRLAwpihZwEBFReQwMKZoWQECxbAkhYUwMKYoWypbmF0aXZlTWF4khYawMDAFNlGV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3NwcmVhZC5qc5ihcgAJwMCRFcDCmaFkASAYwJoZGhscHR4fGBIVwMKYoWymc3ByZWFkkhgiwMDAwNlGV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3NwcmVhZC5qc5ihcgkGwBmRF8DCmKFySw/AGpESwMKYoXImCcAbkRXAwpihcgEJwByRDcDCmKFyFgjAHZEHwMKYoXJECcAekQrAwpihcioJwB+RBMDCmKFyJgXAwJEBwMKYoWcBAyHAkMDCmKFnCQsiwJEiwMKYoXIABsDAkRfAwg==
====catalogjs annotation end====*/