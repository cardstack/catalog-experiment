import { default as baseIteratee } from "./dist/6.js";
import { default as baseWhile } from "./dist/141.js";
function dropRightWhile(array, predicate) {
  return array && array.length ? baseWhile(array, baseIteratee(predicate, 3), true, true) : [];
}
export { dropRightWhile as default };
/*====catalogjs annotation start====
k5KVwqsuL2Rpc3QvNi5qcwPCwJXCrS4vZGlzdC8xNDEuanMHwsCBp2RlZmF1bHSVoWyuZHJvcFJpZ2h0V2hpbGUPwMDcABGXoW8AAAPAkMCZoWQJAAIEkQLAwpmhaaxiYXNlSXRlcmF0ZWWSAg3AAKdkZWZhdWx0wMDAmKFyCwzAwJEBwMKcoWkAAQEHkQTAwgDCwMCYoWcIDcDAkMDCmaFkCQAGCJEGwMKZoWmpYmFzZVdoaWxlkgYMwAGnZGVmYXVsdMDAwJihcgsJwMCRBcDCnKFpAQEFCZEIwMIBwsDAmKFnCA/AwJDAwpehbwEACg6QwJmhZAAjC8CTDA0LwMKZoWyuZHJvcFJpZ2h0V2hpbGWSCxDAwMDAkNlOV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2Ryb3BSaWdodFdoaWxlLmpzmKFyCQ7ADJEKwMKYoXI2CcANkQXAwpihcggMwMCRAcDCmKFnAQMPwJDAwpihZwkLEMCREMDCmKFyAA7AwJEKwMI=
====catalogjs annotation end====*/