import { default as root } from "./dist/93.js";
var nativeIsFinite = root.isFinite;
function isFinite0(value) {
  return typeof value == 'number' && nativeIsFinite(value);
}
export { isFinite0 as default };
/*====catalogjs annotation start====
k5GVwqwuL2Rpc3QvOTMuanMDwsCBp2RlZmF1bHSVoWypaXNGaW5pdGUwDcDAn5ehbwAAA8CQwJmhZAkAAsCRAsDCmaFppHJvb3SSAgjAAKdkZWZhdWx0wMDAmKFyCwTAwJEBwMKcoWkAFwEEkMDCAMLAwJehbwEABQyQwJihZwABBgmQwMKZoWQECQfAkwgHBcDCmaFsrm5hdGl2ZUlzRmluaXRlkgcLwMDABZDZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9pc0Zpbml0ZS5qc5ihcgAOwAiRBsDCmKFyAwTAwJEBwMKZoWQBCgrAkwsKBsDCmaFsqWlzRmluaXRlMJIKDsDAwMCQ2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvaXNGaW5pdGUuanOYoXIJCcALkQnAwpihci8OwMCRBsDCmKFnAQMNwJDAwpihZwkLDsCRDsDCmKFyAAnAwJEJwMI=
====catalogjs annotation end====*/