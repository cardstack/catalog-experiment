import { default as baseSlice } from "./dist/142.js";
import { default as toInteger } from "./toInteger.js";
function drop(array, n, guard) {
  var length = array == null ? 0 : array.length;

  if (!length) {
    return [];
  }

  n = guard || n === undefined ? 1 : toInteger(n);
  return baseSlice(array, n < 0 ? 0 : n, length);
}
export { drop as default };
/*====catalogjs annotation start====
k5KVwq0uL2Rpc3QvMTQyLmpzA8LAlcKuLi90b0ludGVnZXIuanMGwsCBp2RlZmF1bHSVoWykZHJvcA3AwJ+XoW8AAAPAkMCZoWQJAALAkQLAwpmhaaliYXNlU2xpY2WSAgvAAKdkZWZhdWx0wMDAmKFyCwnAwJEBwMKcoWkAGAEGkMDCAMLAwJmhZAkABcCRBcDCmaFpqXRvSW50ZWdlcpIFCsABp2RlZmF1bHTAwMCYoXILCcDAkQTAwpyhaQEZBAeQwMIBwsDAl6FvAQAIDJDAmaFkACEJwJMKCwnAwpmhbKRkcm9wkgkOwMDAwJDZRFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9kcm9wLmpzmKFyCQTACpEIwMKYoXLMkAnAC5EEwMKYoXIOCcDAkQHAwpihZwEDDcCQwMKYoWcJCw7AkQ7AwpihcgAEwMCRCMDC
====catalogjs annotation end====*/