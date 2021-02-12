import { default as baseFunctions } from "./dist/83.js";
import { default as keysIn } from "./keysIn.js";
function functionsIn(object) {
  return object == null ? [] : baseFunctions(object, keysIn(object));
}
export { functionsIn as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvODMuanMDwsCVwqsuL2tleXNJbi5qcwbCwIGnZGVmYXVsdJWhbKtmdW5jdGlvbnNJbg3AwJ+XoW8AAAPAkMCZoWQJAALAkQLAwpmhaa1iYXNlRnVuY3Rpb25zkgIKwACnZGVmYXVsdMDAwJihcgsNwMCRAcDCnKFpABcBBpDAwgDCwMCZoWQJAAXAkQXAwpmhaaZrZXlzSW6SBQvAAadkZWZhdWx0wMDAmKFyCwbAwJEEwMKcoWkBFgQHkMDCAcLAwJehbwEACAyQwJmhZAAMCcCTCgsJwMKZoWyrZnVuY3Rpb25zSW6SCQ7AwMDAkNlLV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2Z1bmN0aW9uc0luLmpzmKFyCQvACpEIwMKYoXIqDcALkQHAwpihcgkGwMCRBMDCmKFnAQMNwJDAwpihZwkLDsCRDsDCmKFyAAvAwJEIwMI=
====catalogjs annotation end====*/