import { default as baseIsEqual } from "./dist/43.js";
function isEqualWith(value, other, customizer) {
  customizer = typeof customizer == 'function' ? customizer : undefined;
  var result = customizer ? customizer(value, other) : undefined;
  return result === undefined ? baseIsEqual(value, other, undefined, customizer) : !!result;
}
export { isEqualWith as default };
/*====catalogjs annotation start====
k5GVwqwuL2Rpc3QvNDMuanMDwsCBp2RlZmF1bHSUoWyraXNFcXVhbFdpdGgJwJuXoW8AAAPAkQXAmaFkCQACwJECwMKYoWmrYmFzZUlzRXF1YWySAgfAAKdkZWZhdWx0wMCYoXILC8DAkQHAwpyhaQAXAQSQwMIAwsDAl6FvAQAFCJDAmaFkADMGwJIHBsDCmKFsq2lzRXF1YWxXaXRokgYKwMDAwNlLV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2lzRXF1YWxXaXRoLmpzmKFyCQvAB5EFwMKYoXLMyAvAwJEBwMKYoWcBAwnAkMDCmKFnCQsKwJEKwMKYoXIAC8DAkQXAwg==
====catalogjs annotation end====*/