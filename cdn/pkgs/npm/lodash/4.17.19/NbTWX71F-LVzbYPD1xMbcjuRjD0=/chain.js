import { default as lodash } from "./wrapperLodash.js";
function chain(value) {
  var result = lodash(value);
  result.__chain__ = true;
  return result;
}
export { chain as default };
/*====catalogjs annotation start====
k5GVwrIuL3dyYXBwZXJMb2Rhc2guanMDwsCBp2RlZmF1bHSVoWylY2hhaW4JwMCbl6FvAAADwJDAmaFkCQACwJECwMKZoWmmbG9kYXNokgIHwACnZGVmYXVsdMDAwJihcgsGwMCRAcDCnKFpAB0BBJDAwgDCwMCXoW8BAAUIkMCZoWQANgbAkgcGwMKZoWylY2hhaW6SBgrAwMDAkNlFV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2NoYWluLmpzmKFyCQXAB5EFwMKYoXIZBsDAkQHAwpihZwEDCcCQwMKYoWcJCwrAkQrAwpihcgAFwMCRBcDC
====catalogjs annotation end====*/