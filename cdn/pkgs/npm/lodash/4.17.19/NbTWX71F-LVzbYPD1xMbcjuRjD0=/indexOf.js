import { default as baseIndexOf } from "./dist/123.js";
import { default as toInteger } from "./toInteger.js";
var nativeMax = Math.max;
function indexOf(array, value, fromIndex) {
  var length = array == null ? 0 : array.length;

  if (!length) {
    return -1;
  }

  var index = fromIndex == null ? 0 : toInteger(fromIndex);

  if (index < 0) {
    index = nativeMax(length + index, 0);
  }

  return baseIndexOf(array, value, index);
}
export { indexOf as default };
/*====catalogjs annotation start====
k5KVwq0uL2Rpc3QvMTIzLmpzA8LAlcKuLi90b0ludGVnZXIuanMGwsCBp2RlZmF1bHSVoWynaW5kZXhPZhHAwNwAE5ehbwAAA8CQwJmhZAkAAsCRAsDCmaFpq2Jhc2VJbmRleE9mkgIPwACnZGVmYXVsdMDAwJihcgsLwMCRAcDCnKFpABgBBpDAwgDCwMCZoWQJAAXAkQXAwpmhaal0b0ludGVnZXKSBQ3AAadkZWZhdWx0wMDAmKFyCwnAwJEEwMKcoWkBGQQHkMDCAcLAwJehbwEACBCQwJihZwABCQuQwMKZoWQECwrAkgoIwMKZoWypbmF0aXZlTWF4kgoOwMDACJDZR1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9pbmRleE9mLmpzmKFyAAnAwJEJwMKZoWQBGAzAlQ0ODwwJwMKZoWynaW5kZXhPZpIMEsDAwMCQ2UdXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvaW5kZXhPZi5qc5ihcgkHwA2RC8DCmKFyzJkJwA6RBMDCmKFyLQnAD5EJwMKYoXIjC8DAkQHAwpihZwEDEcCQwMKYoWcJCxLAkRLAwpihcgAHwMCRC8DC
====catalogjs annotation end====*/