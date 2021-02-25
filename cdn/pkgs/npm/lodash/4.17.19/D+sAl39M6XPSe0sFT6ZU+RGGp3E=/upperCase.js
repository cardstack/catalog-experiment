import { default as createCompounder } from "./dist/19.js";
var upperCase = createCompounder(function (result, word, index) {
  return result + (index ? ' ' : '') + word.toUpperCase();
});
export { upperCase as default };
/*====catalogjs annotation start====
k5GVwqwuL2Rpc3QvMTkuanMDwsCBp2RlZmF1bHSVoWypdXBwZXJDYXNlDMDAnpehbwAAA8CRB8CZoWQJAAIEkQLAwpmhabBjcmVhdGVDb21wb3VuZGVykgIKwACnZGVmYXVsdMDAwJihcgsQwMCRAcDCnKFpAAEBBZEEwMIAwsDAmKFnCA7AwJDAwpehbwEABguQwJihZwABB8CQwMKZoWQEAAjAkwgGCcDCmaFsqXVwcGVyQ2FzZZIIDcDAwAaQ2UlXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvdXBwZXJDYXNlLmpzmKFyAAnACZEHwMKYoWcDXwrAkQrAwpihcgAQwMCRAcDCmKFnAQMMwJDAwpihZwkLDcCRDcDCmKFyAAnAwJEHwMI=
====catalogjs annotation end====*/