import { default as isArrayLikeObject } from "../isArrayLikeObject.js";
function castArrayLikeObject(value) {
  return isArrayLikeObject(value) ? value : [];
}
export { castArrayLikeObject as default };
/*====catalogjs annotation start====
k5GVwrcuLi9pc0FycmF5TGlrZU9iamVjdC5qcwPCwIGnZGVmYXVsdJWhbLNjYXN0QXJyYXlMaWtlT2JqZWN0CcDAm5ehbwAAA8CQwJmhZAkAAsCRAsDCmaFpsWlzQXJyYXlMaWtlT2JqZWN0kgIHwACnZGVmYXVsdMDAwJihcgsRwMCRAcDCnKFpACIBBJDAwgDCwMCXoW8BAAUIkMCZoWQAFwbAkgcGwMKZoWyzY2FzdEFycmF5TGlrZU9iamVjdJIGCsDAwMCQ2VRXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Nhc3RBcnJheUxpa2VPYmplY3QuanOYoXIJE8AHkQXAwpihchMRwMCRAcDCmKFnAQMJwJDAwpihZwkLCsCRCsDCmKFyABPAwJEFwMI=
====catalogjs annotation end====*/