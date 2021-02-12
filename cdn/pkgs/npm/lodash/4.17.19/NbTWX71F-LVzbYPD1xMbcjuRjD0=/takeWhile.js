import { default as baseIteratee } from "./dist/6.js";
import { default as baseWhile } from "./dist/141.js";
function takeWhile(array, predicate) {
  return array && array.length ? baseWhile(array, baseIteratee(predicate, 3)) : [];
}
export { takeWhile as default };
/*====catalogjs annotation start====
k5KVwqsuL2Rpc3QvNi5qcwPCwJXCrS4vZGlzdC8xNDEuanMGwsCBp2RlZmF1bHSVoWypdGFrZVdoaWxlDcDAn5ehbwAAA8CQwJmhZAkAAsCRAsDCmaFprGJhc2VJdGVyYXRlZZICC8AAp2RlZmF1bHTAwMCYoXILDMDAkQHAwpyhaQAWAQaQwMIAwsDAmaFkCQAFwJEFwMKZoWmpYmFzZVdoaWxlkgUKwAGnZGVmYXVsdMDAwJihcgsJwMCRBMDCnKFpARgEB5DAwgHCwMCXoW8BAAgMkMCZoWQAFwnAkwoLCcDCmaFsqXRha2VXaGlsZZIJDsDAwMCQ2UlXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvdGFrZVdoaWxlLmpzmKFyCQnACpEIwMKYoXI2CcALkQTAwpihcggMwMCRAcDCmKFnAQMNwJDAwpihZwkLDsCRDsDCmKFyAAnAwJEIwMI=
====catalogjs annotation end====*/