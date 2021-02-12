function setToArray(set) {
  var index = -1,
      result = Array(set.size);
  set.forEach(function (value) {
    result[++index] = value;
  });
  return result;
}
export { setToArray as default };
/*====catalogjs annotation start====
k5CBp2RlZmF1bHSVoWyqc2V0VG9BcnJheQXAwJeXoW8AAAHAkMCXoW8AAAIEkMCZoWQAzJADwJEDwMKZoWyqc2V0VG9BcnJheZIDBsDAwMCQ2UtXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX3NldFRvQXJyYXkuanOYoXIJCsDAkQLAwpihZwEDBcCQwMKYoWcJCwbAkQbAwpihcgAKwMCRAsDC
====catalogjs annotation end====*/