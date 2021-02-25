import { default as isObject } from "../isObject.js";
function isStrictComparable(value) {
  return value === value && !isObject(value);
}
export { isStrictComparable as default };
/*====catalogjs annotation start====
k5GVwq4uLi9pc09iamVjdC5qcwPCwIGnZGVmYXVsdJWhbLJpc1N0cmljdENvbXBhcmFibGUKwMCcl6FvAAADwJDAmaFkCQACBJECwMKZoWmoaXNPYmplY3SSAgjAAKdkZWZhdWx0wMDAmKFyCwjAwJEBwMKcoWkAAQEFkQTAwgDCwMCYoWcIEMDAkMDCl6FvAQAGCZDAmaFkAAoHwJIIB8DCmaFssmlzU3RyaWN0Q29tcGFyYWJsZZIHC8DAwMCQ2VNXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2lzU3RyaWN0Q29tcGFyYWJsZS5qc5ihcgkSwAiRBsDCmKFyJwjAwJEBwMKYoWcBAwrAkMDCmKFnCQsLwJELwMKYoXIAEsDAkQbAwg==
====catalogjs annotation end====*/