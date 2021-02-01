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
k5CBp2RlZmF1bHSUoWypZnJvbVBhaXJzBcCXl6FvAAABwJDAl6FvAAACBJDAmaFkAMzRA8CRA8DCmKFsqWZyb21QYWlyc5IDBsDAwMDZSVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9mcm9tUGFpcnMuanOYoXIJCcDAkQLAwpihZwEDBcCQwMKYoWcJCwbAkQbAwpihcgAJwMCRAsDC
====catalogjs annotation end====*/