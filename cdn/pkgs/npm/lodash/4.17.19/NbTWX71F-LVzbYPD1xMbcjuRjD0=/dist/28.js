import { default as isSymbol } from "../isSymbol.js";
function baseExtremum(array, iteratee, comparator) {
  var index = -1,
      length = array.length;

  while (++index < length) {
    var value = array[index],
        current = iteratee(value);

    if (current != null && (computed === undefined ? current === current && !isSymbol(current) : comparator(current, computed))) {
      var computed = current,
          result = value;
    }
  }

  return result;
}
export { baseExtremum as default };
/*====catalogjs annotation start====
k5GVwq4uLi9pc1N5bWJvbC5qcwPCwIGnZGVmYXVsdJWhbKxiYXNlRXh0cmVtdW0JwMCbl6FvAAADwJDAmaFkCQACwJECwMKZoWmoaXNTeW1ib2ySAgfAAKdkZWZhdWx0wMDAmKFyCwjAwJEBwMKcoWkAGQEEkMDCAMLAwJehbwEABQiQwJmhZADMgwbAkgcGwMKZoWysYmFzZUV4dHJlbXVtkgYKwMDAwJDZTVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZUV4dHJlbXVtLmpzmKFyCQzAB5EFwMKYoXLM/AjAwJEBwMKYoWcBAwnAkMDCmKFnCQsKwJEKwMKYoXIADMDAkQXAwg==
====catalogjs annotation end====*/