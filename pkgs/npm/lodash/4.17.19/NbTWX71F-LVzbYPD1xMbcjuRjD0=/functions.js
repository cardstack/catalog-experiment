import { default as baseFunctions } from "./dist/83.js";
import { default as keys } from "./keys.js";
function functions(object) {
  return object == null ? [] : baseFunctions(object, keys(object));
}
export { functions as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvODMuanMDwsCVwqkuL2tleXMuanMGwsCBp2RlZmF1bHSUoWypZnVuY3Rpb25zDcCfl6FvAAADwJDAmaFkCQACwJECwMKYoWmtYmFzZUZ1bmN0aW9uc5ICCsAAp2RlZmF1bHTAwJihcgsNwMCRAcDCnKFpABcBBpDAwgDCwMCZoWQJAAXAkQXAwpihaaRrZXlzkgULwAGnZGVmYXVsdMDAmKFyCwTAwJEEwMKcoWkBFAQHkMDCAcLAwJehbwEACAyQwJmhZAAMCcCTCgsJwMKYoWypZnVuY3Rpb25zkgkOwMDAwNlJV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2Z1bmN0aW9ucy5qc5ihcgkJwAqRCMDCmKFyKg3AC5EBwMKYoXIJBMDAkQTAwpihZwEDDcCQwMKYoWcJCw7AkQ7AwpihcgAJwMCRCMDC
====catalogjs annotation end====*/