import { default as baseSum } from "./dist/168.js";
import { default as identity } from "./identity.js";
function sum(array) {
  return array && array.length ? baseSum(array, identity) : 0;
}
export { sum as default };
/*====catalogjs annotation start====
k5KVwq0uL2Rpc3QvMTY4LmpzA8LAlcKtLi9pZGVudGl0eS5qcwfCwIGnZGVmYXVsdJWhbKNzdW0PwMDcABGXoW8AAAPAkMCZoWQJAAIEkQLAwpmhaadiYXNlU3VtkgIMwACnZGVmYXVsdMDAwJihcgsHwMCRAcDCnKFpAAEBB5EEwMIAwsDAmKFnCA/AwJDAwpmhZAkABgiRBsDCmaFpqGlkZW50aXR5kgYNwAGnZGVmYXVsdMDAwJihcgsIwMCRBcDCnKFpAQEFCZEIwMIBwsDAmKFnCA/AwJDAwpehbwEACg6QwJmhZAAIC8CTDA0LwMKZoWyjc3VtkgsQwMDAwJDZQ1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9zdW0uanOYoXIJA8AMkQrAwpihcisHwA2RAcDCmKFyCAjAwJEFwMKYoWcBAw/AkMDCmKFnCQsQwJEQwMKYoXIAA8DAkQrAwg==
====catalogjs annotation end====*/