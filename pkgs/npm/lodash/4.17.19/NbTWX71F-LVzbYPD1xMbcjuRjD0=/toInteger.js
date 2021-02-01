import { default as toFinite } from "./toFinite.js";
function toInteger(value) {
  var result = toFinite(value),
      remainder = result % 1;
  return result === result ? remainder ? result - remainder : result : 0;
}
export { toInteger as default };
/*====catalogjs annotation start====
k5GVwq0uL3RvRmluaXRlLmpzA8LAgadkZWZhdWx0lKFsqXRvSW50ZWdlcgnAm5ehbwAAA8CQwJmhZAkAAsCRAsDCmKFpqHRvRmluaXRlkgIHwACnZGVmYXVsdMDAmKFyCwjAwJEBwMKcoWkAGAEEkMDCAMLAwJehbwEABQiQwJmhZAByBsCSBwbAwpihbKl0b0ludGVnZXKSBgrAwMDA2UlXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvdG9JbnRlZ2VyLmpzmKFyCQnAB5EFwMKYoXIZCMDAkQHAwpihZwEDCcCQwMKYoWcJCwrAkQrAwpihcgAJwMCRBcDC
====catalogjs annotation end====*/