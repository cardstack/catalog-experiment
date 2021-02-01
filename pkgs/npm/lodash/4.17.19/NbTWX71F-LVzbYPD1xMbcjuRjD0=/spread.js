import { default as apply } from "./dist/111.js";
import { default as arrayPush } from "./dist/139.js";
import { default as baseRest } from "./dist/49.js";
import { default as castSlice } from "./dist/140.js";
import { default as toInteger } from "./toInteger.js";
var FUNC_ERROR_TEXT = 'Expected a function';
var nativeMax = Math.max;
function spread(func, start) {
  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }

  start = start == null ? 0 : nativeMax(toInteger(start), 0);
  return baseRest(function (args) {
    var array = args[start],
        otherArgs = castSlice(args, 0, start);

    if (array) {
      arrayPush(otherArgs, array);
    }

    return apply(func, this, otherArgs);
  });
}
export { spread as default };
/*====catalogjs annotation start====
k5WVwq0uL2Rpc3QvMTExLmpzA8LAlcKtLi9kaXN0LzEzOS5qcwbCwJXCrC4vZGlzdC80OS5qcwnCwJXCrS4vZGlzdC8xNDAuanMMwsCVwq4uL3RvSW50ZWdlci5qcw/CwIGnZGVmYXVsdJShbKZzcHJlYWQhwNwAI5ehbwAAA8CQwJmhZAkAAsCRAsDCmKFppWFwcGx5kgIfwACnZGVmYXVsdMDAmKFyCwXAwJEBwMKcoWkAGAEGkMDCAMLAwJmhZAkABcCRBcDCmKFpqWFycmF5UHVzaJIFHsABp2RlZmF1bHTAwJihcgsJwMCRBMDCnKFpARgECZDAwgHCwMCZoWQJAAjAkQjAwpihaahiYXNlUmVzdJIIHMACp2RlZmF1bHTAwJihcgsIwMCRB8DCnKFpARcHDJDAwgLCwMCZoWQJAAvAkQvAwpihaaljYXN0U2xpY2WSCx3AA6dkZWZhdWx0wMCYoXILCcDAkQrAwpyhaQEYCg+QwMIDwsDAmaFkCQAOwJEOwMKYoWmpdG9JbnRlZ2Vykg4bwASnZGVmYXVsdMDAmKFyCwnAwJENwMKcoWkBGQ0QkMDCBMLAwJehbwEAESCQwJihZwABEhSQwMKZoWQEGBPAkhMRwMKYoWyvRlVOQ19FUlJPUl9URVhUkhMZwMDAEdlGV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3NwcmVhZC5qc5ihcgAPwMCREsDCmKFnAQEVF5DAwpmhZAQLFsCSFhTAwpihbKluYXRpdmVNYXiSFhrAwMAU2UZXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvc3ByZWFkLmpzmKFyAAnAwJEVwMKZoWQBIBjAmhkaGxwdHh8YEhXAwpihbKZzcHJlYWSSGCLAwMDA2UZXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvc3ByZWFkLmpzmKFyCQbAGZEXwMKYoXJLD8AakRLAwpihciYJwBuRFcDCmKFyAQnAHJENwMKYoXIWCMAdkQfAwpihckQJwB6RCsDCmKFyKgnAH5EEwMKYoXImBcDAkQHAwpihZwEDIcCQwMKYoWcJCyLAkSLAwpihcgAGwMCRF8DC
====catalogjs annotation end====*/