import { default as isNumber } from "./isNumber.js";
function isNaN(value) {
  return isNumber(value) && value != +value;
}
export { isNaN as default };
/*====catalogjs annotation start====
k5GVwq0uL2lzTnVtYmVyLmpzA8LAgadkZWZhdWx0lKFspWlzTmFOCcCbl6FvAAADwJDAmaFkCQACwJECwMKYoWmoaXNOdW1iZXKSAgfAAKdkZWZhdWx0wMCYoXILCMDAkQHAwpyhaQAYAQSQwMIAwsDAl6FvAQAFCJDAmaFkAB0GwJIHBsDCmKFspWlzTmFOkgYKwMDAwNlFV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2lzTmFOLmpzmKFyCQXAB5EFwMKYoXITCMDAkQHAwpihZwEDCcCQwMKYoWcJCwrAkQrAwpihcgAFwMCRBcDC
====catalogjs annotation end====*/