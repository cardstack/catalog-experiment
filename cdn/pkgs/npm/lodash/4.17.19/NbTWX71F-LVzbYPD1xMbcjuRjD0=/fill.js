import { default as toInteger } from "./toInteger.js";
import { default as toLength } from "./toLength.js";
import { default as isIterateeCall } from "./dist/70.js";
function baseFill(array, value, start, end) {
  var length = array.length;
  start = toInteger(start);

  if (start < 0) {
    start = -start > length ? 0 : length + start;
  }

  end = end === undefined || end > length ? length : toInteger(end);

  if (end < 0) {
    end += length;
  }

  end = start > end ? 0 : toLength(end);

  while (start < end) {
    array[start++] = value;
  }

  return array;
}
function fill(array, value, start, end) {
  var length = array == null ? 0 : array.length;

  if (!length) {
    return [];
  }

  if (start && typeof start != 'number' && isIterateeCall(array, value, start)) {
    start = 0;
    end = length;
  }

  return baseFill(array, value, start, end);
}
export { fill as default };
/*====catalogjs annotation start====
k5OVwq4uL3RvSW50ZWdlci5qcwPCwJXCrS4vdG9MZW5ndGguanMGwsCVwqwuL2Rpc3QvNzAuanMJwsCBp2RlZmF1bHSVoWykZmlsbBbAwNwAGJehbwAAA8CQwJmhZAkAAsCRAsDCmaFpqXRvSW50ZWdlcpMCDQ7AAKdkZWZhdWx0wMDAmKFyCwnAwJEBwMKcoWkAGQEGkMDCAMLAwJmhZAkABcCRBcDCmaFpqHRvTGVuZ3RokgUPwAGnZGVmYXVsdMDAwJihcgsIwMCRBMDCnKFpARgECZDAwgHCwMCZoWQJAAjAkQjAwpmhaa5pc0l0ZXJhdGVlQ2FsbJIIE8ACp2RlZmF1bHTAwMCYoXILDsDAkQfAwpyhaQEXBwqQwMICwsDAl6FvAQALEJDAmaFkAFIMwJQNDg8MwMKZoWyoYmFzZUZpbGySDBTAwMDAkNlJV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlRmlsbC5qc5ihcgkIwA2RC8DCmKFyRAnADpEBwMKYoXLMiQnAD5EBwMKYoXJLCMDAkQTAwpehbwEAERWQwJmhZAAdEsCTExQSwMKZoWykZmlsbJISF8DAwMCQ2URXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvZmlsbC5qc5ihcgkEwBOREcDCmKFyzJ8OwBSRB8DCmKFySAjAwJELwMKYoWcBAxbAkMDCmKFnCQsXwJEXwMKYoXIABMDAkRHAwg==
====catalogjs annotation end====*/