import { default as createCompounder } from "./dist/19.js";
var kebabCase = createCompounder(function (result, word, index) {
  return result + (index ? '-' : '') + word.toLowerCase();
});
export { kebabCase as default };
/*====catalogjs annotation start====
k5GVwqwuL2Rpc3QvMTkuanMDwsCBp2RlZmF1bHSVoWypa2ViYWJDYXNlDMDAnpehbwAAA8CRB8CZoWQJAAIEkQLAwpmhabBjcmVhdGVDb21wb3VuZGVykgIKwACnZGVmYXVsdMDAwJihcgsQwMCRAcDCnKFpAAEBBZEEwMIAwsDAmKFnCA7AwJDAwpehbwEABguQwJihZwABB8CQwMKZoWQEAAjAkwgGCcDCmaFsqWtlYmFiQ2FzZZIIDcDAwAaQ2UlXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMva2ViYWJDYXNlLmpzmKFyAAnACZEHwMKYoWcDXwrAkQrAwpihcgAQwMCRAcDCmKFnAQMMwJDAwpihZwkLDcCRDcDCmKFyAAnAwJEHwMI=
====catalogjs annotation end====*/