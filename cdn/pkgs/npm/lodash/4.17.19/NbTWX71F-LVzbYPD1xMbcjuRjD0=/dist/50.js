import { default as flatten } from "../flatten.js";
import { default as overRest } from "./110.js";
import { default as setToString } from "./51.js";
function flatRest(func) {
  return setToString(overRest(func, undefined, flatten), func + '');
}
export { flatRest as default };
/*====catalogjs annotation start====
k5OVwq0uLi9mbGF0dGVuLmpzA8LAlcKoLi8xMTAuanMGwsCVwqcuLzUxLmpzCcLAgadkZWZhdWx0laFsqGZsYXRSZXN0EcDA3AATl6FvAAADwJDAmaFkCQACwJECwMKZoWmnZmxhdHRlbpICD8AAp2RlZmF1bHTAwMCYoXILB8DAkQHAwpyhaQAYAQaQwMIAwsDAmaFkCQAFwJEFwMKZoWmob3ZlclJlc3SSBQ7AAadkZWZhdWx0wMDAmKFyCwjAwJEEwMKcoWkBEwQJkMDCAcLAwJmhZAkACMCRCMDCmaFpq3NldFRvU3RyaW5nkggNwAKnZGVmYXVsdMDAwJihcgsLwMCRB8DCnKFpARIHCpDAwgLCwMCXoW8BAAsQkMCZoWQAEAzAlA0ODwzAwpmhbKhmbGF0UmVzdJIMEsDAwMCQ2UlXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2ZsYXRSZXN0LmpzmKFyCQjADZELwMKYoXISC8AOkQfAwpihcgEIwA+RBMDCmKFyEgfAwJEBwMKYoWcBAxHAkMDCmKFnCQsSwJESwMKYoXIACMDAkQvAwg==
====catalogjs annotation end====*/