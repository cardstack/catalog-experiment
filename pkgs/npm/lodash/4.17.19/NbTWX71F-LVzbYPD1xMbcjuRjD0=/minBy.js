import { default as baseExtremum } from "./dist/28.js";
import { default as baseIteratee } from "./dist/6.js";
import { default as baseLt } from "./dist/166.js";
function minBy(array, iteratee) {
  return array && array.length ? baseExtremum(array, baseIteratee(iteratee, 2), baseLt) : undefined;
}
export { minBy as default };
/*====catalogjs annotation start====
k5OVwqwuL2Rpc3QvMjguanMDwsCVwqsuL2Rpc3QvNi5qcwbCwJXCrS4vZGlzdC8xNjYuanMJwsCBp2RlZmF1bHSUoWylbWluQnkRwNwAE5ehbwAAA8CQwJmhZAkAAsCRAsDCmKFprGJhc2VFeHRyZW11bZICDcAAp2RlZmF1bHTAwJihcgsMwMCRAcDCnKFpABcBBpDAwgDCwMCZoWQJAAXAkQXAwpihaaxiYXNlSXRlcmF0ZWWSBQ7AAadkZWZhdWx0wMCYoXILDMDAkQTAwpyhaQEWBAmQwMIBwsDAmaFkCQAIwJEIwMKYoWmmYmFzZUx0kggPwAKnZGVmYXVsdMDAmKFyCwbAwJEHwMKcoWkBGAcKkMDCAsLAwJehbwEACxCQwJmhZAAQDMCUDQ4PDMDCmKFspW1pbkJ5kgwSwMDAwNlFV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL21pbkJ5LmpzmKFyCQXADZELwMKYoXI1DMAOkQHAwpihcggMwA+RBMDCmKFyDwbAwJEHwMKYoWcBAxHAkMDCmKFnCQsSwJESwMKYoXIABcDAkQvAwg==
====catalogjs annotation end====*/