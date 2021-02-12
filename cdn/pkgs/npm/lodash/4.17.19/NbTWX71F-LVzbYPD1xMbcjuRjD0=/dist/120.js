import { default as baseIndexOf } from "./123.js";
function arrayIncludes(array, value) {
  var length = array == null ? 0 : array.length;
  return !!length && baseIndexOf(array, value, 0) > -1;
}
export { arrayIncludes as default };
/*====catalogjs annotation start====
k5GVwqguLzEyMy5qcwPCwIGnZGVmYXVsdJWhbK1hcnJheUluY2x1ZGVzCcDAm5ehbwAAA8CQwJmhZAkAAsCRAsDCmaFpq2Jhc2VJbmRleE9mkgIHwACnZGVmYXVsdMDAwJihcgsLwMCRAcDCnKFpABMBBJDAwgDCwMCXoW8BAAUIkMCZoWQAGQbAkgcGwMKZoWytYXJyYXlJbmNsdWRlc5IGCsDAwMCQ2U5XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2FycmF5SW5jbHVkZXMuanOYoXIJDcAHkQXAwpihclcLwMCRAcDCmKFnAQMJwJDAwpihZwkLCsCRCsDCmKFyAA3AwJEFwMI=
====catalogjs annotation end====*/