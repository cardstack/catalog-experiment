import { default as isIndex } from "./128.js";
function baseNth(array, n) {
  var length = array.length;

  if (!length) {
    return;
  }

  n += n < 0 ? length : 0;
  return isIndex(n, length) ? array[n] : undefined;
}
export { baseNth as default };
/*====catalogjs annotation start====
k5GVwqguLzEyOC5qcwPCwIGnZGVmYXVsdJWhbKdiYXNlTnRoCcDAm5ehbwAAA8CQwJmhZAkAAsCRAsDCmaFpp2lzSW5kZXiSAgfAAKdkZWZhdWx0wMDAmKFyCwfAwJEBwMKcoWkAEwEEkMDCAMLAwJehbwEABQiQwJmhZAAlBsCSBwbAwpmhbKdiYXNlTnRokgYKwMDAwJDZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZU50aC5qc5ihcgkHwAeRBcDCmKFycQfAwJEBwMKYoWcBAwnAkMDCmKFnCQsKwJEKwMKYoXIAB8DAkQXAwg==
====catalogjs annotation end====*/