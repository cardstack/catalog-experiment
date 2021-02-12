import { default as baseSum } from "./168.js";
var NAN = 0 / 0;
function baseMean(array, iteratee) {
  var length = array == null ? 0 : array.length;
  return length ? baseSum(array, iteratee) / length : NAN;
}
export { baseMean as default };
/*====catalogjs annotation start====
k5GVwqguLzE2OC5qcwPCwIGnZGVmYXVsdJWhbKhiYXNlTWVhbg3AwJ+XoW8AAAPAkMCZoWQJAALAkQLAwpmhaadiYXNlU3VtkgIKwACnZGVmYXVsdMDAwJihcgsHwMCRAcDCnKFpABMBBJDAwgDCwMCXoW8BAAUMkMCYoWcAAQYIkMDCmaFkBAgHwJIHBcDCmaFso05BTpIHC8DAwAWQ2UlXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VNZWFuLmpzmKFyAAPAwJEGwMKZoWQBAwnAlAoLCQbAwpmhbKhiYXNlTWVhbpIJDsDAwMCQ2UlXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VNZWFuLmpzmKFyCQjACpEIwMKYoXJXB8ALkQHAwpihch0DwMCRBsDCmKFnAQMNwJDAwpihZwkLDsCRDsDCmKFyAAjAwJEIwMI=
====catalogjs annotation end====*/