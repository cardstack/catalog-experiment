import { default as baseAssignValue } from "./dist/56.js";
import { default as baseForOwn } from "./dist/77.js";
import { default as baseIteratee } from "./dist/6.js";
function mapValues(object, iteratee) {
  var result = {};
  iteratee = baseIteratee(iteratee, 3);
  baseForOwn(object, function (value, key, object) {
    baseAssignValue(result, key, iteratee(value, key, object));
  });
  return result;
}
export { mapValues as default };
/*====catalogjs annotation start====
k5OVwqwuL2Rpc3QvNTYuanMDwsCVwqwuL2Rpc3QvNzcuanMGwsCVwqsuL2Rpc3QvNi5qcwnCwIGnZGVmYXVsdJShbKltYXBWYWx1ZXMRwNwAE5ehbwAAA8CQwJmhZAkAAsCRAsDCmKFpr2Jhc2VBc3NpZ25WYWx1ZZICD8AAp2RlZmF1bHTAwJihcgsPwMCRAcDCnKFpABcBBpDAwgDCwMCZoWQJAAXAkQXAwpihaapiYXNlRm9yT3dukgUOwAGnZGVmYXVsdMDAmKFyCwrAwJEEwMKcoWkBFwQJkMDCAcLAwJmhZAkACMCRCMDCmKFprGJhc2VJdGVyYXRlZZIIDcACp2RlZmF1bHTAwJihcgsMwMCRB8DCnKFpARYHCpDAwgLCwMCXoW8BAAsQkMCZoWQARQzAlA0ODwzAwpihbKltYXBWYWx1ZXOSDBLAwMDA2UlXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvbWFwVmFsdWVzLmpzmKFyCQnADZELwMKYoXI1DMAOkQfAwpihchEKwA+RBMDCmKFyLQ/AwJEBwMKYoWcBAxHAkMDCmKFnCQsSwJESwMKYoXIACcDAkQvAwg==
====catalogjs annotation end====*/