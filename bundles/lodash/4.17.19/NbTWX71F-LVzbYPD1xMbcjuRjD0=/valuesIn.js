import { default as baseValues } from "./dist/96.js";
import { default as keysIn } from "./keysIn.js";
function valuesIn(object) {
  return object == null ? [] : baseValues(object, keysIn(object));
}
export { valuesIn as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvOTYuanMDwsCVwqsuL2tleXNJbi5qcwbCwIGnZGVmYXVsdJShbKh2YWx1ZXNJbg3An5ehbwAAA8CRCMCZoWQJAALAkQLAwpihaapiYXNlVmFsdWVzkgIKwACnZGVmYXVsdMDAmKFyCwrAwJEBwMKcoWkAFwEGkMDCAMLAwJmhZAkABcCRBcDCmKFppmtleXNJbpIFC8ABp2RlZmF1bHTAwJihcgsGwMCRBMDCnKFpARYEB5DAwgHCwMCXoW8BAAgMkMCZoWQADAnAkwoLCcDCmKFsqHZhbHVlc0lukgkOwMDAwNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3ZhbHVlc0luLmpzmKFyCQjACpEIwMKYoXIqCsALkQHAwpihcgkGwMCRBMDCmKFnAQMNwJDAwpihZwkLDsCRDsDCmKFyAAjAwJEIwMI=
====catalogjs annotation end====*/