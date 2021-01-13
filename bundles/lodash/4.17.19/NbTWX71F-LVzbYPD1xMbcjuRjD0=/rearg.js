import { default as createWrap } from "./dist/23.js";
import { default as flatRest } from "./dist/50.js";
var WRAP_REARG_FLAG = 256;
var rearg = flatRest(function (func, indexes) {
  return createWrap(func, WRAP_REARG_FLAG, undefined, undefined, undefined, indexes);
});
export { rearg as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvMjMuanMDwsCVwqwuL2Rpc3QvNTAuanMGwsCBp2RlZmF1bHSUoWylcmVhcmcTwNwAFZehbwAAA8CRDMCZoWQJAALAkQLAwpihaapjcmVhdGVXcmFwkgIQwACnZGVmYXVsdMDAmKFyCwrAwJEBwMKcoWkAFwEGkMDCAMLAwJmhZAkABcCRBcDCmKFpqGZsYXRSZXN0kgUPwAGnZGVmYXVsdMDAmKFyCwjAwJEEwMKcoWkBFwQHkMDCAcLAwJehbwEACBKQwJihZwABCQuQwMKZoWQEBgrAkgoIwMKYoWyvV1JBUF9SRUFSR19GTEFHkgoRwMDACNlFV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3JlYXJnLmpzmKFyAA/AwJEJwMKYoWcBAQzAkMDCmaFkBAANwJQNCw4JwMKYoWylcmVhcmeSDRTAwMAL2UVXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvcmVhcmcuanOYoXIABcAOkQzAwpihZwMvD8CUDxARDMDCmKFyAAjAEJEEwMKYoXIlCsARkQHAwpihcgcPwMCRCcDCmKFnAQMTwJDAwpihZwkLFMCRFMDCmKFyAAXAwJEMwMI=
====catalogjs annotation end====*/