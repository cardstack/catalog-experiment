function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }

  return result;
}
export { arrayMap as default };
/*====catalogjs annotation start====
k5CBp2RlZmF1bHSVoWyoYXJyYXlNYXAFwMCXl6FvAAABwJDAl6FvAAACBJDAmaFkAMzkA8CRA8DCmaFsqGFycmF5TWFwkgMGwMDAwJDZSVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYXJyYXlNYXAuanOYoXIJCMDAkQLAwpihZwEDBcCQwMKYoWcJCwbAkQbAwpihcgAIwMCRAsDC
====catalogjs annotation end====*/