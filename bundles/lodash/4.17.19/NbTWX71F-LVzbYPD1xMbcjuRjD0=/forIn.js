import { default as baseFor } from "./dist/158.js";
import { default as castFunction } from "./dist/108.js";
import { default as keysIn } from "./keysIn.js";
function forIn(object, iteratee) {
  return object == null ? object : baseFor(object, castFunction(iteratee), keysIn);
}
export { forIn as default };
/*====catalogjs annotation start====
k5OVwq0uL2Rpc3QvMTU4LmpzA8LAlcKtLi9kaXN0LzEwOC5qcwbCwJXCqy4va2V5c0luLmpzCcLAgadkZWZhdWx0lKFspWZvckluEcDcABOXoW8AAAPAkQvAmaFkCQACwJECwMKYoWmnYmFzZUZvcpICDcAAp2RlZmF1bHTAwJihcgsHwMCRAcDCnKFpABgBBpDAwgDCwMCZoWQJAAXAkQXAwpihaaxjYXN0RnVuY3Rpb26SBQ7AAadkZWZhdWx0wMCYoXILDMDAkQTAwpyhaQEYBAmQwMIBwsDAmaFkCQAIwJEIwMKYoWmma2V5c0lukggPwAKnZGVmYXVsdMDAmKFyCwbAwJEHwMKcoWkBFgcKkMDCAsLAwJehbwEACxCQwJmhZAAEDMCUDQ4PDMDCmKFspWZvcklukgwSwMDAwNlFV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2ZvckluLmpzmKFyCQXADZELwMKYoXI4B8AOkQHAwpihcgkMwA+RBMDCmKFyDAbAwJEHwMKYoWcBAxHAkMDCmKFnCQsSwJESwMKYoXIABcDAkQvAwg==
====catalogjs annotation end====*/