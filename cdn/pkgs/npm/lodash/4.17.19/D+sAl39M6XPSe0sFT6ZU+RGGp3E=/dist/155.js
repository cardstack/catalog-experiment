function matchesStrictComparable(key, srcValue) {
  return function (object) {
    if (object == null) {
      return false;
    }

    return object[key] === srcValue && (srcValue !== undefined || key in Object(object));
  };
}
export { matchesStrictComparable as default };
/*====catalogjs annotation start====
k5CBp2RlZmF1bHSVoWy3bWF0Y2hlc1N0cmljdENvbXBhcmFibGUFwMCXl6FvAAABwJDAl6FvAAACBJDAmaFkAMzEA8CRA8DCmaFst21hdGNoZXNTdHJpY3RDb21wYXJhYmxlkgMGwMDAwJDZWFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fbWF0Y2hlc1N0cmljdENvbXBhcmFibGUuanOYoXIJF8DAkQLAwpihZwEDBcCQwMKYoWcJCwbAkQbAwpihcgAXwMCRAsDC
====catalogjs annotation end====*/