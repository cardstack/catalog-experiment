import { default as capitalize } from "./capitalize.js";
import { default as createCompounder } from "./dist/19.js";
var camelCase = createCompounder(function (result, word, index) {
  word = word.toLowerCase();
  return result + (index ? capitalize(word) : word);
});
export { camelCase as default };
/*====catalogjs annotation start====
k5KVwq8uL2NhcGl0YWxpemUuanMDwsCVwqwuL2Rpc3QvMTkuanMGwsCBp2RlZmF1bHSUoWypY2FtZWxDYXNlD8DcABGXoW8AAAPAkQnAmaFkCQACwJECwMKYoWmqY2FwaXRhbGl6ZZICDcAAp2RlZmF1bHTAwJihcgsKwMCRAcDCnKFpABoBBpDAwgDCwMCZoWQJAAXAkQXAwpihabBjcmVhdGVDb21wb3VuZGVykgUMwAGnZGVmYXVsdMDAmKFyCxDAwJEEwMKcoWkBFwQHkMDCAcLAwJehbwEACA6QwJihZwABCcCQwMKZoWQEAArAkwoIC8DCmKFsqWNhbWVsQ2FzZZIKEMDAwAjZSVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9jYW1lbENhc2UuanOYoXIACcALkQnAwpihZwMSDMCSDA3AwpihcgAQwA2RBMDCmKFyWgrAwJEBwMKYoWcBAw/AkMDCmKFnCQsQwJEQwMKYoXIACcDAkQnAwg==
====catalogjs annotation end====*/