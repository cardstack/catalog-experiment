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
k5OVwq4uL3RvSW50ZWdlci5qcwPCwJXCrS4vdG9MZW5ndGguanMGwsCVwqwuL2Rpc3QvNzAuanMJwsCBp2RlZmF1bHSUoWykZmlsbBbA3AAYl6FvAAADwJILEcCZoWQJAALAkQLAwpihaal0b0ludGVnZXKTAg0OwACnZGVmYXVsdMDAmKFyCwnAwJEBwMKcoWkAGQEGkMDCAMLAwJmhZAkABcCRBcDCmKFpqHRvTGVuZ3RokgUPwAGnZGVmYXVsdMDAmKFyCwjAwJEEwMKcoWkBGAQJkMDCAcLAwJmhZAkACMCRCMDCmKFprmlzSXRlcmF0ZWVDYWxskggTwAKnZGVmYXVsdMDAmKFyCw7AwJEHwMKcoWkBFwcKkMDCAsLAwJehbwEACxCQwJmhZABSDMCUDQ4PDMDCmKFsqGJhc2VGaWxskgwUwMDAwNlJV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlRmlsbC5qc5ihcgkIwA2RC8DCmKFyRAnADpEBwMKYoXLMiQnAD5EBwMKYoXJLCMDAkQTAwpehbwEAERWQwJmhZAAdEsCTExQSwMKYoWykZmlsbJISF8DAwMDZRFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9maWxsLmpzmKFyCQTAE5ERwMKYoXLMnw7AFJEHwMKYoXJICMDAkQvAwpihZwEDFsCQwMKYoWcJCxfAkRfAwpihcgAEwMCREcDC
====catalogjs annotation end====*/