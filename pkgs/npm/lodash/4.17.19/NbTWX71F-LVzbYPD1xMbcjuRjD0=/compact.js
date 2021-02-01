function compact(array) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];

    if (value) {
      result[resIndex++] = value;
    }
  }

  return result;
}
export { compact as default };
/*====catalogjs annotation start====
k5CBp2RlZmF1bHSUoWynY29tcGFjdAXAl5ehbwAAAcCQwJehbwAAAgSQwJmhZADNAQEDwJEDwMKYoWynY29tcGFjdJIDBsDAwMDZR1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9jb21wYWN0LmpzmKFyCQfAwJECwMKYoWcBAwXAkMDCmKFnCQsGwJEGwMKYoXIAB8DAkQLAwg==
====catalogjs annotation end====*/