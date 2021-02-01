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
k5OVwq4uL3RvSW50ZWdlci5qcwPCwJXCrS4vdG9MZW5ndGguanMGwsCVwqwuL2Rpc3QvNzAuanMJwsCBp2RlZmF1bHSUoWykZmlsbBbA3AAYl6FvAAADwJDAmaFkCQACwJECwMKYoWmpdG9JbnRlZ2VykwINDsAAp2RlZmF1bHTAwJihcgsJwMCRAcDCnKFpABkBBpDAwgDCwMCZoWQJAAXAkQXAwpihaah0b0xlbmd0aJIFD8ABp2RlZmF1bHTAwJihcgsIwMCRBMDCnKFpARgECZDAwgHCwMCZoWQJAAjAkQjAwpihaa5pc0l0ZXJhdGVlQ2FsbJIIE8ACp2RlZmF1bHTAwJihcgsOwMCRB8DCnKFpARcHCpDAwgLCwMCXoW8BAAsQkMCZoWQAUgzAlA0ODwzAwpihbKhiYXNlRmlsbJIMFMDAwMDZSVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZUZpbGwuanOYoXIJCMANkQvAwpihckQJwA6RAcDCmKFyzIkJwA+RAcDCmKFySwjAwJEEwMKXoW8BABEVkMCZoWQAHRLAkxMUEsDCmKFspGZpbGySEhfAwMDA2URXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvZmlsbC5qc5ihcgkEwBOREcDCmKFyzJ8OwBSRB8DCmKFySAjAwJELwMKYoWcBAxbAkMDCmKFnCQsXwJEXwMKYoXIABMDAkRHAwg==
====catalogjs annotation end====*/