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
k5KVwqguLzEwNi5qcwPCwJXCqC4vMTE0LmpzBsLAgadkZWZhdWx0laFsrUxvZGFzaFdyYXBwZXIRwMDcABOXoW8AAAPAkQrAmaFkCQACwJECwMKZoWmqYmFzZUNyZWF0ZZICDMAAp2RlZmF1bHTAwMCYoXILCsDAkQHAwpyhaQATAQaQwMIAwsDAmaFkCQAFwJEFwMKZoWmqYmFzZUxvZGFzaJIFDcABp2RlZmF1bHTAwMCYoXILCsDAkQTAwpyhaQETBAeQwMIBwsDAl6FvAQAIEJDAmaFkAMyeCQqRCcDCmaFsrUxvZGFzaFdyYXBwZXKVCQsODxLAwMDAkQrZTlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fTG9kYXNoV3JhcHBlci5qc5ihcgkNwMCRCMDCmKFnAQELwJULDA0OD8DDmKFyAA3ADJEIwMKYoXINCsANkQHAwpihcgEKwA6RBMDCmKFyDQ3AD5EIwMKYoXIZDcDAkQjAwpihZwEDEcCQwMKYoWcJCxLAkRLAwpihcgANwMCRCMDC
====catalogjs annotation end====*/