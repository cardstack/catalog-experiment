import { default as Symbol0 } from "./87.js";
var objectProto0 = Object.prototype;
var hasOwnProperty0 = objectProto0.hasOwnProperty;
var nativeObjectToString0 = objectProto0.toString;
var symToStringTag0 = Symbol0 ? Symbol0.toStringTag : undefined;
function getRawTag(value) {
  var isOwn = hasOwnProperty0.call(value, symToStringTag0),
      tag = value[symToStringTag0];

  try {
    value[symToStringTag0] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString0.call(value);

  if (unmasked) {
    if (isOwn) {
      value[symToStringTag0] = tag;
    } else {
      delete value[symToStringTag0];
    }
  }

  return result;
}
var objectProto = Object.prototype;
var nativeObjectToString = objectProto.toString;
function objectToString(value) {
  return nativeObjectToString.call(value);
}
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';
var symToStringTag = Symbol0 ? Symbol0.toStringTag : undefined;
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }

  return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
}
export { baseGetTag as default };
/*====catalogjs annotation start====
k5GVwqcuLzg3LmpzA8LAgadkZWZhdWx0laFsqmJhc2VHZXRUYWc+wMDcAECXoW8AAAPAkMCZoWQJAAIEkQLAwpmhaadTeW1ib2wwlQIUFTM0wACnZGVmYXVsdMDAwJihcgsHwMCRAcDCnKFpAAEBBZEEwMIAwsDAmKFnCAnAwJDAwpehbwEABh+QwJihZwABBwmQwMKZoWQEEwjAkggGwMKZoWysb2JqZWN0UHJvdG8wkwgMEMDAwAaQ2UpXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2dldFJhd1RhZy5qc5ihcgAMwMCRB8DCmKFnAQEKDZDAwpmhZAQPC8CUDAsJB8DCmaFsr2hhc093blByb3BlcnR5MJILGMDAwAmQ2UpXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2dldFJhd1RhZy5qc5ihcgAPwAyRCsDCmKFyAwzAwJEHwMKYoWcBAQ4RkMDCmaFkBAkPwJQQDw0HwMKZoWy1bmF0aXZlT2JqZWN0VG9TdHJpbmcwkg8cwMDADZDZSlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fZ2V0UmF3VGFnLmpzmKFyABXAEJEOwMKYoXIDDMDAkQfAwpihZwEBEhaQwMKZoWQEGBPAlBQVExHAwpmhbK9zeW1Ub1N0cmluZ1RhZzCWExkaGx0ewMDAEZDZSlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fZ2V0UmF3VGFnLmpzmKFyAA/AFJESwMKYoXIDB8AVkQHAwpihcgMHwMCRAcDCmaFkASAXwJsYGRobHB0eFwoSDsDCmaFsqWdldFJhd1RhZ5IXO8DAwMCQ2UpXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2dldFJhd1RhZy5qc5ihcgkJwBiRFsDCmKFyGA/AGZEKwMKYoXIND8AakRLAwpihchUPwBuREsDCmKFyFg/AHJESwMKYoXJJFcAdkQ7Awpihcj4PwB6REsDCmKFyKQ/AwJESwMKXoW8BACAqkMCYoWcAASEjkMDCmaFkBBMiwJIiIMDCmaFsq29iamVjdFByb3RvkiImwMDAIJDZT1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fb2JqZWN0VG9TdHJpbmcuanOYoXIAC8DAkSHAwpihZwEBJCeQwMKZoWQECSXAlCYlIyHAwpmhbLRuYXRpdmVPYmplY3RUb1N0cmluZ5IlKcDAwCOQ2U9XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX29iamVjdFRvU3RyaW5nLmpzmKFyABTAJpEkwMKYoXIDC8DAkSHAwpmhZAEPKMCTKSgkwMKZoWyub2JqZWN0VG9TdHJpbmeSKDzAwMDAkNlPV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19vYmplY3RUb1N0cmluZy5qc5ihcgkOwCmRJ8DCmKFyExTAwJEkwMKXoW8BACs9kMCYoWcAASwwkMDCmaFkBBItLpItK8DCmaFsp251bGxUYWeSLTjAwMArkNlLV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlR2V0VGFnLmpzmKFyAAfAwJEswMKZoWQGFy/Aki8rwMKZoWysdW5kZWZpbmVkVGFnki83wMDAK5DZS1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZUdldFRhZy5qc5ihcgAMwMCRLsDCmKFnAQExNZDAwpmhZAQYMsCUMzQyMMDCmaFsrnN5bVRvU3RyaW5nVGFnkzI5OsDAwDCQ2UtXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VHZXRUYWcuanOYoXIADsAzkTHAwpihcgMHwDSRAcDCmKFyAwfAwJEBwMKZoWQBCjbAmjc4OTo7PDYuLDHAwpmhbKpiYXNlR2V0VGFnkjY/wMDAwJDZS1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZUdldFRhZy5qc5ihcgkKwDeRNcDCmKFyQgzAOJEuwMKYoXIDB8A5kSzAwpihchAOwDqRMcDCmKFyBA7AO5ExwMKYoXIUCcA8kRbAwpihcgoOwMCRJ8DCmKFnAQM+wJDAwpihZwkLP8CRP8DCmKFyAArAwJE1wMI=
====catalogjs annotation end====*/