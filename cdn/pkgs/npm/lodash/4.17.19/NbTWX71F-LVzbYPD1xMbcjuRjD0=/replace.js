import { default as toString0 } from "./toString.js";
function replace() {
  var args = arguments,
      string = toString0(args[0]);
  return args.length < 3 ? string : string.replace(args[1], args[2]);
}
export { replace as default };
/*====catalogjs annotation start====
k5GVwq0uL3RvU3RyaW5nLmpzA8LAgadkZWZhdWx0laFsp3JlcGxhY2UJwMCbl6FvAAADwJDAmaFkCQACwJECwMKZoWmpdG9TdHJpbmcwkgIHwACnZGVmYXVsdMDAwJihcgsJwMCRAcDCnKFpABgBBJDAwgDCwMCXoW8BAAUIkMCZoWQAUgbAkgcGwMKZoWyncmVwbGFjZZIGCsDAwMCQ2UdXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvcmVwbGFjZS5qc5ihcgkHwAeRBcDCmKFyLAnAwJEBwMKYoWcBAwnAkMDCmKFnCQsKwJEKwMKYoXIAB8DAkQXAwg==
====catalogjs annotation end====*/