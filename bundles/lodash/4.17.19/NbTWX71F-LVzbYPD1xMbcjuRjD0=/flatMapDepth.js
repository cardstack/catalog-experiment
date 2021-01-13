import { default as baseFlatten } from "./dist/85.js";
import { default as map } from "./map.js";
import { default as toInteger } from "./toInteger.js";
function flatMapDepth(collection, iteratee, depth) {
  depth = depth === undefined ? 1 : toInteger(depth);
  return baseFlatten(map(collection, iteratee), depth);
}
export { flatMapDepth as default };
/*====catalogjs annotation start====
k5OVwqwuL2Rpc3QvODUuanMDwsCVwqguL21hcC5qcwbCwJXCri4vdG9JbnRlZ2VyLmpzCcLAgadkZWZhdWx0lKFsrGZsYXRNYXBEZXB0aBHA3AATl6FvAAADwJELwJmhZAkAAsCRAsDCmKFpq2Jhc2VGbGF0dGVukgIOwACnZGVmYXVsdMDAmKFyCwvAwJEBwMKcoWkAFwEGkMDCAMLAwJmhZAkABcCRBcDCmKFpo21hcJIFD8ABp2RlZmF1bHTAwJihcgsDwMCRBMDCnKFpARMECZDAwgHCwMCZoWQJAAjAkQjAwpihaal0b0ludGVnZXKSCA3AAqdkZWZhdWx0wMCYoXILCcDAkQfAwpyhaQEZBwqQwMICwsDAl6FvAQALEJDAmaFkACEMwJQNDg8MwMKYoWysZmxhdE1hcERlcHRokgwSwMDAwNlMV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2ZsYXRNYXBEZXB0aC5qc5ihcgkMwA2RC8DCmKFyRAnADpEHwMKYoXISC8APkQHAwpihcgEDwMCRBMDCmKFnAQMRwJDAwpihZwkLEsCREsDCmKFyAAzAwJELwMI=
====catalogjs annotation end====*/