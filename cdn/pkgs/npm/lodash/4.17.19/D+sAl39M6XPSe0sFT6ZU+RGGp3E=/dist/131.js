import { default as eq } from "../eq.js";
function baseSortedUniq(array, iteratee) {
  var index = -1,
      length = array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index],
        computed = iteratee ? iteratee(value) : value;

    if (!index || !eq(computed, seen)) {
      var seen = computed;
      result[resIndex++] = value === 0 ? 0 : value;
    }
  }

  return result;
}
export { baseSortedUniq as default };
/*====catalogjs annotation start====
k5GVwqguLi9lcS5qcwPCwIGnZGVmYXVsdJWhbK5iYXNlU29ydGVkVW5pcQrAwJyXoW8AAAPAkMCZoWQJAAIEkQLAwpmhaaJlcZICCMAAp2RlZmF1bHTAwMCYoXILAsDAkQHAwpyhaQABAQWRBMDCAMLAwJihZwgKwMCQwMKXoW8BAAYJkMCZoWQAzIAHwJIIB8DCmaFsrmJhc2VTb3J0ZWRVbmlxkgcLwMDAwJDZT1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZVNvcnRlZFVuaXEuanOYoXIJDsAIkQbAwpihcszxAsDAkQHAwpihZwEDCsCQwMKYoWcJCwvAkQvAwpihcgAOwMCRBsDC
====catalogjs annotation end====*/