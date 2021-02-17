import { default as baseUniq } from "./dist/63.js";
function uniqWith(array, comparator) {
  comparator = typeof comparator == 'function' ? comparator : undefined;
  return array && array.length ? baseUniq(array, undefined, comparator) : [];
}
export { uniqWith as default };
/*====catalogjs annotation start====
k5GVwqwuL2Rpc3QvNjMuanMDwsCBp2RlZmF1bHSVoWyodW5pcVdpdGgKwMCcl6FvAAADwJDAmaFkCQACBJECwMKZoWmoYmFzZVVuaXGSAgjAAKdkZWZhdWx0wMDAmKFyCwjAwJEBwMKcoWkAAQEFkQTAwgDCwMCYoWcIDsDAkMDCl6FvAQAGCZDAmaFkACYHwJIIB8DCmaFsqHVuaXFXaXRokgcLwMDAwJDZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy91bmlxV2l0aC5qc5ihcgkIwAiRBsDCmKFyzIAIwMCRAcDCmKFnAQMKwJDAwpihZwkLC8CRC8DCmKFyAAjAwJEGwMI=
====catalogjs annotation end====*/