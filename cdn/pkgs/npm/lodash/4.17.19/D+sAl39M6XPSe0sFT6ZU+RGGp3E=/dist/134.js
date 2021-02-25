function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }

  return result;
}
export { baseTimes as default };
/*====catalogjs annotation start====
k5CBp2RlZmF1bHSVoWypYmFzZVRpbWVzBcDAl5ehbwAAAcCQwJehbwAAAgSQwJmhZADMkAPAkQPAwpmhbKliYXNlVGltZXOSAwbAwMDAkNlKV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlVGltZXMuanOYoXIJCcDAkQLAwpihZwEDBcCQwMKYoWcJCwbAkQbAwpihcgAJwMCRAsDC
====catalogjs annotation end====*/