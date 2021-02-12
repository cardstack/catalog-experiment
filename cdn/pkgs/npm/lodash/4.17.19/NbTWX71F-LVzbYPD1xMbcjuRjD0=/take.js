import { default as baseSlice } from "./dist/142.js";
import { default as toInteger } from "./toInteger.js";
function take(array, n, guard) {
  if (!(array && array.length)) {
    return [];
  }

  n = guard || n === undefined ? 1 : toInteger(n);
  return baseSlice(array, 0, n < 0 ? 0 : n);
}
export { take as default };
/*====catalogjs annotation start====
k5KVwq0uL2Rpc3QvMTQyLmpzA8LAlcKuLi90b0ludGVnZXIuanMGwsCBp2RlZmF1bHSVoWykdGFrZQ3AwJ+XoW8AAAPAkMCZoWQJAALAkQLAwpmhaaliYXNlU2xpY2WSAgvAAKdkZWZhdWx0wMDAmKFyCwnAwJEBwMKcoWkAGAEGkMDCAMLAwJmhZAkABcCRBcDCmaFpqXRvSW50ZWdlcpIFCsABp2RlZmF1bHTAwMCYoXILCcDAkQTAwpyhaQEZBAeQwMIBwsDAl6FvAQAIDJDAmaFkABwJwJMKCwnAwpmhbKR0YWtlkgkOwMDAwJDZRFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy90YWtlLmpzmKFyCQTACpEIwMKYoXJvCcALkQTAwpihcg4JwMCRAcDCmKFnAQMNwJDAwpihZwkLDsCRDsDCmKFyAATAwJEIwMI=
====catalogjs annotation end====*/