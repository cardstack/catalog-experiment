import { default as copyObject } from "./dist/54.js";
import { default as createAssigner } from "./dist/48.js";
import { default as keysIn } from "./keysIn.js";
var assignIn = createAssigner(function (object, source) {
  copyObject(source, keysIn(source), object);
});
export { assignIn as default };
/*====catalogjs annotation start====
k5OVwqwuL2Rpc3QvNTQuanMDwsCVwqwuL2Rpc3QvNDguanMGwsCVwqsuL2tleXNJbi5qcwnCwIGnZGVmYXVsdJShbKhhc3NpZ25JbhPA3AAVl6FvAAADwJEMwJmhZAkAAsCRAsDCmKFpqmNvcHlPYmplY3SSAhDAAKdkZWZhdWx0wMCYoXILCsDAkQHAwpyhaQAXAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmuY3JlYXRlQXNzaWduZXKSBQ/AAadkZWZhdWx0wMCYoXILDsDAkQTAwpyhaQEXBAmQwMIBwsDAmaFkCQAIwJEIwMKYoWmma2V5c0lukggRwAKnZGVmYXVsdMDAmKFyCwbAwJEHwMKcoWkBFgcKkMDCAsLAwJehbwEACxKQwJihZwABDMCQwMKZoWQEAA3Akw0LDsDCmKFsqGFzc2lnbklukg0UwMDAC9lIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2Fzc2lnbkluLmpzmKFyAAjADpEMwMKYoWcDFQ/Akw8QEcDCmKFyAA7AEJEEwMKYoXIfCsARkQHAwpihcgkGwMCRB8DCmKFnAQMTwJDAwpihZwkLFMCRFMDCmKFyAAjAwJEMwMI=
====catalogjs annotation end====*/