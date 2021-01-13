import { default as baseGetTag } from "./dist/86.js";
import { default as isObjectLike } from "./isObjectLike.js";
var boolTag = '[object Boolean]';
function isBoolean(value) {
  return value === true || value === false || isObjectLike(value) && baseGetTag(value) == boolTag;
}
export { isBoolean as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvODYuanMDwsCVwrEuL2lzT2JqZWN0TGlrZS5qcwbCwIGnZGVmYXVsdJShbKlpc0Jvb2xlYW4RwNwAE5ehbwAAA8CRC8CZoWQJAALAkQLAwpihaapiYXNlR2V0VGFnkgIOwACnZGVmYXVsdMDAmKFyCwrAwJEBwMKcoWkAFwEGkMDCAMLAwJmhZAkABcCRBcDCmKFprGlzT2JqZWN0TGlrZZIFDcABp2RlZmF1bHTAwJihcgsMwMCRBMDCnKFpARwEB5DAwgHCwMCXoW8BAAgQkMCYoWcAAQkLkMDCmaFkBBUKwJIKCMDCmKFsp2Jvb2xUYWeSCg/AwMAI2UlXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvaXNCb29sZWFuLmpzmKFyAAfAwJEJwMKZoWQBAwzAlQ0ODwwJwMKYoWypaXNCb29sZWFukgwSwMDAwNlJV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2lzQm9vbGVhbi5qc5ihcgkJwA2RC8DCmKFyOAzADpEEwMKYoXILCsAPkQHAwpihcgsHwMCRCcDCmKFnAQMRwJDAwpihZwkLEsCREsDCmKFyAAnAwJELwMI=
====catalogjs annotation end====*/