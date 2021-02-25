import { default as identity } from "../identity.js";
function castFunction(value) {
  return typeof value == 'function' ? value : identity;
}
export { castFunction as default };
/*====catalogjs annotation start====
k5GVwq4uLi9pZGVudGl0eS5qcwPCwIGnZGVmYXVsdJWhbKxjYXN0RnVuY3Rpb24KwMCcl6FvAAADwJDAmaFkCQACBJECwMKZoWmoaWRlbnRpdHmSAgjAAKdkZWZhdWx0wMDAmKFyCwjAwJEBwMKcoWkAAQEFkQTAwgDCwMCYoWcIEMDAkMDCl6FvAQAGCZDAmaFkAAMHwJIIB8DCmaFsrGNhc3RGdW5jdGlvbpIHC8DAwMCQ2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Nhc3RGdW5jdGlvbi5qc5ihcgkMwAiRBsDCmKFyOAjAwJEBwMKYoWcBAwrAkMDCmKFnCQsLwJELwMKYoXIADMDAkQbAwg==
====catalogjs annotation end====*/