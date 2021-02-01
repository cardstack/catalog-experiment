import { default as baseIteratee } from "./dist/6.js";
import { default as baseWhile } from "./dist/141.js";
function takeWhile(array, predicate) {
  return array && array.length ? baseWhile(array, baseIteratee(predicate, 3)) : [];
}
export { takeWhile as default };
/*====catalogjs annotation start====
k5KVwqsuL2Rpc3QvNi5qcwPCwJXCrS4vZGlzdC8xNDEuanMGwsCBp2RlZmF1bHSUoWypdGFrZVdoaWxlDcCfl6FvAAADwJDAmaFkCQACwJECwMKYoWmsYmFzZUl0ZXJhdGVlkgILwACnZGVmYXVsdMDAmKFyCwzAwJEBwMKcoWkAFgEGkMDCAMLAwJmhZAkABcCRBcDCmKFpqWJhc2VXaGlsZZIFCsABp2RlZmF1bHTAwJihcgsJwMCRBMDCnKFpARgEB5DAwgHCwMCXoW8BAAgMkMCZoWQAFwnAkwoLCcDCmKFsqXRha2VXaGlsZZIJDsDAwMDZSVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy90YWtlV2hpbGUuanOYoXIJCcAKkQjAwpihcjYJwAuRBMDCmKFyCAzAwJEBwMKYoWcBAw3AkMDCmKFnCQsOwJEOwMKYoXIACcDAkQjAwg==
====catalogjs annotation end====*/