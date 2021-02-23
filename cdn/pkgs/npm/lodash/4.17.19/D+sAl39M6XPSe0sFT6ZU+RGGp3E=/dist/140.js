import { default as baseSlice } from "./142.js";
function castSlice(array, start, end) {
  var length = array.length;
  end = end === undefined ? length : end;
  return !start && end >= length ? array : baseSlice(array, start, end);
}
export { castSlice as default };
/*====catalogjs annotation start====
k5GVwqguLzE0Mi5qcwPCwIGnZGVmYXVsdJWhbKljYXN0U2xpY2UKwMCcl6FvAAADwJDAmaFkCQACBJECwMKZoWmpYmFzZVNsaWNlkgIIwACnZGVmYXVsdMDAwJihcgsJwMCRAcDCnKFpAAEBBZEEwMIAwsDAmKFnCArAwJDAwpehbwEABgmQwJmhZAAWB8CSCAfAwpmhbKljYXN0U2xpY2WSBwvAwMDAkNlKV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19jYXN0U2xpY2UuanOYoXIJCcAIkQbAwpihcsyICcDAkQHAwpihZwEDCsCQwMKYoWcJCwvAkQvAwpihcgAJwMCRBsDC
====catalogjs annotation end====*/