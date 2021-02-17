import { default as baseIteratee } from "./dist/6.js";
import { default as baseWhile } from "./dist/141.js";
function takeRightWhile(array, predicate) {
  return array && array.length ? baseWhile(array, baseIteratee(predicate, 3), false, true) : [];
}
export { takeRightWhile as default };
/*====catalogjs annotation start====
k5KVwqsuL2Rpc3QvNi5qcwPCwJXCrS4vZGlzdC8xNDEuanMGwsCBp2RlZmF1bHSVoWyudGFrZVJpZ2h0V2hpbGUNwMCfl6FvAAADwJDAmaFkCQACwJECwMKZoWmsYmFzZUl0ZXJhdGVlkgILwACnZGVmYXVsdMDAwJihcgsMwMCRAcDCnKFpABYBBpDAwgDCwMCZoWQJAAXAkQXAwpmhaaliYXNlV2hpbGWSBQrAAadkZWZhdWx0wMDAmKFyCwnAwJEEwMKcoWkBGAQHkMDCAcLAwJehbwEACAyQwJmhZAAkCcCTCgsJwMKZoWyudGFrZVJpZ2h0V2hpbGWSCQ7AwMDAkNlOV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3Rha2VSaWdodFdoaWxlLmpzmKFyCQ7ACpEIwMKYoXI2CcALkQTAwpihcggMwMCRAcDCmKFnAQMNwJDAwpihZwkLDsCRDsDCmKFyAA7AwJEIwMI=
====catalogjs annotation end====*/