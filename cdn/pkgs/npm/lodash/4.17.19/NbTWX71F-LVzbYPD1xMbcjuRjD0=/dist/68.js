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
k5GVwqcuLzY5LmpzA8LAgadkZWZhdWx0laFsqWdldE5hdGl2ZQ7AwNwAEJehbwAAA8CQwJmhZAkAAgSRAsDCmaFprGJhc2VJc05hdGl2ZZICDMAAp2RlZmF1bHTAwMCYoXILDMDAkQHAwpyhaQABAQWRBMDCAMLAwJihZwgJwMCQwMKXoW8BAAYIkMCZoWQARAfAkQfAwpmhbKhnZXRWYWx1ZZIHC8DAwMCQ2UlXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2dldFZhbHVlLmpzmKFyCQjAwJEGwMKXoW8BAAkNkMCZoWQAHgrAkwsMCsDCmaFsqWdldE5hdGl2ZZIKD8DAwMCQ2UpXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2dldE5hdGl2ZS5qc5ihcgkJwAuRCcDCmKFyHgjADJEGwMKYoXIYDMDAkQHAwpihZwEDDsCQwMKYoWcJCw/AkQ/AwpihcgAJwMCRCcDC
====catalogjs annotation end====*/