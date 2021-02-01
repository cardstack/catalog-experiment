import { default as baseGetTag } from "./dist/86.js";
import { default as isObjectLike } from "./isObjectLike.js";
import { default as isPlainObject } from "./isPlainObject.js";
var domExcTag = '[object DOMException]',
    errorTag = '[object Error]';
function isError(value) {
  if (!isObjectLike(value)) {
    return false;
  }

  var tag = baseGetTag(value);
  return tag == errorTag || tag == domExcTag || typeof value.message == 'string' && typeof value.name == 'string' && !isPlainObject(value);
}
export { isError as default };
/*====catalogjs annotation start====
k5OVwqwuL2Rpc3QvODYuanMDwsCVwrEuL2lzT2JqZWN0TGlrZS5qcwbCwJXCsi4vaXNQbGFpbk9iamVjdC5qcwnCwIGnZGVmYXVsdJShbKdpc0Vycm9yGMDcABqXoW8AAAPAkMCZoWQJAALAkQLAwpihaapiYXNlR2V0VGFnkgITwACnZGVmYXVsdMDAmKFyCwrAwJEBwMKcoWkAFwEGkMDCAMLAwJmhZAkABcCRBcDCmKFprGlzT2JqZWN0TGlrZZIFEsABp2RlZmF1bHTAwJihcgsMwMCRBMDCnKFpARwECZDAwgHCwMCZoWQJAAjAkQjAwpihaa1pc1BsYWluT2JqZWN0kggWwAKnZGVmYXVsdMDAmKFyCw3AwJEHwMKcoWkBHQcKkMDCAsLAwJehbwEACxeQwJihZwABDBCQwMKZoWQEGg0Okg0LwMKYoWypZG9tRXhjVGFnkg0VwMDAC9lHV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2lzRXJyb3IuanOYoXIACcDAkQzAwpmhZAYTD8CSDwvAwpihbKhlcnJvclRhZ5IPFMDAwAvZR1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9pc0Vycm9yLmpzmKFyAAjAwJEOwMKZoWQBChHAmBITFBUWEQ4MwMKYoWynaXNFcnJvcpIRGcDAwMDZR1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9pc0Vycm9yLmpzmKFyCQfAEpEQwMKYoXIRDMATkQTAwpihci4KwBSRAcDCmKFyGQjAFZEOwMKYoXILCcAWkQzAwpihckoNwMCRB8DCmKFnAQMYwJDAwpihZwkLGcCRGcDCmKFyAAfAwJEQwMI=
====catalogjs annotation end====*/