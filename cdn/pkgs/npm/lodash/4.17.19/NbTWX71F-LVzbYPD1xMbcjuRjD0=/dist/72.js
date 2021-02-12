import { default as isStrictComparable } from "./107.js";
import { default as keys } from "../keys.js";
function getMatchData(object) {
  var result = keys(object),
      length = result.length;

  while (length--) {
    var key = result[length],
        value = object[key];
    result[length] = [key, value, isStrictComparable(value)];
  }

  return result;
}
export { getMatchData as default };
/*====catalogjs annotation start====
k5KVwqguLzEwNy5qcwPCwJXCqi4uL2tleXMuanMGwsCBp2RlZmF1bHSVoWysZ2V0TWF0Y2hEYXRhDcDAn5ehbwAAA8CQwJmhZAkAAsCRAsDCmaFpsmlzU3RyaWN0Q29tcGFyYWJsZZICC8AAp2RlZmF1bHTAwMCYoXILEsDAkQHAwpyhaQATAQaQwMIAwsDAmaFkCQAFwJEFwMKZoWmka2V5c5IFCsABp2RlZmF1bHTAwMCYoXILBMDAkQTAwpyhaQEVBAeQwMIBwsDAl6FvAQAIDJDAmaFkACEJwJMKCwnAwpmhbKxnZXRNYXRjaERhdGGSCQ7AwMDAkNlNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19nZXRNYXRjaERhdGEuanOYoXIJDMAKkQjAwpihchoEwAuRBMDCmKFyzJsSwMCRAcDCmKFnAQMNwJDAwpihZwkLDsCRDsDCmKFyAAzAwJEIwMI=
====catalogjs annotation end====*/