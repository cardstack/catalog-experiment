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
k5KVwqwuL2Rpc3QvOTMuanMDwsCVwq0uL3RvU3RyaW5nLmpzBsLAgadkZWZhdWx0lKFsqHBhcnNlSW50FcDcABeXoW8AAAPAkQ/AmaFkCQACwJECwMKYoWmkcm9vdJICDsAAp2RlZmF1bHTAwJihcgsEwMCRAcDCnKFpABcBBpDAwgDCwMCZoWQJAAXAkQXAwpihaah0b1N0cmluZ5IFEsABp2RlZmF1bHTAwJihcgsIwMCRBMDCnKFpARgEB5DAwgHCwMCXoW8BAAgUkMCYoWcAAQkLkMDCmaFkBAkKwJIKCMDCmKFsq3JlVHJpbVN0YXJ0kgoTwMDACNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3BhcnNlSW50LmpzmKFyAAvAwJEJwMKYoWcBAQwPkMDCmaFkBAkNwJMODQvAwpihbK5uYXRpdmVQYXJzZUludJINEcDAwAvZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9wYXJzZUludC5qc5ihcgAOwA6RDMDCmKFyAwTAwJEBwMKZoWQBFRDAlhESExAMCcDCmKFsqHBhcnNlSW50khAWwMDAwNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3BhcnNlSW50LmpzmKFyCQjAEZEPwMKYoXLMgA7AEpEMwMKYoXIBCMATkQTAwpihchELwMCRCcDCmKFnAQMVwJDAwpihZwkLFsCRFsDCmKFyAAjAwJEPwMI=
====catalogjs annotation end====*/