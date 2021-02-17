import { default as root } from "./dist/93.js";
import { default as toString0 } from "./toString.js";
var reTrimStart = /^\s+/;
var nativeParseInt = root.parseInt;
function parseInt0(string, radix, guard) {
  if (guard || radix == null) {
    radix = 0;
  } else if (radix) {
    radix = +radix;
  }

  return nativeParseInt(toString0(string).replace(reTrimStart, ''), radix || 0);
}
export { parseInt0 as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvOTMuanMDwsCVwq0uL3RvU3RyaW5nLmpzB8LAgadkZWZhdWx0laFsqXBhcnNlSW50MBfAwNwAGZehbwAAA8CQwJmhZAkAAgSRAsDCmaFppHJvb3SSAhDAAKdkZWZhdWx0wMDAmKFyCwTAwJEBwMKcoWkAAQEHkQTAwgDCwMCYoWcIDsDAkMDCmaFkCQAGCJEGwMKZoWmpdG9TdHJpbmcwkgYUwAGnZGVmYXVsdMDAwJihcgsJwMCRBcDCnKFpAQEFCZEIwMIBwsDAmKFnCA/AwJDAwpehbwEAChaQwJihZwABCw2QwMKZoWQECQzAkgwKwMKZoWyrcmVUcmltU3RhcnSSDBXAwMAKkNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3BhcnNlSW50LmpzmKFyAAvAwJELwMKYoWcBAQ4RkMDCmaFkBAkPwJMQDw3AwpmhbK5uYXRpdmVQYXJzZUludJIPE8DAwA2Q2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvcGFyc2VJbnQuanOYoXIADsAQkQ7AwpihcgMEwMCRAcDCmaFkARUSwJYTFBUSDgvAwpmhbKlwYXJzZUludDCSEhjAwMDAkNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3BhcnNlSW50LmpzmKFyCQnAE5ERwMKYoXLMgA7AFJEOwMKYoXIBCcAVkQXAwpihchELwMCRC8DCmKFnAQMXwJDAwpihZwkLGMCRGMDCmKFyAAnAwJERwMI=
====catalogjs annotation end====*/