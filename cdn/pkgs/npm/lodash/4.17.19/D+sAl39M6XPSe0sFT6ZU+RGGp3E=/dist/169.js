var MAX_SAFE_INTEGER = 9007199254740991;
var nativeFloor = Math.floor;
function baseRepeat(string, n) {
  var result = '';

  if (!string || n < 1 || n > MAX_SAFE_INTEGER) {
    return result;
  }

  do {
    if (n % 2) {
      result += string;
    }

    n = nativeFloor(n / 2);

    if (n) {
      string += string;
    }
  } while (n);

  return result;
}
export { baseRepeat as default };
/*====catalogjs annotation start====
k5CBp2RlZmF1bHSVoWyqYmFzZVJlcGVhdA3AwJ+XoW8AAAHAkMCXoW8AAAIMkMCYoWcAAQMFkMDCmaFkBBMEwJIEAsDCmaFssE1BWF9TQUZFX0lOVEVHRVKSBArAwMACkNlLV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlUmVwZWF0LmpzmKFyABDAwJEDwMKYoWcBAQYIkMDCmaFkBA0HwJIHBcDCmaFsq25hdGl2ZUZsb29ykgcLwMDABZDZS1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZVJlcGVhdC5qc5ihcgALwMCRBsDCmaFkAVcJwJUKCwkDBsDCmaFsqmJhc2VSZXBlYXSSCQ7AwMDAkNlLV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlUmVwZWF0LmpzmKFyCQrACpEIwMKYoXJAEMALkQPAwpihclsLwMCRBsDCmKFnAQMNwJDAwpihZwkLDsCRDsDCmKFyAArAwJEIwMI=
====catalogjs annotation end====*/