import { default as baseForRight } from "./dist/159.js";
import { default as castFunction } from "./dist/108.js";
import { default as keysIn } from "./keysIn.js";
function forInRight(object, iteratee) {
  return object == null ? object : baseForRight(object, castFunction(iteratee), keysIn);
}
export { forInRight as default };
/*====catalogjs annotation start====
k5OVwq0uL2Rpc3QvMTU5LmpzA8LAlcKtLi9kaXN0LzEwOC5qcwbCwJXCqy4va2V5c0luLmpzCcLAgadkZWZhdWx0lKFsqmZvckluUmlnaHQRwNwAE5ehbwAAA8CRC8CZoWQJAALAkQLAwpihaaxiYXNlRm9yUmlnaHSSAg3AAKdkZWZhdWx0wMCYoXILDMDAkQHAwpyhaQAYAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmsY2FzdEZ1bmN0aW9ukgUOwAGnZGVmYXVsdMDAmKFyCwzAwJEEwMKcoWkBGAQJkMDCAcLAwJmhZAkACMCRCMDCmKFppmtleXNJbpIID8ACp2RlZmF1bHTAwJihcgsGwMCRB8DCnKFpARYHCpDAwgLCwMCXoW8BAAsQkMCZoWQABAzAlA0ODwzAwpihbKpmb3JJblJpZ2h0kgwSwMDAwNlKV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2ZvckluUmlnaHQuanOYoXIJCsANkQvAwpihcjgMwA6RAcDCmKFyCQzAD5EEwMKYoXIMBsDAkQfAwpihZwEDEcCQwMKYoWcJCxLAkRLAwpihcgAKwMCRC8DC
====catalogjs annotation end====*/