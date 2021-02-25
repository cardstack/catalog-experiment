function arraySome(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }

  return false;
}
export { arraySome as default };
/*====catalogjs annotation start====
k5CBp2RlZmF1bHSVoWypYXJyYXlTb21lBcDAl5ehbwAAAcCQwJehbwAAAgSQwJmhZADM1gPAkQPAwpmhbKlhcnJheVNvbWWSAwbAwMDAkNlKV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19hcnJheVNvbWUuanOYoXIJCcDAkQLAwpihZwEDBcCQwMKYoWcJCwbAkQbAwpihcgAJwMCRAsDC
====catalogjs annotation end====*/