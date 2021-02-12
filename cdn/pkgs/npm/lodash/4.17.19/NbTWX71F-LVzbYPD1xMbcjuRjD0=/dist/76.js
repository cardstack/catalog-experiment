import { default as baseForOwn } from "./77.js";
function baseInverter(object, setter, iteratee, accumulator) {
  baseForOwn(object, function (value, key, object) {
    setter(accumulator, iteratee(value), key, object);
  });
  return accumulator;
}
function createInverter(setter, toIteratee) {
  return function (object, iteratee) {
    return baseInverter(object, setter, toIteratee(iteratee), {});
  };
}
export { createInverter as default };
/*====catalogjs annotation start====
k5GVwqcuLzc3LmpzA8LAgadkZWZhdWx0laFsrmNyZWF0ZUludmVydGVyDcDAn5ehbwAAA8CQwJmhZAkAAsCRAsDCmaFpqmJhc2VGb3JPd26SAgfAAKdkZWZhdWx0wMDAmKFyCwrAwJEBwMKcoWkAEgEEkMDCAMLAwJehbwEABQiQwJmhZAB9BsCSBwbAwpmhbKxiYXNlSW52ZXJ0ZXKSBgvAwMDAkNlNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlSW52ZXJ0ZXIuanOYoXIJDMAHkQXAwpihciwKwMCRAcDCl6FvAQAJDJDAmaFkADIKwJILCsDCmaFsrmNyZWF0ZUludmVydGVykgoOwMDAwJDZT1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fY3JlYXRlSW52ZXJ0ZXIuanOYoXIJDsALkQnAwpihckkMwMCRBcDCmKFnAQMNwJDAwpihZwkLDsCRDsDCmKFyAA7AwJEJwMI=
====catalogjs annotation end====*/