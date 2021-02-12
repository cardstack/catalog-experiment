import { default as copyObject } from "./54.js";
import { default as keys } from "../keys.js";
function baseAssign(object, source) {
  return object && copyObject(source, keys(source), object);
}
export { baseAssign as default };
/*====catalogjs annotation start====
k5KVwqcuLzU0LmpzA8LAlcKqLi4va2V5cy5qcwbCwIGnZGVmYXVsdJWhbKpiYXNlQXNzaWduDcDAn5ehbwAAA8CQwJmhZAkAAsCRAsDCmaFpqmNvcHlPYmplY3SSAgrAAKdkZWZhdWx0wMDAmKFyCwrAwJEBwMKcoWkAEgEGkMDCAMLAwJmhZAkABcCRBcDCmaFppGtleXOSBQvAAadkZWZhdWx0wMDAmKFyCwTAwJEEwMKcoWkBFQQHkMDCAcLAwJehbwEACAyQwJmhZAAUCcCTCgsJwMKZoWyqYmFzZUFzc2lnbpIJDsDAwMCQ2UtXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VBc3NpZ24uanOYoXIJCsAKkQjAwpihciYKwAuRAcDCmKFyCQTAwJEEwMKYoWcBAw3AkMDCmKFnCQsOwJEOwMKYoXIACsDAkQjAwg==
====catalogjs annotation end====*/