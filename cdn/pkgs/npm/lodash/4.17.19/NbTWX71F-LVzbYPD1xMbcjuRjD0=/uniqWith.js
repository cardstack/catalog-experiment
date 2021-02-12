import { default as baseUniq } from "./dist/63.js";
function uniqWith(array, comparator) {
  comparator = typeof comparator == 'function' ? comparator : undefined;
  return array && array.length ? baseUniq(array, undefined, comparator) : [];
}
export { uniqWith as default };
/*====catalogjs annotation start====
k5GVwqwuL2Rpc3QvNjMuanMDwsCBp2RlZmF1bHSVoWyodW5pcVdpdGgJwMCbl6FvAAADwJDAmaFkCQACwJECwMKZoWmoYmFzZVVuaXGSAgfAAKdkZWZhdWx0wMDAmKFyCwjAwJEBwMKcoWkAFwEEkMDCAMLAwJehbwEABQiQwJmhZAAmBsCSBwbAwpmhbKh1bmlxV2l0aJIGCsDAwMCQ2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvdW5pcVdpdGguanOYoXIJCMAHkQXAwpihcsyACMDAkQHAwpihZwEDCcCQwMKYoWcJCwrAkQrAwpihcgAIwMCRBcDC
====catalogjs annotation end====*/