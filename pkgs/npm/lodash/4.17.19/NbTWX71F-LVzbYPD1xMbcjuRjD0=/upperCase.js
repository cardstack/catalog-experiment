import { default as createCompounder } from "./dist/19.js";
var upperCase = createCompounder(function (result, word, index) {
  return result + (index ? ' ' : '') + word.toUpperCase();
});
export { upperCase as default };
/*====catalogjs annotation start====
k5GVwqwuL2Rpc3QvMTkuanMDwsCBp2RlZmF1bHSUoWypdXBwZXJDYXNlC8Cdl6FvAAADwJEGwJmhZAkAAsCRAsDCmKFpsGNyZWF0ZUNvbXBvdW5kZXKSAgnAAKdkZWZhdWx0wMCYoXILEMDAkQHAwpyhaQAXAQSQwMIAwsDAl6FvAQAFCpDAmKFnAAEGwJDAwpmhZAQAB8CTBwUIwMKYoWypdXBwZXJDYXNlkgcMwMDABdlJV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3VwcGVyQ2FzZS5qc5ihcgAJwAiRBsDCmKFnA18JwJEJwMKYoXIAEMDAkQHAwpihZwEDC8CQwMKYoWcJCwzAkQzAwpihcgAJwMCRBsDC
====catalogjs annotation end====*/