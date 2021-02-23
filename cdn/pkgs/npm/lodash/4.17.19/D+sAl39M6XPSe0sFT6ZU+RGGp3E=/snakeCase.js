import { default as createCompounder } from "./dist/19.js";
var snakeCase = createCompounder(function (result, word, index) {
  return result + (index ? '_' : '') + word.toLowerCase();
});
export { snakeCase as default };
/*====catalogjs annotation start====
k5GVwqwuL2Rpc3QvMTkuanMDwsCBp2RlZmF1bHSVoWypc25ha2VDYXNlDMDAnpehbwAAA8CRB8CZoWQJAAIEkQLAwpmhabBjcmVhdGVDb21wb3VuZGVykgIKwACnZGVmYXVsdMDAwJihcgsQwMCRAcDCnKFpAAEBBZEEwMIAwsDAmKFnCA7AwJDAwpehbwEABguQwJihZwABB8CQwMKZoWQEAAjAkwgGCcDCmaFsqXNuYWtlQ2FzZZIIDcDAwAaQ2UlXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvc25ha2VDYXNlLmpzmKFyAAnACZEHwMKYoWcDXwrAkQrAwpihcgAQwMCRAcDCmKFnAQMMwJDAwpihZwkLDcCRDcDCmKFyAAnAwJEHwMI=
====catalogjs annotation end====*/