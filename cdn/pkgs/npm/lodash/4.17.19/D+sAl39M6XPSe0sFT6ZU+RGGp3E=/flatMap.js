import { default as baseFlatten } from "./dist/85.js";
import { default as map } from "./map.js";
function flatMap(collection, iteratee) {
  return baseFlatten(map(collection, iteratee), 1);
}
export { flatMap as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvODUuanMDwsCVwqguL21hcC5qcwfCwIGnZGVmYXVsdJWhbKdmbGF0TWFwD8DA3AARl6FvAAADwJDAmaFkCQACBJECwMKZoWmrYmFzZUZsYXR0ZW6SAgzAAKdkZWZhdWx0wMDAmKFyCwvAwJEBwMKcoWkAAQEHkQTAwgDCwMCYoWcIDsDAkMDCmaFkCQAGCJEGwMKZoWmjbWFwkgYNwAGnZGVmYXVsdMDAwJihcgsDwMCRBcDCnKFpAQEFCZEIwMIBwsDAmKFnCArAwJDAwpehbwEACg6QwJmhZAAdC8CTDA0LwMKZoWynZmxhdE1hcJILEMDAwMCQ2UdXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvZmxhdE1hcC5qc5ihcgkHwAyRCsDCmKFyIgvADZEBwMKYoXIBA8DAkQXAwpihZwEDD8CQwMKYoWcJCxDAkRDAwpihcgAHwMCRCsDC
====catalogjs annotation end====*/