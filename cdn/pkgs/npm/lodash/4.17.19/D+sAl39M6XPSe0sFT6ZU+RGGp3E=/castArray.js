import { default as isArray } from "./isArray.js";
function castArray() {
  if (!arguments.length) {
    return [];
  }

  var value = arguments[0];
  return isArray(value) ? value : [value];
}
export { castArray as default };
/*====catalogjs annotation start====
k5GVwqwuL2lzQXJyYXkuanMDwsCBp2RlZmF1bHSVoWypY2FzdEFycmF5CsDAnJehbwAAA8CQwJmhZAkAAgSRAsDCmaFpp2lzQXJyYXmSAgjAAKdkZWZhdWx0wMDAmKFyCwfAwJEBwMKcoWkAAQEFkQTAwgDCwMCYoWcIDsDAkMDCl6FvAQAGCZDAmaFkABwHwJIIB8DCmaFsqWNhc3RBcnJheZIHC8DAwMCQ2UlXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvY2FzdEFycmF5LmpzmKFyCQnACJEGwMKYoXJZB8DAkQHAwpihZwEDCsCQwMKYoWcJCwvAkQvAwpihcgAJwMCRBsDC
====catalogjs annotation end====*/