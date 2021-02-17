import { default as baseCreate } from "./106.js";
import { default as baseLodash } from "./114.js";
function LodashWrapper(value, chainAll) {
  this.__wrapped__ = value;
  this.__actions__ = [];
  this.__chain__ = !!chainAll;
  this.__index__ = 0;
  this.__values__ = undefined;
}
LodashWrapper.prototype = baseCreate(baseLodash.prototype);
LodashWrapper.prototype.constructor = LodashWrapper;
export { LodashWrapper as default };
/*====catalogjs annotation start====
k5KVwqguLzEwNi5qcwPCwJXCqC4vMTE0LmpzB8LAgadkZWZhdWx0laFsrUxvZGFzaFdyYXBwZXITwMDcABWXoW8AAAPAkQzAmaFkCQACBJECwMKZoWmqYmFzZUNyZWF0ZZICDsAAp2RlZmF1bHTAwMCYoXILCsDAkQHAwpyhaQABAQeRBMDCAMLAwJihZwgKwMCQwMKZoWQJAAYIkQbAwpmhaapiYXNlTG9kYXNokgYPwAGnZGVmYXVsdMDAwJihcgsKwMCRBcDCnKFpAQEFCZEIwMIBwsDAmKFnCArAwJDAwpehbwEAChKQwJmhZADMngsMkQvAwpmhbK1Mb2Rhc2hXcmFwcGVylQsNEBEUwMDAwJEM2U5XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX0xvZGFzaFdyYXBwZXIuanOYoXIJDcDAkQrAwpihZwEBDcCVDQ4PEBHAw5ihcgANwA6RCsDCmKFyDQrAD5EBwMKYoXIBCsAQkQXAwpihcg0NwBGRCsDCmKFyGQ3AwJEKwMKYoWcBAxPAkMDCmKFnCQsUwJEUwMKYoXIADcDAkQrAwg==
====catalogjs annotation end====*/