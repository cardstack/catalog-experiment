import { default as baseDelay } from "./dist/161.js";
import { default as baseRest } from "./dist/49.js";
import { default as toNumber } from "./toNumber.js";
var delay = baseRest(function (func, wait, args) {
  return baseDelay(func, toNumber(wait) || 0, args);
});
export { delay as default };
/*====catalogjs annotation start====
k5OVwq0uL2Rpc3QvMTYxLmpzA8LAlcKsLi9kaXN0LzQ5LmpzBsLAlcKtLi90b051bWJlci5qcwnCwIGnZGVmYXVsdJWhbKVkZWxheRPAwNwAFZehbwAAA8CRDMCZoWQJAALAkQLAwpmhaaliYXNlRGVsYXmSAhDAAKdkZWZhdWx0wMDAmKFyCwnAwJEBwMKcoWkAGAEGkMDCAMLAwJmhZAkABcCRBcDCmaFpqGJhc2VSZXN0kgUPwAGnZGVmYXVsdMDAwJihcgsIwMCRBMDCnKFpARcECZDAwgHCwMCZoWQJAAjAkQjAwpmhaah0b051bWJlcpIIEcACp2RlZmF1bHTAwMCYoXILCMDAkQfAwpyhaQEYBwqQwMICwsDAl6FvAQALEpDAmKFnAAEMwJDAwpmhZAQADcCTDQsOwMKZoWylZGVsYXmSDRTAwMALkNlFV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2RlbGF5LmpzmKFyAAXADpEMwMKYoWcDFg/Akw8QEcDCmKFyAAjAEJEEwMKYoXIoCcARkQHAwpihcgcIwMCRB8DCmKFnAQMTwJDAwpihZwkLFMCRFMDCmKFyAAXAwJEMwMI=
====catalogjs annotation end====*/