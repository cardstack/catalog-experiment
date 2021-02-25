function fromPairs(pairs) {
  var index = -1,
      length = pairs == null ? 0 : pairs.length,
      result = {};

  while (++index < length) {
    var pair = pairs[index];
    result[pair[0]] = pair[1];
  }

  return result;
}
export { fromPairs as default };
/*====catalogjs annotation start====
k5CBp2RlZmF1bHSVoWypZnJvbVBhaXJzBcDAl5ehbwAAAcCQwJehbwAAAgSQwJmhZADM0QPAkQPAwpmhbKlmcm9tUGFpcnOSAwbAwMDAkNlJV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2Zyb21QYWlycy5qc5ihcgkJwMCRAsDCmKFnAQMFwJDAwpihZwkLBsCRBsDCmKFyAAnAwJECwMI=
====catalogjs annotation end====*/