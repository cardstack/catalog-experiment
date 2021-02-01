import { default as baseForRight } from "./dist/159.js";
import { default as castFunction } from "./dist/108.js";
import { default as keysIn } from "./keysIn.js";
function forInRight(object, iteratee) {
  return object == null ? object : baseForRight(object, castFunction(iteratee), keysIn);
}
export { forInRight as default };
/*====catalogjs annotation start====
k5OVwq0uL2Rpc3QvMTU5LmpzA8LAlcKtLi9kaXN0LzEwOC5qcwbCwJXCqy4va2V5c0luLmpzCcLAgadkZWZhdWx0lKFsqmZvckluUmlnaHQRwNwAE5ehbwAAA8CQwJmhZAkAAsCRAsDCmKFprGJhc2VGb3JSaWdodJICDcAAp2RlZmF1bHTAwJihcgsMwMCRAcDCnKFpABgBBpDAwgDCwMCZoWQJAAXAkQXAwpihaaxjYXN0RnVuY3Rpb26SBQ7AAadkZWZhdWx0wMCYoXILDMDAkQTAwpyhaQEYBAmQwMIBwsDAmaFkCQAIwJEIwMKYoWmma2V5c0lukggPwAKnZGVmYXVsdMDAmKFyCwbAwJEHwMKcoWkBFgcKkMDCAsLAwJehbwEACxCQwJmhZAAEDMCUDQ4PDMDCmKFsqmZvckluUmlnaHSSDBLAwMDA2UpXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvZm9ySW5SaWdodC5qc5ihcgkKwA2RC8DCmKFyOAzADpEBwMKYoXIJDMAPkQTAwpihcgwGwMCRB8DCmKFnAQMRwJDAwpihZwkLEsCREsDCmKFyAArAwJELwMI=
====catalogjs annotation end====*/