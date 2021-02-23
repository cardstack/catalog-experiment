function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];

    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }

  return result;
}
export { arrayFilter as default };
/*====catalogjs annotation start====
k5CBp2RlZmF1bHSVoWyrYXJyYXlGaWx0ZXIFwMCXl6FvAAABwJDAl6FvAAACBJDAmaFkAM0BJQPAkQPAwpmhbKthcnJheUZpbHRlcpIDBsDAwMCQ2UxXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2FycmF5RmlsdGVyLmpzmKFyCQvAwJECwMKYoWcBAwXAkMDCmKFnCQsGwJEGwMKYoXIAC8DAkQLAwg==
====catalogjs annotation end====*/