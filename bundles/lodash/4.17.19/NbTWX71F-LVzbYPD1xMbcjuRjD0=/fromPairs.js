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
k5CBp2RlZmF1bHSUoWypZnJvbVBhaXJzBcCXl6FvAAABwJECwJehbwAAAgSQwJmhZADM0QPAkQPAwpihbKlmcm9tUGFpcnOSAwbAwMDA2UlXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvZnJvbVBhaXJzLmpzmKFyCQnAwJECwMKYoWcBAwXAkMDCmKFnCQsGwJEGwMKYoXIACcDAkQLAwg==
====catalogjs annotation end====*/