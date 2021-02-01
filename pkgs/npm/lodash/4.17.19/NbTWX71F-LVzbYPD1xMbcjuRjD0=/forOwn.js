import { default as baseForOwn } from "./dist/77.js";
import { default as castFunction } from "./dist/108.js";
function forOwn(object, iteratee) {
  return object && baseForOwn(object, castFunction(iteratee));
}
export { forOwn as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvNzcuanMDwsCVwq0uL2Rpc3QvMTA4LmpzBsLAgadkZWZhdWx0lKFspmZvck93bg3An5ehbwAAA8CQwJmhZAkAAsCRAsDCmKFpqmJhc2VGb3JPd26SAgrAAKdkZWZhdWx0wMCYoXILCsDAkQHAwpyhaQAXAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmsY2FzdEZ1bmN0aW9ukgULwAGnZGVmYXVsdMDAmKFyCwzAwJEEwMKcoWkBGAQHkMDCAcLAwJehbwEACAyQwJmhZAAOCcCTCgsJwMKYoWymZm9yT3dukgkOwMDAwNlGV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2Zvck93bi5qc5ihcgkGwAqRCMDCmKFyKArAC5EBwMKYoXIJDMDAkQTAwpihZwEDDcCQwMKYoWcJCw7AkQ7AwpihcgAGwMCRCMDC
====catalogjs annotation end====*/