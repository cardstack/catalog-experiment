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
k5KVwq0uL2Rpc3QvMTIzLmpzA8LAlcKuLi90b0ludGVnZXIuanMGwsCBp2RlZmF1bHSUoWynaW5kZXhPZhHA3AATl6FvAAADwJELwJmhZAkAAsCRAsDCmKFpq2Jhc2VJbmRleE9mkgIPwACnZGVmYXVsdMDAmKFyCwvAwJEBwMKcoWkAGAEGkMDCAMLAwJmhZAkABcCRBcDCmKFpqXRvSW50ZWdlcpIFDcABp2RlZmF1bHTAwJihcgsJwMCRBMDCnKFpARkEB5DAwgHCwMCXoW8BAAgQkMCYoWcAAQkLkMDCmaFkBAsKwJIKCMDCmKFsqW5hdGl2ZU1heJIKDsDAwAjZR1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9pbmRleE9mLmpzmKFyAAnAwJEJwMKZoWQBGAzAlQ0ODwwJwMKYoWynaW5kZXhPZpIMEsDAwMDZR1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9pbmRleE9mLmpzmKFyCQfADZELwMKYoXLMmQnADpEEwMKYoXItCcAPkQnAwpihciMLwMCRAcDCmKFnAQMRwJDAwpihZwkLEsCREsDCmKFyAAfAwJELwMI=
====catalogjs annotation end====*/