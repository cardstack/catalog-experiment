import { default as baseFlatten } from "./dist/85.js";
import { default as map } from "./map.js";
function flatMap(collection, iteratee) {
  return baseFlatten(map(collection, iteratee), 1);
}
export { flatMap as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvODUuanMDwsCVwqguL21hcC5qcwbCwIGnZGVmYXVsdJShbKdmbGF0TWFwDcCfl6FvAAADwJDAmaFkCQACwJECwMKYoWmrYmFzZUZsYXR0ZW6SAgrAAKdkZWZhdWx0wMCYoXILC8DAkQHAwpyhaQAXAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmjbWFwkgULwAGnZGVmYXVsdMDAmKFyCwPAwJEEwMKcoWkBEwQHkMDCAcLAwJehbwEACAyQwJmhZAAdCcCTCgsJwMKYoWynZmxhdE1hcJIJDsDAwMDZR1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9mbGF0TWFwLmpzmKFyCQfACpEIwMKYoXIiC8ALkQHAwpihcgEDwMCRBMDCmKFnAQMNwJDAwpihZwkLDsCRDsDCmKFyAAfAwJEIwMI=
====catalogjs annotation end====*/