import { default as baseSlice } from "./dist/142.js";
function initial(array) {
  var length = array == null ? 0 : array.length;
  return length ? baseSlice(array, 0, -1) : [];
}
export { initial as default };
/*====catalogjs annotation start====
k5GVwq0uL2Rpc3QvMTQyLmpzA8LAgadkZWZhdWx0laFsp2luaXRpYWwJwMCbl6FvAAADwJDAmaFkCQACwJECwMKZoWmpYmFzZVNsaWNlkgIHwACnZGVmYXVsdMDAwJihcgsJwMCRAcDCnKFpABgBBJDAwgDCwMCXoW8BAAUIkMCZoWQAFgbAkgcGwMKZoWynaW5pdGlhbJIGCsDAwMCQ2UdXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvaW5pdGlhbC5qc5ihcgkHwAeRBcDCmKFyTQnAwJEBwMKYoWcBAwnAkMDCmKFnCQsKwJEKwMKYoXIAB8DAkQXAwg==
====catalogjs annotation end====*/