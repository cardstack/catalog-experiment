import { default as toInteger } from "./toInteger.js";
function isInteger(value) {
  return typeof value == 'number' && value == toInteger(value);
}
export { isInteger as default };
/*====catalogjs annotation start====
k5GVwq4uL3RvSW50ZWdlci5qcwPCwIGnZGVmYXVsdJWhbKlpc0ludGVnZXIKwMCcl6FvAAADwJDAmaFkCQACBJECwMKZoWmpdG9JbnRlZ2VykgIIwACnZGVmYXVsdMDAwJihcgsJwMCRAcDCnKFpAAEBBZEEwMIAwsDAmKFnCBDAwJDAwpehbwEABgmQwJmhZAAKB8CSCAfAwpmhbKlpc0ludGVnZXKSBwvAwMDAkNlJV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2lzSW50ZWdlci5qc5ihcgkJwAiRBsDCmKFyOAnAwJEBwMKYoWcBAwrAkMDCmKFnCQsLwJELwMKYoXIACcDAkQbAwg==
====catalogjs annotation end====*/