function baseFindKey(collection, predicate, eachFunc) {
  var result;
  eachFunc(collection, function (value, key, collection) {
    if (predicate(value, key, collection)) {
      result = key;
      return false;
    }
  });
  return result;
}
export { baseFindKey as default };
/*====catalogjs annotation start====
k5CBp2RlZmF1bHSVoWyrYmFzZUZpbmRLZXkFwMCXl6FvAAABwJDAl6FvAAACBJDAmaFkAMzgA8CRA8DCmaFsq2Jhc2VGaW5kS2V5kgMGwMDAwJDZTFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZUZpbmRLZXkuanOYoXIJC8DAkQLAwpihZwEDBcCQwMKYoWcJCwbAkQbAwpihcgALwMCRAsDC
====catalogjs annotation end====*/