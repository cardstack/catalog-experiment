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
k5WVwq0uL2Rpc3QvMTExLmpzA8LAlcKtLi9kaXN0LzEzOS5qcwbCwJXCrC4vZGlzdC80OS5qcwnCwJXCrS4vZGlzdC8xNDAuanMMwsCVwq4uL3RvSW50ZWdlci5qcw/CwIGnZGVmYXVsdJWhbKZzcHJlYWQhwMDcACOXoW8AAAPAkMCZoWQJAALAkQLAwpmhaaVhcHBseZICH8AAp2RlZmF1bHTAwMCYoXILBcDAkQHAwpyhaQAYAQaQwMIAwsDAmaFkCQAFwJEFwMKZoWmpYXJyYXlQdXNokgUewAGnZGVmYXVsdMDAwJihcgsJwMCRBMDCnKFpARgECZDAwgHCwMCZoWQJAAjAkQjAwpmhaahiYXNlUmVzdJIIHMACp2RlZmF1bHTAwMCYoXILCMDAkQfAwpyhaQEXBwyQwMICwsDAmaFkCQALwJELwMKZoWmpY2FzdFNsaWNlkgsdwAOnZGVmYXVsdMDAwJihcgsJwMCRCsDCnKFpARgKD5DAwgPCwMCZoWQJAA7AkQ7Awpmhaal0b0ludGVnZXKSDhvABKdkZWZhdWx0wMDAmKFyCwnAwJENwMKcoWkBGQ0QkMDCBMLAwJehbwEAESCQwJihZwABEhSQwMKZoWQEGBPAkhMRwMKZoWyvRlVOQ19FUlJPUl9URVhUkhMZwMDAEZDZRlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9zcHJlYWQuanOYoXIAD8DAkRLAwpihZwEBFReQwMKZoWQECxbAkhYUwMKZoWypbmF0aXZlTWF4khYawMDAFJDZRlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9zcHJlYWQuanOYoXIACcDAkRXAwpmhZAEgGMCaGRobHB0eHxgSFcDCmaFspnNwcmVhZJIYIsDAwMCQ2UZXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvc3ByZWFkLmpzmKFyCQbAGZEXwMKYoXJLD8AakRLAwpihciYJwBuRFcDCmKFyAQnAHJENwMKYoXIWCMAdkQfAwpihckQJwB6RCsDCmKFyKgnAH5EEwMKYoXImBcDAkQHAwpihZwEDIcCQwMKYoWcJCyLAkSLAwpihcgAGwMCRF8DC
====catalogjs annotation end====*/