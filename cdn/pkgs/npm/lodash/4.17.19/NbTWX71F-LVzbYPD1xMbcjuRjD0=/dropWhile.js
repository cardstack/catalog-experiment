import { default as baseIteratee } from "./dist/6.js";
import { default as baseWhile } from "./dist/141.js";
function dropWhile(array, predicate) {
  return array && array.length ? baseWhile(array, baseIteratee(predicate, 3), true) : [];
}
export { dropWhile as default };
/*====catalogjs annotation start====
k5KVwqsuL2Rpc3QvNi5qcwPCwJXCrS4vZGlzdC8xNDEuanMHwsCBp2RlZmF1bHSVoWypZHJvcFdoaWxlD8DA3AARl6FvAAADwJDAmaFkCQACBJECwMKZoWmsYmFzZUl0ZXJhdGVlkgINwACnZGVmYXVsdMDAwJihcgsMwMCRAcDCnKFpAAEBB5EEwMIAwsDAmKFnCA3AwJDAwpmhZAkABgiRBsDCmaFpqWJhc2VXaGlsZZIGDMABp2RlZmF1bHTAwMCYoXILCcDAkQXAwpyhaQEBBQmRCMDCAcLAwJihZwgPwMCQwMKXoW8BAAoOkMCZoWQAHQvAkwwNC8DCmaFsqWRyb3BXaGlsZZILEMDAwMCQ2UlXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvZHJvcFdoaWxlLmpzmKFyCQnADJEKwMKYoXI2CcANkQXAwpihcggMwMCRAcDCmKFnAQMPwJDAwpihZwkLEMCREMDCmKFyAAnAwJEKwMI=
====catalogjs annotation end====*/