import { default as createWrap } from "./dist/23.js";
var WRAP_CURRY_RIGHT_FLAG = 16;
function curryRight(func, arity, guard) {
  arity = guard ? undefined : arity;
  var result = createWrap(func, WRAP_CURRY_RIGHT_FLAG, undefined, undefined, undefined, undefined, undefined, arity);
  result.placeholder = curryRight.placeholder;
  return result;
}
curryRight.placeholder = {};
export { curryRight as default };
/*====catalogjs annotation start====
k5GVwqwuL2Rpc3QvMjMuanMDwsCBp2RlZmF1bHSUoWyqY3VycnlSaWdodBDA3AASl6FvAAADwJIIDcCZoWQJAALAkQLAwpihaapjcmVhdGVXcmFwkgIKwACnZGVmYXVsdMDAmKFyCwrAwJEBwMKcoWkAFwEEkMDCAMLAwJehbwEABQ+QwJihZwABBgiQwMKZoWQEBQfAkwcFDcDCmKFstVdSQVBfQ1VSUllfUklHSFRfRkxBR5IHC8DAwAXZSlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9jdXJyeVJpZ2h0LmpzmKFyABXAwJEGwMKZoWQBIAkNlgoLCQwGDcDCmKFsqmN1cnJ5UmlnaHSUCQwOEcDAwMDZSlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9jdXJyeVJpZ2h0LmpzmKFyCQrACpEIwMKYoXJLCsALkQHAwpihcgcVwAyRBsDCmKFyWArAwJEIwMKYoWcBEg7AkQ7Aw5ihcgAKwMCRCMDCmKFnAQMQwJDAwpihZwkLEcCREcDCmKFyAArAwJEIwMI=
====catalogjs annotation end====*/