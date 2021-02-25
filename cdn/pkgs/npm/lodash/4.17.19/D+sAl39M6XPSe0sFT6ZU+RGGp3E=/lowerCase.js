import { default as createCompounder } from "./dist/19.js";
var lowerCase = createCompounder(function (result, word, index) {
  return result + (index ? ' ' : '') + word.toLowerCase();
});
export { lowerCase as default };
/*====catalogjs annotation start====
k5GVwqwuL2Rpc3QvMTkuanMDwsCBp2RlZmF1bHSVoWypbG93ZXJDYXNlDMDAnpehbwAAA8CRB8CZoWQJAAIEkQLAwpmhabBjcmVhdGVDb21wb3VuZGVykgIKwACnZGVmYXVsdMDAwJihcgsQwMCRAcDCnKFpAAEBBZEEwMIAwsDAmKFnCA7AwJDAwpehbwEABguQwJihZwABB8CQwMKZoWQEAAjAkwgGCcDCmaFsqWxvd2VyQ2FzZZIIDcDAwAaQ2UlXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvbG93ZXJDYXNlLmpzmKFyAAnACZEHwMKYoWcDXwrAkQrAwpihcgAQwMCRAcDCmKFnAQMMwJDAwpihZwkLDcCRDcDCmKFyAAnAwJEHwMI=
====catalogjs annotation end====*/