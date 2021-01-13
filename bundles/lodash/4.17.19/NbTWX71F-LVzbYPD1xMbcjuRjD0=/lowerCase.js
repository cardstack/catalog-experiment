import { default as createCompounder } from "./dist/19.js";
var lowerCase = createCompounder(function (result, word, index) {
  return result + (index ? ' ' : '') + word.toLowerCase();
});
export { lowerCase as default };
/*====catalogjs annotation start====
k5GVwqwuL2Rpc3QvMTkuanMDwsCBp2RlZmF1bHSUoWypbG93ZXJDYXNlC8Cdl6FvAAADwJEGwJmhZAkAAsCRAsDCmKFpsGNyZWF0ZUNvbXBvdW5kZXKSAgnAAKdkZWZhdWx0wMCYoXILEMDAkQHAwpyhaQAXAQSQwMIAwsDAl6FvAQAFCpDAmKFnAAEGwJDAwpmhZAQAB8CTBwUIwMKYoWypbG93ZXJDYXNlkgcMwMDABdlJV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2xvd2VyQ2FzZS5qc5ihcgAJwAiRBsDCmKFnA18JwJIJBsDCmKFyABDAwJEBwMKYoWcBAwvAkMDCmKFnCQsMwJEMwMKYoXIACcDAkQbAwg==
====catalogjs annotation end====*/