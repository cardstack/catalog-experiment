import { default as arrayLikeKeys } from "./dist/84.js";
import { default as baseKeys } from "./dist/132.js";
import { default as isArrayLike } from "./isArrayLike.js";
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}
export { keys as default };
/*====catalogjs annotation start====
k5OVwqwuL2Rpc3QvODQuanMDwsCVwq0uL2Rpc3QvMTMyLmpzBsLAlcKwLi9pc0FycmF5TGlrZS5qcwnCwIGnZGVmYXVsdJShbKRrZXlzEcDcABOXoW8AAAPAkMCZoWQJAALAkQLAwpihaa1hcnJheUxpa2VLZXlzkgIOwACnZGVmYXVsdMDAmKFyCw3AwJEBwMKcoWkAFwEGkMDCAMLAwJmhZAkABcCRBcDCmKFpqGJhc2VLZXlzkgUPwAGnZGVmYXVsdMDAmKFyCwjAwJEEwMKcoWkBGAQJkMDCAcLAwJmhZAkACMCRCMDCmKFpq2lzQXJyYXlMaWtlkggNwAKnZGVmYXVsdMDAmKFyCwvAwJEHwMKcoWkBGwcKkMDCAsLAwJehbwEACxCQwJmhZAALDMCUDQ4PDMDCmKFspGtleXOSDBLAwMDA2URXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMva2V5cy5qc5ihcgkEwA2RC8DCmKFyFAvADpEHwMKYoXILDcAPkQHAwpihcgsIwMCRBMDCmKFnAQMRwJDAwpihZwkLEsCREsDCmKFyAATAwJELwMI=
====catalogjs annotation end====*/