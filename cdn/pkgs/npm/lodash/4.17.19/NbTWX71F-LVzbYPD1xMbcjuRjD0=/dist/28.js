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
k5GVwq4uLi9pc1N5bWJvbC5qcwPCwIGnZGVmYXVsdJWhbKxiYXNlRXh0cmVtdW0KwMCcl6FvAAADwJDAmaFkCQACBJECwMKZoWmoaXNTeW1ib2ySAgjAAKdkZWZhdWx0wMDAmKFyCwjAwJEBwMKcoWkAAQEFkQTAwgDCwMCYoWcIEMDAkMDCl6FvAQAGCZDAmaFkAMyDB8CSCAfAwpmhbKxiYXNlRXh0cmVtdW2SBwvAwMDAkNlNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlRXh0cmVtdW0uanOYoXIJDMAIkQbAwpihcsz8CMDAkQHAwpihZwEDCsCQwMKYoWcJCwvAkQvAwpihcgAMwMCRBsDC
====catalogjs annotation end====*/