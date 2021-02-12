import { default as apply } from "./dist/111.js";
import { default as baseRest } from "./dist/49.js";
import { default as isError } from "./isError.js";
var attempt = baseRest(function (func, args) {
  try {
    return apply(func, undefined, args);
  } catch (e) {
    return isError(e) ? e : new Error(e);
  }
});
export { attempt as default };
/*====catalogjs annotation start====
k5OVwq0uL2Rpc3QvMTExLmpzA8LAlcKsLi9kaXN0LzQ5LmpzBsLAlcKsLi9pc0Vycm9yLmpzCcLAgadkZWZhdWx0laFsp2F0dGVtcHQTwMDcABWXoW8AAAPAkQzAmaFkCQACwJECwMKZoWmlYXBwbHmSAhDAAKdkZWZhdWx0wMDAmKFyCwXAwJEBwMKcoWkAGAEGkMDCAMLAwJmhZAkABcCRBcDCmaFpqGJhc2VSZXN0kgUPwAGnZGVmYXVsdMDAwJihcgsIwMCRBMDCnKFpARcECZDAwgHCwMCZoWQJAAjAkQjAwpmhaadpc0Vycm9ykggRwAKnZGVmYXVsdMDAwJihcgsHwMCRB8DCnKFpARcHCpDAwgLCwMCXoW8BAAsSkMCYoWcAAQzAkMDCmaFkBAANwJMNCw7AwpmhbKdhdHRlbXB0kg0UwMDAC5DZR1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9hdHRlbXB0LmpzmKFyAAfADpEMwMKYoWcDHg/Akw8QEcDCmKFyAAjAEJEEwMKYoXIsBcARkQHAwpihcjQHwMCRB8DCmKFnAQMTwJDAwpihZwkLFMCRFMDCmKFyAAfAwJEMwMI=
====catalogjs annotation end====*/