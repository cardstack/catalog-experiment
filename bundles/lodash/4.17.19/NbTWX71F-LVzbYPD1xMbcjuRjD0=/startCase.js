import { default as createCompounder } from "./dist/19.js";
import { default as upperFirst } from "./upperFirst.js";
var startCase = createCompounder(function (result, word, index) {
  return result + (index ? ' ' : '') + upperFirst(word);
});
export { startCase as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvMTkuanMDwsCVwq8uL3VwcGVyRmlyc3QuanMGwsCBp2RlZmF1bHSUoWypc3RhcnRDYXNlD8DcABGXoW8AAAPAkQnAmaFkCQACwJECwMKYoWmwY3JlYXRlQ29tcG91bmRlcpICDMAAp2RlZmF1bHTAwJihcgsQwMCRAcDCnKFpABcBBpDAwgDCwMCZoWQJAAXAkQXAwpihaap1cHBlckZpcnN0kgUNwAGnZGVmYXVsdMDAmKFyCwrAwJEEwMKcoWkBGgQHkMDCAcLAwJehbwEACA6QwJihZwABCcCQwMKZoWQEAArAkwoIC8DCmKFsqXN0YXJ0Q2FzZZIKEMDAwAjZSVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9zdGFydENhc2UuanOYoXIACcALkQnAwpihZwMKDMCTDA0JwMKYoXIAEMANkQHAwpihckkKwMCRBMDCmKFnAQMPwJDAwpihZwkLEMCREMDCmKFyAAnAwJEJwMI=
====catalogjs annotation end====*/