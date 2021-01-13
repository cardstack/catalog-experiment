import { default as toInteger } from "./toInteger.js";
function isInteger(value) {
  return typeof value == 'number' && value == toInteger(value);
}
export { isInteger as default };
/*====catalogjs annotation start====
k5GVwq4uL3RvSW50ZWdlci5qcwPCwIGnZGVmYXVsdJShbKlpc0ludGVnZXIJwJuXoW8AAAPAkQXAmaFkCQACwJECwMKYoWmpdG9JbnRlZ2VykgIHwACnZGVmYXVsdMDAmKFyCwnAwJEBwMKcoWkAGQEEkMDCAMLAwJehbwEABQiQwJmhZAAKBsCSBwbAwpihbKlpc0ludGVnZXKSBgrAwMDA2UlXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvaXNJbnRlZ2VyLmpzmKFyCQnAB5EFwMKYoXI4CcDAkQHAwpihZwEDCcCQwMKYoWcJCwrAkQrAwpihcgAJwMCRBcDC
====catalogjs annotation end====*/