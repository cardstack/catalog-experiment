import { default as copyObject } from "./dist/54.js";
import { default as createAssigner } from "./dist/48.js";
import { default as keysIn } from "./keysIn.js";
var assignInWith = createAssigner(function (object, source, srcIndex, customizer) {
  copyObject(source, keysIn(source), object, customizer);
});
export { assignInWith as default };
/*====catalogjs annotation start====
k5OVwqwuL2Rpc3QvNTQuanMDwsCVwqwuL2Rpc3QvNDguanMGwsCVwqsuL2tleXNJbi5qcwnCwIGnZGVmYXVsdJWhbKxhc3NpZ25JbldpdGgTwMDcABWXoW8AAAPAkQzAmaFkCQACwJECwMKZoWmqY29weU9iamVjdJICEMAAp2RlZmF1bHTAwMCYoXILCsDAkQHAwpyhaQAXAQaQwMIAwsDAmaFkCQAFwJEFwMKZoWmuY3JlYXRlQXNzaWduZXKSBQ/AAadkZWZhdWx0wMDAmKFyCw7AwJEEwMKcoWkBFwQJkMDCAcLAwJmhZAkACMCRCMDCmaFppmtleXNJbpIIEcACp2RlZmF1bHTAwMCYoXILBsDAkQfAwpyhaQEWBwqQwMICwsDAl6FvAQALEpDAmKFnAAEMwJDAwpmhZAQADcCTDQsOwMKZoWysYXNzaWduSW5XaXRokg0UwMDAC5DZTFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9hc3NpZ25JbldpdGguanOYoXIADMAOkQzAwpihZwMhD8CTDxARwMKYoXIADsAQkQTAwpihcjUKwBGRAcDCmKFyCQbAwJEHwMKYoWcBAxPAkMDCmKFnCQsUwJEUwMKYoXIADMDAkQzAwg==
====catalogjs annotation end====*/