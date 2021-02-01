import { default as baseValues } from "./dist/96.js";
import { default as keys } from "./keys.js";
function values(object) {
  return object == null ? [] : baseValues(object, keys(object));
}
export { values as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvOTYuanMDwsCVwqkuL2tleXMuanMGwsCBp2RlZmF1bHSUoWymdmFsdWVzDcCfl6FvAAADwJDAmaFkCQACwJECwMKYoWmqYmFzZVZhbHVlc5ICCsAAp2RlZmF1bHTAwJihcgsKwMCRAcDCnKFpABcBBpDAwgDCwMCZoWQJAAXAkQXAwpihaaRrZXlzkgULwAGnZGVmYXVsdMDAmKFyCwTAwJEEwMKcoWkBFAQHkMDCAcLAwJehbwEACAyQwJmhZAAMCcCTCgsJwMKYoWymdmFsdWVzkgkOwMDAwNlGV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3ZhbHVlcy5qc5ihcgkGwAqRCMDCmKFyKgrAC5EBwMKYoXIJBMDAkQTAwpihZwEDDcCQwMKYoWcJCw7AkQ7AwpihcgAGwMCRCMDC
====catalogjs annotation end====*/