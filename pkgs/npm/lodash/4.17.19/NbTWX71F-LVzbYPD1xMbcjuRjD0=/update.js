import { default as baseUpdate } from "./dist/13.js";
import { default as castFunction } from "./dist/108.js";
function update(object, path, updater) {
  return object == null ? object : baseUpdate(object, path, castFunction(updater));
}
export { update as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvMTMuanMDwsCVwq0uL2Rpc3QvMTA4LmpzBsLAgadkZWZhdWx0lKFspnVwZGF0ZQ3An5ehbwAAA8CQwJmhZAkAAsCRAsDCmKFpqmJhc2VVcGRhdGWSAgrAAKdkZWZhdWx0wMCYoXILCsDAkQHAwpyhaQAXAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmsY2FzdEZ1bmN0aW9ukgULwAGnZGVmYXVsdMDAmKFyCwzAwJEEwMKcoWkBGAQHkMDCAcLAwJehbwEACAyQwJmhZAANCcCTCgsJwMKYoWymdXBkYXRlkgkOwMDAwNlGV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3VwZGF0ZS5qc5ihcgkGwAqRCMDCmKFyPQrAC5EBwMKYoXIPDMDAkQTAwpihZwEDDcCQwMKYoWcJCw7AkQ7AwpihcgAGwMCRCMDC
====catalogjs annotation end====*/