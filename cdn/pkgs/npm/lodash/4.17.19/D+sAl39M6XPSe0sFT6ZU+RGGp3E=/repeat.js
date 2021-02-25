import { default as baseRepeat } from "./dist/169.js";
import { default as isIterateeCall } from "./dist/70.js";
import { default as toInteger } from "./toInteger.js";
import { default as toString0 } from "./toString.js";
function repeat(string, n, guard) {
  if (guard ? isIterateeCall(string, n, guard) : n === undefined) {
    n = 1;
  } else {
    n = toInteger(n);
  }

  return baseRepeat(toString0(string), n);
}
export { repeat as default };
/*====catalogjs annotation start====
k5SVwq0uL2Rpc3QvMTY5LmpzA8LAlcKsLi9kaXN0LzcwLmpzB8LAlcKuLi90b0ludGVnZXIuanMLwsCVwq0uL3RvU3RyaW5nLmpzD8LAgadkZWZhdWx0laFspnJlcGVhdBnAwNwAG5ehbwAAA8CQwJmhZAkAAgSRAsDCmaFpqmJhc2VSZXBlYXSSAhbAAKdkZWZhdWx0wMDAmKFyCwrAwJEBwMKcoWkAAQEHkQTAwgDCwMCYoWcID8DAkMDCmaFkCQAGCJEGwMKZoWmuaXNJdGVyYXRlZUNhbGySBhTAAadkZWZhdWx0wMDAmKFyCw7AwJEFwMKcoWkBAQULkQjAwgHCwMCYoWcIDsDAkMDCmaFkCQAKDJEKwMKZoWmpdG9JbnRlZ2VykgoVwAKnZGVmYXVsdMDAwJihcgsJwMCRCcDCnKFpAQEJD5EMwMICwsDAmKFnCBDAwJDAwpmhZAkADhCRDsDCmaFpqXRvU3RyaW5nMJIOF8ADp2RlZmF1bHTAwMCYoXILCcDAkQ3AwpyhaQEBDRGREMDCA8LAwJihZwgPwMCQwMKXoW8BABIYkMCZoWQADxPAlRQVFhcTwMKZoWymcmVwZWF0khMawMDAwJDZRlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9yZXBlYXQuanOYoXIJBsAUkRLAwpihciMOwBWRBcDCmKFyRgnAFpEJwMKYoXITCsAXkQHAwpihcgEJwMCRDcDCmKFnAQMZwJDAwpihZwkLGsCRGsDCmKFyAAbAwJESwMI=
====catalogjs annotation end====*/