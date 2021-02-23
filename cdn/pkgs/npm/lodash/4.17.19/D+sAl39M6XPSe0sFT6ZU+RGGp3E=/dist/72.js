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
k5KVwqguLzEwNy5qcwPCwJXCqi4uL2tleXMuanMHwsCBp2RlZmF1bHSVoWysZ2V0TWF0Y2hEYXRhD8DA3AARl6FvAAADwJDAmaFkCQACBJECwMKZoWmyaXNTdHJpY3RDb21wYXJhYmxlkgINwACnZGVmYXVsdMDAwJihcgsSwMCRAcDCnKFpAAEBB5EEwMIAwsDAmKFnCArAwJDAwpmhZAkABgiRBsDCmaFppGtleXOSBgzAAadkZWZhdWx0wMDAmKFyCwTAwJEFwMKcoWkBAQUJkQjAwgHCwMCYoWcIDMDAkMDCl6FvAQAKDpDAmaFkACELwJMMDQvAwpmhbKxnZXRNYXRjaERhdGGSCxDAwMDAkNlNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19nZXRNYXRjaERhdGEuanOYoXIJDMAMkQrAwpihchoEwA2RBcDCmKFyzJsSwMCRAcDCmKFnAQMPwJDAwpihZwkLEMCREMDCmKFyAAzAwJEKwMI=
====catalogjs annotation end====*/