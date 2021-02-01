import { default as baseIteratee } from "./dist/6.js";
import { default as baseWhile } from "./dist/141.js";
function dropWhile(array, predicate) {
  return array && array.length ? baseWhile(array, baseIteratee(predicate, 3), true) : [];
}
export { dropWhile as default };
/*====catalogjs annotation start====
k5KVwqsuL2Rpc3QvNi5qcwPCwJXCrS4vZGlzdC8xNDEuanMGwsCBp2RlZmF1bHSUoWypZHJvcFdoaWxlDcCfl6FvAAADwJDAmaFkCQACwJECwMKYoWmsYmFzZUl0ZXJhdGVlkgILwACnZGVmYXVsdMDAmKFyCwzAwJEBwMKcoWkAFgEGkMDCAMLAwJmhZAkABcCRBcDCmKFpqWJhc2VXaGlsZZIFCsABp2RlZmF1bHTAwJihcgsJwMCRBMDCnKFpARgEB5DAwgHCwMCXoW8BAAgMkMCZoWQAHQnAkwoLCcDCmKFsqWRyb3BXaGlsZZIJDsDAwMDZSVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9kcm9wV2hpbGUuanOYoXIJCcAKkQjAwpihcjYJwAuRBMDCmKFyCAzAwJEBwMKYoWcBAw3AkMDCmKFnCQsOwJEOwMKYoXIACcDAkQjAwg==
====catalogjs annotation end====*/