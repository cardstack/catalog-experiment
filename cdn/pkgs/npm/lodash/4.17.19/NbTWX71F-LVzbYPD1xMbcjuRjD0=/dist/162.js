function arrayIncludesWith(array, value, comparator) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (comparator(value, array[index])) {
      return true;
    }
  }

  return false;
}
export { arrayIncludesWith as default };
/*====catalogjs annotation start====
k5CBp2RlZmF1bHSVoWyxYXJyYXlJbmNsdWRlc1dpdGgFwMCXl6FvAAABwJDAl6FvAAACBJDAmaFkAMzYA8CRA8DCmaFssWFycmF5SW5jbHVkZXNXaXRokgMGwMDAwJDZUlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYXJyYXlJbmNsdWRlc1dpdGguanOYoXIJEcDAkQLAwpihZwEDBcCQwMKYoWcJCwbAkQbAwpihcgARwMCRAsDC
====catalogjs annotation end====*/