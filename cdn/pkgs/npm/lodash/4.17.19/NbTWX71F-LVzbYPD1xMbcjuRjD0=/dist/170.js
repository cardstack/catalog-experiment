import { default as baseRandom } from "./171.js";
function shuffleSelf(array, size) {
  var index = -1,
      length = array.length,
      lastIndex = length - 1;
  size = size === undefined ? length : size;

  while (++index < size) {
    var rand = baseRandom(index, lastIndex),
        value = array[rand];
    array[rand] = array[index];
    array[index] = value;
  }

  array.length = size;
  return array;
}
export { shuffleSelf as default };
/*====catalogjs annotation start====
k5GVwqguLzE3MS5qcwPCwIGnZGVmYXVsdJWhbKtzaHVmZmxlU2VsZgnAwJuXoW8AAAPAkMCZoWQJAALAkQLAwpmhaapiYXNlUmFuZG9tkgIHwACnZGVmYXVsdMDAwJihcgsKwMCRAcDCnKFpABMBBJDAwgDCwMCXoW8BAAUIkMCZoWQAzJgGwJIHBsDCmaFsq3NodWZmbGVTZWxmkgYKwMDAwJDZTFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fc2h1ZmZsZVNlbGYuanOYoXIJC8AHkQXAwpihcsy1CsDAkQHAwpihZwEDCcCQwMKYoWcJCwrAkQrAwpihcgALwMCRBcDC
====catalogjs annotation end====*/