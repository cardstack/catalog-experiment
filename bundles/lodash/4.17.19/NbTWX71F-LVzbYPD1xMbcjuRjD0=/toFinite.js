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
k5GVwq0uL3RvTnVtYmVyLmpzA8LAgadkZWZhdWx0lKFsqHRvRmluaXRlEcDcABOXoW8AAAPAkQrAmaFkCQACwJECwMKYoWmodG9OdW1iZXKSAgzAAKdkZWZhdWx0wMCYoXILCMDAkQHAwpyhaQAYAQSQwMIAwsDAl6FvAQAFEJDAmKFnAAEGCpDAwpmhZAQIBwiSBwXAwpihbKhJTkZJTklUWZMHDQ7AwMAF2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvdG9GaW5pdGUuanOYoXIACMDAkQbAwpmhZAYaCcCSCQXAwpihbKtNQVhfSU5URUdFUpIJD8DAwAXZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy90b0Zpbml0ZS5qc5ihcgALwMCRCMDCmaFkAS4LwJcMDQ4PCwYIwMKYoWyodG9GaW5pdGWSCxLAwMDA2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvdG9GaW5pdGUuanOYoXIJCMAMkQrAwpihck0IwA2RAcDCmKFyGgjADpEGwMKYoXIPCMAPkQbAwpihcjkLwMCRCMDCmKFnAQMRwJDAwpihZwkLEsCREsDCmKFyAAjAwJEKwMI=
====catalogjs annotation end====*/