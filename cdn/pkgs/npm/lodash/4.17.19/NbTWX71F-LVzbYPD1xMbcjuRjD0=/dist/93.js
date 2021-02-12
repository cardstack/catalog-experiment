import { default as freeGlobal } from "./95.js";
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;
var root = freeGlobal || freeSelf || Function('return this')();
export { root as default };
/*====catalogjs annotation start====
k5GVwqcuLzk1LmpzA8LAgadkZWZhdWx0laFspHJvb3QPwMDcABGXoW8AAAPAkQnAmaFkCQACwJECwMKZoWmqZnJlZUdsb2JhbJICDMAAp2RlZmF1bHTAwMCYoXILCsDAkQHAwpyhaQASAQSQwMIAwsDAl6FvAQAFDpDAmKFnAAEGCJDAwpmhZAREB8CSBwXAwpmhbKhmcmVlU2VsZpIHDcDAwAWQ2UVXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX3Jvb3QuanOYoXIACMDAkQbAwpihZwEBCcCQwMKZoWQEAArAlAoICwbAwpmhbKRyb290kgoQwMDACJDZRVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fcm9vdC5qc5ihcgAEwAuRCcDCmKFnAx0MwJIMDcDCmKFyAArADZEBwMKYoXIECMDAkQbAwpihZwEDD8CQwMKYoWcJCxDAkRDAwpihcgAEwMCRCcDC
====catalogjs annotation end====*/