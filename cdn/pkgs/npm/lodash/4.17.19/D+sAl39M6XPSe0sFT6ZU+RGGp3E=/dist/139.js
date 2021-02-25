function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }

  return array;
}
export { arrayPush as default };
/*====catalogjs annotation start====
k5CBp2RlZmF1bHSVoWypYXJyYXlQdXNoBcDAl5ehbwAAAcCQwJehbwAAAgSQwJmhZADMvgPAkQPAwpmhbKlhcnJheVB1c2iSAwbAwMDAkNlKV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19hcnJheVB1c2guanOYoXIJCcDAkQLAwpihZwEDBcCQwMKYoWcJCwbAkQbAwpihcgAJwMCRAsDC
====catalogjs annotation end====*/