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
k5GVwqguLzEyOC5qcwPCwIGnZGVmYXVsdJWhbKdiYXNlTnRoCsDAnJehbwAAA8CQwJmhZAkAAgSRAsDCmaFpp2lzSW5kZXiSAgjAAKdkZWZhdWx0wMDAmKFyCwfAwJEBwMKcoWkAAQEFkQTAwgDCwMCYoWcICsDAkMDCl6FvAQAGCZDAmaFkACUHwJIIB8DCmaFsp2Jhc2VOdGiSBwvAwMDAkNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlTnRoLmpzmKFyCQfACJEGwMKYoXJxB8DAkQHAwpihZwEDCsCQwMKYoWcJCwvAkQvAwpihcgAHwMCRBsDC
====catalogjs annotation end====*/