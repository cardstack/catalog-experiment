import { default as baseNth } from "./dist/127.js";
import { default as toInteger } from "./toInteger.js";
function nth(array, n) {
  return array && array.length ? baseNth(array, toInteger(n)) : undefined;
}
export { nth as default };
/*====catalogjs annotation start====
k5KVwq0uL2Rpc3QvMTI3LmpzA8LAlcKuLi90b0ludGVnZXIuanMGwsCBp2RlZmF1bHSVoWyjbnRoDcDAn5ehbwAAA8CQwJmhZAkAAsCRAsDCmaFpp2Jhc2VOdGiSAgrAAKdkZWZhdWx0wMDAmKFyCwfAwJEBwMKcoWkAGAEGkMDCAMLAwJmhZAkABcCRBcDCmaFpqXRvSW50ZWdlcpIFC8ABp2RlZmF1bHTAwMCYoXILCcDAkQTAwpyhaQEZBAeQwMIBwsDAl6FvAQAIDJDAmaFkABMJwJMKCwnAwpmhbKNudGiSCQ7AwMDAkNlDV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL250aC5qc5ihcgkDwAqRCMDCmKFyLgfAC5EBwMKYoXIICcDAkQTAwpihZwEDDcCQwMKYoWcJCw7AkQ7AwpihcgADwMCRCMDC
====catalogjs annotation end====*/