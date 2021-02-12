import { default as castPath } from "./17.js";
import { default as last } from "../last.js";
import { default as parent0 } from "./11.js";
import { default as toKey } from "./27.js";
function baseUnset(object, path) {
  path = castPath(path, object);
  object = parent0(object, path);
  return object == null || delete object[toKey(last(path))];
}
export { baseUnset as default };
/*====catalogjs annotation start====
k5SVwqcuLzE3LmpzA8LAlcKqLi4vbGFzdC5qcwbCwJXCpy4vMTEuanMJwsCVwqcuLzI3LmpzDMLAgadkZWZhdWx0laFsqWJhc2VVbnNldBXAwNwAF5ehbwAAA8CQwJmhZAkAAsCRAsDCmaFpqGNhc3RQYXRokgIQwACnZGVmYXVsdMDAwJihcgsIwMCRAcDCnKFpABIBBpDAwgDCwMCZoWQJAAXAkQXAwpmhaaRsYXN0kgUTwAGnZGVmYXVsdMDAwJihcgsEwMCRBMDCnKFpARUECZDAwgHCwMCZoWQJAAjAkQjAwpmhaadwYXJlbnQwkggRwAKnZGVmYXVsdMDAwJihcgsHwMCRB8DCnKFpARIHDJDAwgLCwMCZoWQJAAvAkQvAwpmhaaV0b0tleZILEsADp2RlZmF1bHTAwMCYoXILBcDAkQrAwpyhaQESCg2QwMIDwsDAl6FvAQAOFJDAmaFkAAsPwJUQERITD8DCmaFsqWJhc2VVbnNldJIPFsDAwMCQ2UpXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VVbnNldC5qc5ihcgkJwBCRDsDCmKFyGgjAEZEBwMKYoXIbB8ASkQfAwpihcjkFwBORCsDCmKFyAQTAwJEEwMKYoWcBAxXAkMDCmKFnCQsWwJEWwMKYoXIACcDAkQ7Awg==
====catalogjs annotation end====*/