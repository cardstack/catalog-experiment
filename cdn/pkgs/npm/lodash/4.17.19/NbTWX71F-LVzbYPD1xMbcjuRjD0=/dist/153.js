function mapToArray(map) {
  var index = -1,
      result = Array(map.size);
  map.forEach(function (value, key) {
    result[++index] = [key, value];
  });
  return result;
}
export { mapToArray as default };
/*====catalogjs annotation start====
k5CBp2RlZmF1bHSVoWyqbWFwVG9BcnJheQXAwJeXoW8AAAHAkMCXoW8AAAIEkMCZoWQAzJwDwJEDwMKZoWyqbWFwVG9BcnJheZIDBsDAwMCQ2UtXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX21hcFRvQXJyYXkuanOYoXIJCsDAkQLAwpihZwEDBcCQwMKYoWcJCwbAkQbAwpihcgAKwMCRAsDC
====catalogjs annotation end====*/