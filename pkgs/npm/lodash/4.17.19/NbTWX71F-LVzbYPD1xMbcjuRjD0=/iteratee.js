import { default as baseClone } from "./dist/40.js";
import { default as baseIteratee } from "./dist/6.js";
var CLONE_DEEP_FLAG = 1;
function iteratee(func) {
  return baseIteratee(typeof func == 'function' ? func : baseClone(func, CLONE_DEEP_FLAG));
}
export { iteratee as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvNDAuanMDwsCVwqsuL2Rpc3QvNi5qcwbCwIGnZGVmYXVsdJShbKhpdGVyYXRlZRHA3AATl6FvAAADwJDAmaFkCQACwJECwMKYoWmpYmFzZUNsb25lkgIOwACnZGVmYXVsdMDAmKFyCwnAwJEBwMKcoWkAFwEGkMDCAMLAwJmhZAkABcCRBcDCmKFprGJhc2VJdGVyYXRlZZIFDcABp2RlZmF1bHTAwJihcgsMwMCRBMDCnKFpARYEB5DAwgHCwMCXoW8BAAgQkMCYoWcAAQkLkMDCmaFkBAQKwJIKCMDCmKFsr0NMT05FX0RFRVBfRkxBR5IKD8DAwAjZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9pdGVyYXRlZS5qc5ihcgAPwMCRCcDCmaFkAQUMwJUNDg8MCcDCmKFsqGl0ZXJhdGVlkgwSwMDAwNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2l0ZXJhdGVlLmpzmKFyCQjADZELwMKYoXISDMAOkQTAwpihciQJwA+RAcDCmKFyBw/AwJEJwMKYoWcBAxHAkMDCmKFnCQsSwJESwMKYoXIACMDAkQvAwg==
====catalogjs annotation end====*/