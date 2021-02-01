import { default as root } from "./dist/93.js";
import { default as toString } from "./toString.js";
var reTrimStart = /^\s+/;
var nativeParseInt = root.parseInt;
function parseInt(string, radix, guard) {
  if (guard || radix == null) {
    radix = 0;
  } else if (radix) {
    radix = +radix;
  }

  return nativeParseInt(toString(string).replace(reTrimStart, ''), radix || 0);
}
export { parseInt as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvOTMuanMDwsCVwq0uL3RvU3RyaW5nLmpzBsLAgadkZWZhdWx0lKFsqHBhcnNlSW50FcDcABeXoW8AAAPAkMCZoWQJAALAkQLAwpihaaRyb290kgIOwACnZGVmYXVsdMDAmKFyCwTAwJEBwMKcoWkAFwEGkMDCAMLAwJmhZAkABcCRBcDCmKFpqHRvU3RyaW5nkgUSwAGnZGVmYXVsdMDAmKFyCwjAwJEEwMKcoWkBGAQHkMDCAcLAwJehbwEACBSQwJihZwABCQuQwMKZoWQECQrAkgoIwMKYoWyrcmVUcmltU3RhcnSSChPAwMAI2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvcGFyc2VJbnQuanOYoXIAC8DAkQnAwpihZwEBDA+QwMKZoWQECQ3Akw4NC8DCmKFsrm5hdGl2ZVBhcnNlSW50kg0RwMDAC9lIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3BhcnNlSW50LmpzmKFyAA7ADpEMwMKYoXIDBMDAkQHAwpmhZAEVEMCWERITEAwJwMKYoWyocGFyc2VJbnSSEBbAwMDA2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvcGFyc2VJbnQuanOYoXIJCMARkQ/AwpihcsyADsASkQzAwpihcgEIwBORBMDCmKFyEQvAwJEJwMKYoWcBAxXAkMDCmKFnCQsWwJEWwMKYoXIACMDAkQ/Awg==
====catalogjs annotation end====*/