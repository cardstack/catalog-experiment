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
k5GVwqguLzE3MS5qcwPCwIGnZGVmYXVsdJWhbKtzaHVmZmxlU2VsZgrAwJyXoW8AAAPAkMCZoWQJAAIEkQLAwpmhaapiYXNlUmFuZG9tkgIIwACnZGVmYXVsdMDAwJihcgsKwMCRAcDCnKFpAAEBBZEEwMIAwsDAmKFnCArAwJDAwpehbwEABgmQwJmhZADMmAfAkggHwMKZoWyrc2h1ZmZsZVNlbGaSBwvAwMDAkNlMV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19zaHVmZmxlU2VsZi5qc5ihcgkLwAiRBsDCmKFyzLUKwMCRAcDCmKFnAQMKwJDAwpihZwkLC8CRC8DCmKFyAAvAwJEGwMI=
====catalogjs annotation end====*/