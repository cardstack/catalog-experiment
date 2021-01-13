import { default as toFinite } from "./toFinite.js";
function toInteger(value) {
  var result = toFinite(value),
      remainder = result % 1;
  return result === result ? remainder ? result - remainder : result : 0;
}
export { toInteger as default };
/*====catalogjs annotation start====
k5GVwq0uL3RvRmluaXRlLmpzA8LAgadkZWZhdWx0lKFsqXRvSW50ZWdlcgnAm5ehbwAAA8CRBcCZoWQJAALAkQLAwpihaah0b0Zpbml0ZZICB8AAp2RlZmF1bHTAwJihcgsIwMCRAcDCnKFpABgBBJDAwgDCwMCXoW8BAAUIkMCZoWQAcgbAkgcGwMKYoWypdG9JbnRlZ2VykgYKwMDAwNlJV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3RvSW50ZWdlci5qc5ihcgkJwAeRBcDCmKFyGQjAwJEBwMKYoWcBAwnAkMDCmKFnCQsKwJEKwMKYoXIACcDAkQXAwg==
====catalogjs annotation end====*/