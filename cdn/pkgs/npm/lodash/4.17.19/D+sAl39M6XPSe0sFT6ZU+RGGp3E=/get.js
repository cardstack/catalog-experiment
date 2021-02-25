import { default as baseGet } from "./dist/14.js";
function get(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet(object, path);
  return result === undefined ? defaultValue : result;
}
export { get as default };
/*====catalogjs annotation start====
k5GVwqwuL2Rpc3QvMTQuanMDwsCBp2RlZmF1bHSVoWyjZ2V0CsDAnJehbwAAA8CQwJmhZAkAAgSRAsDCmaFpp2Jhc2VHZXSSAgjAAKdkZWZhdWx0wMDAmKFyCwfAwJEBwMKcoWkAAQEFkQTAwgDCwMCYoWcIDsDAkMDCl6FvAQAGCZDAmaFkAEgHwJIIB8DCmaFso2dldJIHC8DAwMCQ2UNXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvZ2V0LmpzmKFyCQPACJEGwMKYoXJLB8DAkQHAwpihZwEDCsCQwMKYoWcJCwvAkQvAwpihcgADwMCRBsDC
====catalogjs annotation end====*/