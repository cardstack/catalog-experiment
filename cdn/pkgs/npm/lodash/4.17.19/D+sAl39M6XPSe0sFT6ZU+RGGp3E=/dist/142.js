function baseSlice(array, start, end) {
  var index = -1,
      length = array.length;

  if (start < 0) {
    start = -start > length ? 0 : length + start;
  }

  end = end > length ? length : end;

  if (end < 0) {
    end += length;
  }

  length = start > end ? 0 : end - start >>> 0;
  start >>>= 0;
  var result = Array(length);

  while (++index < length) {
    result[index] = array[index + start];
  }

  return result;
}
export { baseSlice as default };
/*====catalogjs annotation start====
k5CBp2RlZmF1bHSVoWypYmFzZVNsaWNlBcDAl5ehbwAAAcCQwJehbwAAAgSQwJmhZADNAZwDwJEDwMKZoWypYmFzZVNsaWNlkgMGwMDAwJDZSlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZVNsaWNlLmpzmKFyCQnAwJECwMKYoWcBAwXAkMDCmKFnCQsGwJEGwMKYoXIACcDAkQLAwg==
====catalogjs annotation end====*/