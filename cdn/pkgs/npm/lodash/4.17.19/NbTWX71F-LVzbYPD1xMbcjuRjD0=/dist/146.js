function arrayReduce(array, iteratee, accumulator, initAccum) {
  var index = -1,
      length = array == null ? 0 : array.length;

  if (initAccum && length) {
    accumulator = array[++index];
  }

  while (++index < length) {
    accumulator = iteratee(accumulator, array[index], index, array);
  }

  return accumulator;
}
export { arrayReduce as default };
/*====catalogjs annotation start====
k5CBp2RlZmF1bHSVoWyrYXJyYXlSZWR1Y2UFwMCXl6FvAAABwJDAl6FvAAACBJDAmaFkAM0BMgPAkQPAwpmhbKthcnJheVJlZHVjZZIDBsDAwMCQ2UxXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2FycmF5UmVkdWNlLmpzmKFyCQvAwJECwMKYoWcBAwXAkMDCmKFnCQsGwJEGwMKYoXIAC8DAkQLAwg==
====catalogjs annotation end====*/