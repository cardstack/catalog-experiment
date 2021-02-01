import { default as baseFlatten } from "./dist/85.js";
import { default as toInteger } from "./toInteger.js";
function flattenDepth(array, depth) {
  var length = array == null ? 0 : array.length;

  if (!length) {
    return [];
  }

  depth = depth === undefined ? 1 : toInteger(depth);
  return baseFlatten(array, depth);
}
export { flattenDepth as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvODUuanMDwsCVwq4uL3RvSW50ZWdlci5qcwbCwIGnZGVmYXVsdJShbKxmbGF0dGVuRGVwdGgNwJ+XoW8AAAPAkMCZoWQJAALAkQLAwpihaatiYXNlRmxhdHRlbpICC8AAp2RlZmF1bHTAwJihcgsLwMCRAcDCnKFpABcBBpDAwgDCwMCZoWQJAAXAkQXAwpihaal0b0ludGVnZXKSBQrAAadkZWZhdWx0wMCYoXILCcDAkQTAwpyhaQEZBAeQwMIBwsDAl6FvAQAIDJDAmaFkABEJwJMKCwnAwpihbKxmbGF0dGVuRGVwdGiSCQ7AwMDA2UxXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvZmxhdHRlbkRlcHRoLmpzmKFyCQzACpEIwMKYoXLMjAnAC5EEwMKYoXISC8DAkQHAwpihZwEDDcCQwMKYoWcJCw7AkQ7AwpihcgAMwMCRCMDC
====catalogjs annotation end====*/