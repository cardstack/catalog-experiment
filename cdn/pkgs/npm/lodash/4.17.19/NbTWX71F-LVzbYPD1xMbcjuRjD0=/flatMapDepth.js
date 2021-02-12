import { default as baseFlatten } from "./dist/85.js";
import { default as map } from "./map.js";
import { default as toInteger } from "./toInteger.js";
function flatMapDepth(collection, iteratee, depth) {
  depth = depth === undefined ? 1 : toInteger(depth);
  return baseFlatten(map(collection, iteratee), depth);
}
export { flatMapDepth as default };
/*====catalogjs annotation start====
k5OVwqwuL2Rpc3QvODUuanMDwsCVwqguL21hcC5qcwbCwJXCri4vdG9JbnRlZ2VyLmpzCcLAgadkZWZhdWx0laFsrGZsYXRNYXBEZXB0aBHAwNwAE5ehbwAAA8CQwJmhZAkAAsCRAsDCmaFpq2Jhc2VGbGF0dGVukgIOwACnZGVmYXVsdMDAwJihcgsLwMCRAcDCnKFpABcBBpDAwgDCwMCZoWQJAAXAkQXAwpmhaaNtYXCSBQ/AAadkZWZhdWx0wMDAmKFyCwPAwJEEwMKcoWkBEwQJkMDCAcLAwJmhZAkACMCRCMDCmaFpqXRvSW50ZWdlcpIIDcACp2RlZmF1bHTAwMCYoXILCcDAkQfAwpyhaQEZBwqQwMICwsDAl6FvAQALEJDAmaFkACEMwJQNDg8MwMKZoWysZmxhdE1hcERlcHRokgwSwMDAwJDZTFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9mbGF0TWFwRGVwdGguanOYoXIJDMANkQvAwpihckQJwA6RB8DCmKFyEgvAD5EBwMKYoXIBA8DAkQTAwpihZwEDEcCQwMKYoWcJCxLAkRLAwpihcgAMwMCRC8DC
====catalogjs annotation end====*/