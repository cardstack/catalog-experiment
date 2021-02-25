import { default as isSymbol } from "../isSymbol.js";
import { default as baseToString } from "./22.js";
var NAN = 0 / 0;
function baseToNumber(value) {
  if (typeof value == 'number') {
    return value;
  }

  if (isSymbol(value)) {
    return NAN;
  }

  return +value;
}
function createMathOperation(operator, defaultValue) {
  return function (value, other) {
    var result;

    if (value === undefined && other === undefined) {
      return defaultValue;
    }

    if (value !== undefined) {
      result = value;
    }

    if (other !== undefined) {
      if (result === undefined) {
        return other;
      }

      if (typeof value == 'string' || typeof other == 'string') {
        value = baseToString(value);
        other = baseToString(other);
      } else {
        value = baseToNumber(value);
        other = baseToNumber(other);
      }

      result = operator(value, other);
    }

    return result;
  };
}
export { createMathOperation as default };
/*====catalogjs annotation start====
k5KVwq4uLi9pc1N5bWJvbC5qcwPCwJXCpy4vMjIuanMHwsCBp2RlZmF1bHSVoWyzY3JlYXRlTWF0aE9wZXJhdGlvbhnAwNwAG5ehbwAAA8CQwJmhZAkAAgSRAsDCmaFpqGlzU3ltYm9skgIPwACnZGVmYXVsdMDAwJihcgsIwMCRAcDCnKFpAAEBB5EEwMIAwsDAmKFnCBDAwJDAwpmhZAkABgiRBsDCmaFprGJhc2VUb1N0cmluZ5MGFBXAAadkZWZhdWx0wMDAmKFyCwzAwJEFwMKcoWkBAQUJkQjAwgHCwMCYoWcICcDAkMDCl6FvAQAKEZDAmKFnAAELDZDAwpmhZAQIDMCSDArAwpmhbKNOQU6SDBDAwMAKkNlNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlVG9OdW1iZXIuanOYoXIAA8DAkQvAwpmhZAEZDsCUDxAOC8DCmaFsrGJhc2VUb051bWJlcpMOFhfAwMDAkNlNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlVG9OdW1iZXIuanOYoXIJDMAPkQ3AwpihckkIwBCRAcDCmKFyFgPAwJELwMKXoW8BABIYkMCZoWQAWRPAlRQVFhcTwMKZoWyzY3JlYXRlTWF0aE9wZXJhdGlvbpITGsDAwMCQ2VRXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2NyZWF0ZU1hdGhPcGVyYXRpb24uanOYoXIJE8AUkRLAwpihcs0BlQzAFZEFwMKYoXIZDMAWkQXAwpihcigMwBeRDcDCmKFyGQzAwJENwMKYoWcBAxnAkMDCmKFnCQsawJEawMKYoXIAE8DAkRLAwg==
====catalogjs annotation end====*/