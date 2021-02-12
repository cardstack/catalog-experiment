import { default as isObject } from "../isObject.js";
function isStrictComparable(value) {
  return value === value && !isObject(value);
}
export { isStrictComparable as default };
/*====catalogjs annotation start====
k5GVwq4uLi9pc09iamVjdC5qcwPCwIGnZGVmYXVsdJWhbLJpc1N0cmljdENvbXBhcmFibGUJwMCbl6FvAAADwJDAmaFkCQACwJECwMKZoWmoaXNPYmplY3SSAgfAAKdkZWZhdWx0wMDAmKFyCwjAwJEBwMKcoWkAGQEEkMDCAMLAwJehbwEABQiQwJmhZAAKBsCSBwbAwpmhbLJpc1N0cmljdENvbXBhcmFibGWSBgrAwMDAkNlTV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19pc1N0cmljdENvbXBhcmFibGUuanOYoXIJEsAHkQXAwpihcicIwMCRAcDCmKFnAQMJwJDAwpihZwkLCsCRCsDCmKFyABLAwJEFwMI=
====catalogjs annotation end====*/