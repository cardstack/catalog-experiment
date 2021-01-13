import { default as baseIteratee } from "./dist/6.js";
import { default as baseWhile } from "./dist/141.js";
function dropWhile(array, predicate) {
  return array && array.length ? baseWhile(array, baseIteratee(predicate, 3), true) : [];
}
export { dropWhile as default };
/*====catalogjs annotation start====
k5KVwqsuL2Rpc3QvNi5qcwPCwJXCrS4vZGlzdC8xNDEuanMGwsCBp2RlZmF1bHSUoWypZHJvcFdoaWxlDcCfl6FvAAADwJEIwJmhZAkAAsCRAsDCmKFprGJhc2VJdGVyYXRlZZICC8AAp2RlZmF1bHTAwJihcgsMwMCRAcDCnKFpABYBBpDAwgDCwMCZoWQJAAXAkQXAwpihaaliYXNlV2hpbGWSBQrAAadkZWZhdWx0wMCYoXILCcDAkQTAwpyhaQEYBAeQwMIBwsDAl6FvAQAIDJDAmaFkAB0JwJMKCwnAwpihbKlkcm9wV2hpbGWSCQ7AwMDA2UlXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvZHJvcFdoaWxlLmpzmKFyCQnACpEIwMKYoXI2CcALkQTAwpihcggMwMCRAcDCmKFnAQMNwJDAwpihZwkLDsCRDsDCmKFyAAnAwJEIwMI=
====catalogjs annotation end====*/