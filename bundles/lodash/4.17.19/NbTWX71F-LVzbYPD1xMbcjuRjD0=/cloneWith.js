import { default as baseClone } from "./dist/40.js";
var CLONE_SYMBOLS_FLAG = 4;
function cloneWith(value, customizer) {
  customizer = typeof customizer == 'function' ? customizer : undefined;
  return baseClone(value, CLONE_SYMBOLS_FLAG, customizer);
}
export { cloneWith as default };
/*====catalogjs annotation start====
k5GVwqwuL2Rpc3QvNDAuanMDwsCBp2RlZmF1bHSUoWypY2xvbmVXaXRoDcCfl6FvAAADwJEIwJmhZAkAAsCRAsDCmKFpqWJhc2VDbG9uZZICCsAAp2RlZmF1bHTAwJihcgsJwMCRAcDCnKFpABcBBJDAwgDCwMCXoW8BAAUMkMCYoWcAAQYIkMDCmaFkBAQHwJIHBcDCmKFsskNMT05FX1NZTUJPTFNfRkxBR5IHC8DAwAXZSVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9jbG9uZVdpdGguanOYoXIAEsDAkQbAwpmhZAEQCcCUCgsJBsDCmKFsqWNsb25lV2l0aJIJDsDAwMDZSVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9jbG9uZVdpdGguanOYoXIJCcAKkQjAwpihcmgJwAuRAcDCmKFyCBLAwJEGwMKYoWcBAw3AkMDCmKFnCQsOwJEOwMKYoXIACcDAkQjAwg==
====catalogjs annotation end====*/