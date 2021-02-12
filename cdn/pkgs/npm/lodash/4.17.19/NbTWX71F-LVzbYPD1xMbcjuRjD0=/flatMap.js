import { default as baseFlatten } from "./dist/85.js";
import { default as map } from "./map.js";
function flatMap(collection, iteratee) {
  return baseFlatten(map(collection, iteratee), 1);
}
export { flatMap as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvODUuanMDwsCVwqguL21hcC5qcwbCwIGnZGVmYXVsdJWhbKdmbGF0TWFwDcDAn5ehbwAAA8CQwJmhZAkAAsCRAsDCmaFpq2Jhc2VGbGF0dGVukgIKwACnZGVmYXVsdMDAwJihcgsLwMCRAcDCnKFpABcBBpDAwgDCwMCZoWQJAAXAkQXAwpmhaaNtYXCSBQvAAadkZWZhdWx0wMDAmKFyCwPAwJEEwMKcoWkBEwQHkMDCAcLAwJehbwEACAyQwJmhZAAdCcCTCgsJwMKZoWynZmxhdE1hcJIJDsDAwMCQ2UdXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvZmxhdE1hcC5qc5ihcgkHwAqRCMDCmKFyIgvAC5EBwMKYoXIBA8DAkQTAwpihZwEDDcCQwMKYoWcJCw7AkQ7AwpihcgAHwMCRCMDC
====catalogjs annotation end====*/