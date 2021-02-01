import { default as lodash } from "./wrapperLodash.js";
function chain(value) {
  var result = lodash(value);
  result.__chain__ = true;
  return result;
}
export { chain as default };
/*====catalogjs annotation start====
k5GVwrIuL3dyYXBwZXJMb2Rhc2guanMDwsCBp2RlZmF1bHSUoWylY2hhaW4JwJuXoW8AAAPAkMCZoWQJAALAkQLAwpihaaZsb2Rhc2iSAgfAAKdkZWZhdWx0wMCYoXILBsDAkQHAwpyhaQAdAQSQwMIAwsDAl6FvAQAFCJDAmaFkADYGwJIHBsDCmKFspWNoYWlukgYKwMDAwNlFV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2NoYWluLmpzmKFyCQXAB5EFwMKYoXIZBsDAkQHAwpihZwEDCcCQwMKYoWcJCwrAkQrAwpihcgAFwMCRBcDC
====catalogjs annotation end====*/