import { default as baseInvoke } from "./dist/8.js";
import { default as baseRest } from "./dist/49.js";
var methodOf = baseRest(function (object, args) {
  return function (path) {
    return baseInvoke(object, path, args);
  };
});
export { methodOf as default };
/*====catalogjs annotation start====
k5KVwqsuL2Rpc3QvOC5qcwPCwJXCrC4vZGlzdC80OS5qcwbCwIGnZGVmYXVsdJWhbKhtZXRob2RPZg/AwNwAEZehbwAAA8CRCcCZoWQJAALAkQLAwpmhaapiYXNlSW52b2tlkgINwACnZGVmYXVsdMDAwJihcgsKwMCRAcDCnKFpABYBBpDAwgDCwMCZoWQJAAXAkQXAwpmhaahiYXNlUmVzdJIFDMABp2RlZmF1bHTAwMCYoXILCMDAkQTAwpyhaQEXBAeQwMIBwsDAl6FvAQAIDpDAmKFnAAEJwJDAwpmhZAQACsCTCggLwMKZoWyobWV0aG9kT2aSChDAwMAIkNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL21ldGhvZE9mLmpzmKFyAAjAC5EJwMKYoWcDHQzAkgwNwMKYoXIACMANkQTAwpihckEKwMCRAcDCmKFnAQMPwJDAwpihZwkLEMCREMDCmKFyAAjAwJEJwMI=
====catalogjs annotation end====*/