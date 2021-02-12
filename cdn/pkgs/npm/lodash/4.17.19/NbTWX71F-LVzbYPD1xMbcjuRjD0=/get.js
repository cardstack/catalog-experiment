import { default as baseGet } from "./dist/14.js";
function get(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet(object, path);
  return result === undefined ? defaultValue : result;
}
export { get as default };
/*====catalogjs annotation start====
k5GVwqwuL2Rpc3QvMTQuanMDwsCBp2RlZmF1bHSVoWyjZ2V0CcDAm5ehbwAAA8CQwJmhZAkAAsCRAsDCmaFpp2Jhc2VHZXSSAgfAAKdkZWZhdWx0wMDAmKFyCwfAwJEBwMKcoWkAFwEEkMDCAMLAwJehbwEABQiQwJmhZABIBsCSBwbAwpmhbKNnZXSSBgrAwMDAkNlDV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2dldC5qc5ihcgkDwAeRBcDCmKFySwfAwJEBwMKYoWcBAwnAkMDCmKFnCQsKwJEKwMKYoXIAA8DAkQXAwg==
====catalogjs annotation end====*/