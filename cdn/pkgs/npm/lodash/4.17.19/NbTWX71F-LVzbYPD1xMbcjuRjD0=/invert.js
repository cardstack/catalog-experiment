import { default as constant } from "./constant.js";
import { default as createInverter } from "./dist/76.js";
import { default as identity } from "./identity.js";
var objectProto = Object.prototype;
var nativeObjectToString = objectProto.toString;
var invert = createInverter(function (result, value, key) {
  if (value != null && typeof value.toString != 'function') {
    value = nativeObjectToString.call(value);
  }

  result[value] = key;
}, constant(identity));
export { invert as default };
/*====catalogjs annotation start====
k5OVwq0uL2NvbnN0YW50LmpzA8LAlcKsLi9kaXN0Lzc2LmpzBsLAlcKtLi9pZGVudGl0eS5qcwnCwIGnZGVmYXVsdJWhbKZpbnZlcnQbwMDcAB2XoW8AAAPAkRPAmaFkCQACwJECwMKZoWmoY29uc3RhbnSSAhjAAKdkZWZhdWx0wMDAmKFyCwjAwJEBwMKcoWkAGAEGkMDCAMLAwJmhZAkABcCRBcDCmaFprmNyZWF0ZUludmVydGVykgUWwAGnZGVmYXVsdMDAwJihcgsOwMCRBMDCnKFpARcECZDAwgHCwMCZoWQJAAjAkQjAwpmhaahpZGVudGl0eZIIGcACp2RlZmF1bHTAwMCYoXILCMDAkQfAwpyhaQEYBwqQwMICwsDAl6FvAQALGpDAmKFnAAEMDpDAwpmhZAQTDcCSDQvAwpmhbKtvYmplY3RQcm90b5INEcDAwAuQ2UZXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvaW52ZXJ0LmpzmKFyAAvAwJEMwMKYoWcBAQ8SkMDCmaFkBAkQwJQREA4MwMKZoWy0bmF0aXZlT2JqZWN0VG9TdHJpbmeSEBfAwMAOkNlGV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2ludmVydC5qc5ihcgAUwBGRD8DCmKFyAwvAwJEMwMKYoWcBARPAkMDCmaFkBAAUwJQUEhUPwMKZoWymaW52ZXJ0khQcwMDAEpDZRlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9pbnZlcnQuanOYoXIABsAVkRPAwpihZwMCFsCUFhcYGcDCmKFyAA7AF5EEwMKYoXJrFMAYkQ/Awpihci0IwBmRAcDCmKFyAQjAwJEHwMKYoWcBAxvAkMDCmKFnCQscwJEcwMKYoXIABsDAkRPAwg==
====catalogjs annotation end====*/