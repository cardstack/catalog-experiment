import { default as baseGet } from "./14.js";
import { default as baseSet } from "./16.js";
function baseUpdate(object, path, updater, customizer) {
  return baseSet(object, path, updater(baseGet(object, path)), customizer);
}
export { baseUpdate as default };
/*====catalogjs annotation start====
k5KVwqcuLzE0LmpzA8LAlcKnLi8xNi5qcwbCwIGnZGVmYXVsdJWhbKpiYXNlVXBkYXRlDcDAn5ehbwAAA8CQwJmhZAkAAsCRAsDCmaFpp2Jhc2VHZXSSAgvAAKdkZWZhdWx0wMDAmKFyCwfAwJEBwMKcoWkAEgEGkMDCAMLAwJmhZAkABcCRBcDCmaFpp2Jhc2VTZXSSBQrAAadkZWZhdWx0wMDAmKFyCwfAwJEEwMKcoWkBEgQHkMDCAcLAwJehbwEACAyQwJmhZAAfCcCTCgsJwMKZoWyqYmFzZVVwZGF0ZZIJDsDAwMCQ2UtXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VVcGRhdGUuanOYoXIJCsAKkQjAwpihci8HwAuRBMDCmKFyFwfAwJEBwMKYoWcBAw3AkMDCmKFnCQsOwJEOwMKYoXIACsDAkQjAwg==
====catalogjs annotation end====*/