import { default as createCompounder } from "./dist/19.js";
var snakeCase = createCompounder(function (result, word, index) {
  return result + (index ? '_' : '') + word.toLowerCase();
});
export { snakeCase as default };
/*====catalogjs annotation start====
k5GVwqwuL2Rpc3QvMTkuanMDwsCBp2RlZmF1bHSUoWypc25ha2VDYXNlC8Cdl6FvAAADwJEGwJmhZAkAAsCRAsDCmKFpsGNyZWF0ZUNvbXBvdW5kZXKSAgnAAKdkZWZhdWx0wMCYoXILEMDAkQHAwpyhaQAXAQSQwMIAwsDAl6FvAQAFCpDAmKFnAAEGwJDAwpmhZAQAB8CTBwUIwMKYoWypc25ha2VDYXNlkgcMwMDABdlJV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3NuYWtlQ2FzZS5qc5ihcgAJwAiRBsDCmKFnA18JwJIJBsDCmKFyABDAwJEBwMKYoWcBAwvAkMDCmKFnCQsMwJEMwMKYoXIACcDAkQbAwg==
====catalogjs annotation end====*/