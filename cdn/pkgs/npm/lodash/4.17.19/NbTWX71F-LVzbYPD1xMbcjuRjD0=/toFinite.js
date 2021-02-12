import { default as toNumber } from "./toNumber.js";
var INFINITY = 1 / 0,
    MAX_INTEGER = 1.7976931348623157e+308;
function toFinite(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }

  value = toNumber(value);

  if (value === INFINITY || value === -INFINITY) {
    var sign = value < 0 ? -1 : 1;
    return sign * MAX_INTEGER;
  }

  return value === value ? value : 0;
}
export { toFinite as default };
/*====catalogjs annotation start====
k5GVwq0uL3RvTnVtYmVyLmpzA8LAgadkZWZhdWx0laFsqHRvRmluaXRlEcDA3AATl6FvAAADwJDAmaFkCQACwJECwMKZoWmodG9OdW1iZXKSAgzAAKdkZWZhdWx0wMDAmKFyCwjAwJEBwMKcoWkAGAEEkMDCAMLAwJehbwEABRCQwJihZwABBgqQwMKZoWQECAcIkgcFwMKZoWyoSU5GSU5JVFmTBw0OwMDABZDZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy90b0Zpbml0ZS5qc5ihcgAIwMCRBsDCmaFkBhoJwJIJBcDCmaFsq01BWF9JTlRFR0VSkgkPwMDABZDZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy90b0Zpbml0ZS5qc5ihcgALwMCRCMDCmaFkAS4LwJcMDQ4PCwYIwMKZoWyodG9GaW5pdGWSCxLAwMDAkNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3RvRmluaXRlLmpzmKFyCQjADJEKwMKYoXJNCMANkQHAwpihchoIwA6RBsDCmKFyDwjAD5EGwMKYoXI5C8DAkQjAwpihZwEDEcCQwMKYoWcJCxLAkRLAwpihcgAIwMCRCsDC
====catalogjs annotation end====*/