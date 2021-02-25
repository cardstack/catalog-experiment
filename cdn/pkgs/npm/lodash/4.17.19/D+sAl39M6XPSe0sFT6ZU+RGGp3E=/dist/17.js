import { default as isArray } from "../isArray.js";
import { default as isKey } from "./26.js";
import { default as stringToPath } from "./58.js";
import { default as toString0 } from "../toString.js";
function castPath(value, object) {
  if (isArray(value)) {
    return value;
  }

  return isKey(value, object) ? [value] : stringToPath(toString0(value));
}
export { castPath as default };
/*====catalogjs annotation start====
k5SVwq0uLi9pc0FycmF5LmpzA8LAlcKnLi8yNi5qcwfCwJXCpy4vNTguanMLwsCVwq4uLi90b1N0cmluZy5qcw/CwIGnZGVmYXVsdJWhbKhjYXN0UGF0aBnAwNwAG5ehbwAAA8CQwJmhZAkAAgSRAsDCmaFpp2lzQXJyYXmSAhTAAKdkZWZhdWx0wMDAmKFyCwfAwJEBwMKcoWkAAQEHkQTAwgDCwMCYoWcID8DAkMDCmaFkCQAGCJEGwMKZoWmlaXNLZXmSBhXAAadkZWZhdWx0wMDAmKFyCwXAwJEFwMKcoWkBAQULkQjAwgHCwMCYoWcICcDAkMDCmaFkCQAKDJEKwMKZoWmsc3RyaW5nVG9QYXRokgoWwAKnZGVmYXVsdMDAwJihcgsMwMCRCcDCnKFpAQEJD5EMwMICwsDAmKFnCAnAwJDAwpmhZAkADhCRDsDCmaFpqXRvU3RyaW5nMJIOF8ADp2RlZmF1bHTAwMCYoXILCcDAkQ3AwpyhaQEBDRGREMDCA8LAwJihZwgQwMCQwMKXoW8BABIYkMCZoWQACxPAlRQVFhcTwMKZoWyoY2FzdFBhdGiSExrAwMDAkNlJV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19jYXN0UGF0aC5qc5ihcgkIwBSREsDCmKFyGAfAFZEBwMKYoXIrBcAWkQXAwpihchwMwBeRCcDCmKFyAQnAwJENwMKYoWcBAxnAkMDCmKFnCQsawJEawMKYoXIACMDAkRLAwg==
====catalogjs annotation end====*/