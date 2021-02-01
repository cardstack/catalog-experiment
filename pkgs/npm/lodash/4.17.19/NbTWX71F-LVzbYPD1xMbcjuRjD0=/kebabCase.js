import { default as createCompounder } from "./dist/19.js";
var kebabCase = createCompounder(function (result, word, index) {
  return result + (index ? '-' : '') + word.toLowerCase();
});
export { kebabCase as default };
/*====catalogjs annotation start====
k5GVwqwuL2Rpc3QvMTkuanMDwsCBp2RlZmF1bHSUoWypa2ViYWJDYXNlC8Cdl6FvAAADwJEGwJmhZAkAAsCRAsDCmKFpsGNyZWF0ZUNvbXBvdW5kZXKSAgnAAKdkZWZhdWx0wMCYoXILEMDAkQHAwpyhaQAXAQSQwMIAwsDAl6FvAQAFCpDAmKFnAAEGwJDAwpmhZAQAB8CTBwUIwMKYoWypa2ViYWJDYXNlkgcMwMDABdlJV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2tlYmFiQ2FzZS5qc5ihcgAJwAiRBsDCmKFnA18JwJEJwMKYoXIAEMDAkQHAwpihZwEDC8CQwMKYoWcJCwzAkQzAwpihcgAJwMCRBsDC
====catalogjs annotation end====*/