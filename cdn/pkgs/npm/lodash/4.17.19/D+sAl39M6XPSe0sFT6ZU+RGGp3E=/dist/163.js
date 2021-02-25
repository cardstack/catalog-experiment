function arrayEvery(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (!predicate(array[index], index, array)) {
      return false;
    }
  }

  return true;
}
export { arrayEvery as default };
/*====catalogjs annotation start====
k5CBp2RlZmF1bHSVoWyqYXJyYXlFdmVyeQXAwJeXoW8AAAHAkMCXoW8AAAIEkMCZoWQAzNcDwJEDwMKZoWyqYXJyYXlFdmVyeZIDBsDAwMCQ2UtXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2FycmF5RXZlcnkuanOYoXIJCsDAkQLAwpihZwEDBcCQwMKYoWcJCwbAkQbAwpihcgAKwMCRAsDC
====catalogjs annotation end====*/