import { default as baseNth } from "./dist/127.js";
import { default as toInteger } from "./toInteger.js";
function nth(array, n) {
  return array && array.length ? baseNth(array, toInteger(n)) : undefined;
}
export { nth as default };
/*====catalogjs annotation start====
k5KVwq0uL2Rpc3QvMTI3LmpzA8LAlcKuLi90b0ludGVnZXIuanMGwsCBp2RlZmF1bHSUoWyjbnRoDcCfl6FvAAADwJDAmaFkCQACwJECwMKYoWmnYmFzZU50aJICCsAAp2RlZmF1bHTAwJihcgsHwMCRAcDCnKFpABgBBpDAwgDCwMCZoWQJAAXAkQXAwpihaal0b0ludGVnZXKSBQvAAadkZWZhdWx0wMCYoXILCcDAkQTAwpyhaQEZBAeQwMIBwsDAl6FvAQAIDJDAmaFkABMJwJMKCwnAwpihbKNudGiSCQ7AwMDA2UNXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvbnRoLmpzmKFyCQPACpEIwMKYoXIuB8ALkQHAwpihcggJwMCRBMDCmKFnAQMNwJDAwpihZwkLDsCRDsDCmKFyAAPAwJEIwMI=
====catalogjs annotation end====*/