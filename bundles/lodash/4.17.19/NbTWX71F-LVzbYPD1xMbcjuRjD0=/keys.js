import { default as arrayLikeKeys } from "./dist/84.js";
import { default as baseKeys } from "./dist/132.js";
import { default as isArrayLike } from "./isArrayLike.js";
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}
export { keys as default };
/*====catalogjs annotation start====
k5OVwqwuL2Rpc3QvODQuanMDwsCVwq0uL2Rpc3QvMTMyLmpzBsLAlcKwLi9pc0FycmF5TGlrZS5qcwnCwIGnZGVmYXVsdJShbKRrZXlzEcDcABOXoW8AAAPAkQvAmaFkCQACwJECwMKYoWmtYXJyYXlMaWtlS2V5c5ICDsAAp2RlZmF1bHTAwJihcgsNwMCRAcDCnKFpABcBBpDAwgDCwMCZoWQJAAXAkQXAwpihaahiYXNlS2V5c5IFD8ABp2RlZmF1bHTAwJihcgsIwMCRBMDCnKFpARgECZDAwgHCwMCZoWQJAAjAkQjAwpihaatpc0FycmF5TGlrZZIIDcACp2RlZmF1bHTAwJihcgsLwMCRB8DCnKFpARsHCpDAwgLCwMCXoW8BAAsQkMCZoWQACwzAlA0ODwzAwpihbKRrZXlzkgwSwMDAwNlEV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2tleXMuanOYoXIJBMANkQvAwpihchQLwA6RB8DCmKFyCw3AD5EBwMKYoXILCMDAkQTAwpihZwEDEcCQwMKYoWcJCxLAkRLAwpihcgAEwMCRC8DC
====catalogjs annotation end====*/