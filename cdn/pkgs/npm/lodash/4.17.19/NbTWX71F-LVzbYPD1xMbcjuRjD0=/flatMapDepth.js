import { default as baseFlatten } from "./dist/85.js";
import { default as map } from "./map.js";
import { default as toInteger } from "./toInteger.js";
function flatMapDepth(collection, iteratee, depth) {
  depth = depth === undefined ? 1 : toInteger(depth);
  return baseFlatten(map(collection, iteratee), depth);
}
export { flatMapDepth as default };
/*====catalogjs annotation start====
k5OVwqwuL2Rpc3QvODUuanMDwsCVwqguL21hcC5qcwfCwJXCri4vdG9JbnRlZ2VyLmpzC8LAgadkZWZhdWx0laFsrGZsYXRNYXBEZXB0aBTAwNwAFpehbwAAA8CQwJmhZAkAAgSRAsDCmaFpq2Jhc2VGbGF0dGVukgIRwACnZGVmYXVsdMDAwJihcgsLwMCRAcDCnKFpAAEBB5EEwMIAwsDAmKFnCA7AwJDAwpmhZAkABgiRBsDCmaFpo21hcJIGEsABp2RlZmF1bHTAwMCYoXILA8DAkQXAwpyhaQEBBQuRCMDCAcLAwJihZwgKwMCQwMKZoWQJAAoMkQrAwpmhaal0b0ludGVnZXKSChDAAqdkZWZhdWx0wMDAmKFyCwnAwJEJwMKcoWkBAQkNkQzAwgLCwMCYoWcIEMDAkMDCl6FvAQAOE5DAmaFkACEPwJQQERIPwMKZoWysZmxhdE1hcERlcHRokg8VwMDAwJDZTFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9mbGF0TWFwRGVwdGguanOYoXIJDMAQkQ7AwpihckQJwBGRCcDCmKFyEgvAEpEBwMKYoXIBA8DAkQXAwpihZwEDFMCQwMKYoWcJCxXAkRXAwpihcgAMwMCRDsDC
====catalogjs annotation end====*/