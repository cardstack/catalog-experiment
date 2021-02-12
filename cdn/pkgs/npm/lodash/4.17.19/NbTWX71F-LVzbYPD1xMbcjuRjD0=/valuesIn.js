import { default as baseValues } from "./dist/96.js";
import { default as keysIn } from "./keysIn.js";
function valuesIn(object) {
  return object == null ? [] : baseValues(object, keysIn(object));
}
export { valuesIn as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvOTYuanMDwsCVwqsuL2tleXNJbi5qcwbCwIGnZGVmYXVsdJWhbKh2YWx1ZXNJbg3AwJ+XoW8AAAPAkMCZoWQJAALAkQLAwpmhaapiYXNlVmFsdWVzkgIKwACnZGVmYXVsdMDAwJihcgsKwMCRAcDCnKFpABcBBpDAwgDCwMCZoWQJAAXAkQXAwpmhaaZrZXlzSW6SBQvAAadkZWZhdWx0wMDAmKFyCwbAwJEEwMKcoWkBFgQHkMDCAcLAwJehbwEACAyQwJmhZAAMCcCTCgsJwMKZoWyodmFsdWVzSW6SCQ7AwMDAkNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3ZhbHVlc0luLmpzmKFyCQjACpEIwMKYoXIqCsALkQHAwpihcgkGwMCRBMDCmKFnAQMNwJDAwpihZwkLDsCRDsDCmKFyAAjAwJEIwMI=
====catalogjs annotation end====*/