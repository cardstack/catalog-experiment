import { default as apply } from "./dist/111.js";
import { default as baseRest } from "./dist/49.js";
import { default as isError } from "./isError.js";
var attempt = baseRest(function (func, args) {
  try {
    return apply(func, undefined, args);
  } catch (e) {
    return isError(e) ? e : new Error(e);
  }
});
export { attempt as default };
/*====catalogjs annotation start====
k5OVwq0uL2Rpc3QvMTExLmpzA8LAlcKsLi9kaXN0LzQ5LmpzBsLAlcKsLi9pc0Vycm9yLmpzCcLAgadkZWZhdWx0lKFsp2F0dGVtcHQTwNwAFZehbwAAA8CRDMCZoWQJAALAkQLAwpihaaVhcHBseZICEMAAp2RlZmF1bHTAwJihcgsFwMCRAcDCnKFpABgBBpDAwgDCwMCZoWQJAAXAkQXAwpihaahiYXNlUmVzdJIFD8ABp2RlZmF1bHTAwJihcgsIwMCRBMDCnKFpARcECZDAwgHCwMCZoWQJAAjAkQjAwpihaadpc0Vycm9ykggRwAKnZGVmYXVsdMDAmKFyCwfAwJEHwMKcoWkBFwcKkMDCAsLAwJehbwEACxKQwJihZwABDMCQwMKZoWQEAA3Akw0LDsDCmKFsp2F0dGVtcHSSDRTAwMAL2UdXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvYXR0ZW1wdC5qc5ihcgAHwA6RDMDCmKFnAx4PwJQPEBEMwMKYoXIACMAQkQTAwpihciwFwBGRAcDCmKFyNAfAwJEHwMKYoWcBAxPAkMDCmKFnCQsUwJEUwMKYoXIAB8DAkQzAwg==
====catalogjs annotation end====*/