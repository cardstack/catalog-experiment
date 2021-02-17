import { default as baseGetTag } from "./dist/86.js";
import { default as isObjectLike } from "./isObjectLike.js";
var boolTag = '[object Boolean]';
function isBoolean(value) {
  return value === true || value === false || isObjectLike(value) && baseGetTag(value) == boolTag;
}
export { isBoolean as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvODYuanMDwsCVwrEuL2lzT2JqZWN0TGlrZS5qcwfCwIGnZGVmYXVsdJWhbKlpc0Jvb2xlYW4TwMDcABWXoW8AAAPAkMCZoWQJAAIEkQLAwpmhaapiYXNlR2V0VGFnkgIQwACnZGVmYXVsdMDAwJihcgsKwMCRAcDCnKFpAAEBB5EEwMIAwsDAmKFnCA7AwJDAwpmhZAkABgiRBsDCmaFprGlzT2JqZWN0TGlrZZIGD8ABp2RlZmF1bHTAwMCYoXILDMDAkQXAwpyhaQEBBQmRCMDCAcLAwJihZwgTwMCQwMKXoW8BAAoSkMCYoWcAAQsNkMDCmaFkBBUMwJIMCsDCmaFsp2Jvb2xUYWeSDBHAwMAKkNlJV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2lzQm9vbGVhbi5qc5ihcgAHwMCRC8DCmaFkAQMOwJUPEBEOC8DCmaFsqWlzQm9vbGVhbpIOFMDAwMCQ2UlXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvaXNCb29sZWFuLmpzmKFyCQnAD5ENwMKYoXI4DMAQkQXAwpihcgsKwBGRAcDCmKFyCwfAwJELwMKYoWcBAxPAkMDCmKFnCQsUwJEUwMKYoXIACcDAkQ3Awg==
====catalogjs annotation end====*/