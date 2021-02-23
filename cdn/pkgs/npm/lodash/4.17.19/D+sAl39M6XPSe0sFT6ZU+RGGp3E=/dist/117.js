function copyArray(source, array) {
  var index = -1,
      length = source.length;
  array || (array = Array(length));

  while (++index < length) {
    array[index] = source[index];
  }

  return array;
}
export { copyArray as default };
/*====catalogjs annotation start====
k5CBp2RlZmF1bHSVoWypY29weUFycmF5BcDAl5ehbwAAAcCQwJehbwAAAgSQwJmhZADMvAPAkQPAwpmhbKljb3B5QXJyYXmSAwbAwMDAkNlKV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19jb3B5QXJyYXkuanOYoXIJCcDAkQLAwpihZwEDBcCQwMKYoWcJCwbAkQbAwpihcgAJwMCRAsDC
====catalogjs annotation end====*/