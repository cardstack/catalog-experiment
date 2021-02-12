import { default as baseIsNative } from "./69.js";
function getValue(object, key) {
  return object == null ? undefined : object[key];
}
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}
export { getNative as default };
/*====catalogjs annotation start====
k5GVwqcuLzY5LmpzA8LAgadkZWZhdWx0laFsqWdldE5hdGl2ZQ3AwJ+XoW8AAAPAkMCZoWQJAALAkQLAwpmhaaxiYXNlSXNOYXRpdmWSAgvAAKdkZWZhdWx0wMDAmKFyCwzAwJEBwMKcoWkAEgEEkMDCAMLAwJehbwEABQeQwJmhZABEBsCRBsDCmaFsqGdldFZhbHVlkgYKwMDAwJDZSVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fZ2V0VmFsdWUuanOYoXIJCMDAkQXAwpehbwEACAyQwJmhZAAeCcCTCgsJwMKZoWypZ2V0TmF0aXZlkgkOwMDAwJDZSlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fZ2V0TmF0aXZlLmpzmKFyCQnACpEIwMKYoXIeCMALkQXAwpihchgMwMCRAcDCmKFnAQMNwJDAwpihZwkLDsCRDsDCmKFyAAnAwJEIwMI=
====catalogjs annotation end====*/