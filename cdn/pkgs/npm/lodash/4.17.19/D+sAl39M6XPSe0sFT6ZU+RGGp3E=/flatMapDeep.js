import { default as baseFlatten } from "./dist/85.js";
import { default as map } from "./map.js";
var INFINITY = 1 / 0;
function flatMapDeep(collection, iteratee) {
  return baseFlatten(map(collection, iteratee), INFINITY);
}
export { flatMapDeep as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvODUuanMDwsCVwqguL21hcC5qcwfCwIGnZGVmYXVsdJWhbKtmbGF0TWFwRGVlcBPAwNwAFZehbwAAA8CQwJmhZAkAAgSRAsDCmaFpq2Jhc2VGbGF0dGVukgIPwACnZGVmYXVsdMDAwJihcgsLwMCRAcDCnKFpAAEBB5EEwMIAwsDAmKFnCA7AwJDAwpmhZAkABgiRBsDCmaFpo21hcJIGEMABp2RlZmF1bHTAwMCYoXILA8DAkQXAwpyhaQEBBQmRCMDCAcLAwJihZwgKwMCQwMKXoW8BAAoSkMCYoWcAAQsNkMDCmaFkBAgMwJIMCsDCmaFsqElORklOSVRZkgwRwMDACpDZS1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9mbGF0TWFwRGVlcC5qc5ihcgAIwMCRC8DCmaFkAQQOwJUPEBEOC8DCmaFsq2ZsYXRNYXBEZWVwkg4UwMDAwJDZS1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9mbGF0TWFwRGVlcC5qc5ihcgkLwA+RDcDCmKFyIgvAEJEBwMKYoXIBA8ARkQXAwpihchgIwMCRC8DCmKFnAQMTwJDAwpihZwkLFMCRFMDCmKFyAAvAwJENwMI=
====catalogjs annotation end====*/