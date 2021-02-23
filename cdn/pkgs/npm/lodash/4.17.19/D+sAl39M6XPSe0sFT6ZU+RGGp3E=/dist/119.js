function arrayEach(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }

  return array;
}
export { arrayEach as default };
/*====catalogjs annotation start====
k5CBp2RlZmF1bHSVoWypYXJyYXlFYWNoBcDAl5ehbwAAAcCQwJehbwAAAgSQwJmhZADM2APAkQPAwpmhbKlhcnJheUVhY2iSAwbAwMDAkNlKV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19hcnJheUVhY2guanOYoXIJCcDAkQLAwpihZwEDBcCQwMKYoWcJCwbAkQbAwpihcgAJwMCRAsDC
====catalogjs annotation end====*/