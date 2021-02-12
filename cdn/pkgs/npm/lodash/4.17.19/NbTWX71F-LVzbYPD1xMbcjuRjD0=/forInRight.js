import { default as baseForRight } from "./dist/159.js";
import { default as castFunction } from "./dist/108.js";
import { default as keysIn } from "./keysIn.js";
function forInRight(object, iteratee) {
  return object == null ? object : baseForRight(object, castFunction(iteratee), keysIn);
}
export { forInRight as default };
/*====catalogjs annotation start====
k5OVwq0uL2Rpc3QvMTU5LmpzA8LAlcKtLi9kaXN0LzEwOC5qcwbCwJXCqy4va2V5c0luLmpzCcLAgadkZWZhdWx0laFsqmZvckluUmlnaHQRwMDcABOXoW8AAAPAkMCZoWQJAALAkQLAwpmhaaxiYXNlRm9yUmlnaHSSAg3AAKdkZWZhdWx0wMDAmKFyCwzAwJEBwMKcoWkAGAEGkMDCAMLAwJmhZAkABcCRBcDCmaFprGNhc3RGdW5jdGlvbpIFDsABp2RlZmF1bHTAwMCYoXILDMDAkQTAwpyhaQEYBAmQwMIBwsDAmaFkCQAIwJEIwMKZoWmma2V5c0lukggPwAKnZGVmYXVsdMDAwJihcgsGwMCRB8DCnKFpARYHCpDAwgLCwMCXoW8BAAsQkMCZoWQABAzAlA0ODwzAwpmhbKpmb3JJblJpZ2h0kgwSwMDAwJDZSlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9mb3JJblJpZ2h0LmpzmKFyCQrADZELwMKYoXI4DMAOkQHAwpihcgkMwA+RBMDCmKFyDAbAwJEHwMKYoWcBAxHAkMDCmKFnCQsSwJESwMKYoXIACsDAkQvAwg==
====catalogjs annotation end====*/