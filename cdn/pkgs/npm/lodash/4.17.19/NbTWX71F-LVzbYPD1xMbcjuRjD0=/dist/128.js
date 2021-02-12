var MAX_SAFE_INTEGER = 9007199254740991;
var reIsUint = /^(?:0|[1-9]\d*)$/;
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length && (type == 'number' || type != 'symbol' && reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
}
export { isIndex as default };
/*====catalogjs annotation start====
k5CBp2RlZmF1bHSVoWynaXNJbmRleA3AwJ+XoW8AAAHAkMCXoW8AAAIMkMCYoWcAAQMFkMDCmaFkBBMEwJIEAsDCmaFssE1BWF9TQUZFX0lOVEVHRVKSBArAwMACkNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19pc0luZGV4LmpzmKFyABDAwJEDwMKYoWcBAQYIkMDCmaFkBBUHwJIHBcDCmaFsqHJlSXNVaW50kgcLwMDABZDZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9faXNJbmRleC5qc5ihcgAIwMCRBsDCmaFkAUIJwJUKCwkDBsDCmaFsp2lzSW5kZXiSCQ7AwMDAkNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19pc0luZGV4LmpzmKFyCQfACpEIwMKYoXJJEMALkQPAwpihckkIwMCRBsDCmKFnAQMNwJDAwpihZwkLDsCRDsDCmKFyAAfAwJEIwMI=
====catalogjs annotation end====*/