import { default as createWrap } from "./dist/23.js";
import { default as flatRest } from "./dist/50.js";
var WRAP_REARG_FLAG = 256;
var rearg = flatRest(function (func, indexes) {
  return createWrap(func, WRAP_REARG_FLAG, undefined, undefined, undefined, indexes);
});
export { rearg as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvMjMuanMDwsCVwqwuL2Rpc3QvNTAuanMGwsCBp2RlZmF1bHSVoWylcmVhcmcTwMDcABWXoW8AAAPAkQzAmaFkCQACwJECwMKZoWmqY3JlYXRlV3JhcJICEMAAp2RlZmF1bHTAwMCYoXILCsDAkQHAwpyhaQAXAQaQwMIAwsDAmaFkCQAFwJEFwMKZoWmoZmxhdFJlc3SSBQ/AAadkZWZhdWx0wMDAmKFyCwjAwJEEwMKcoWkBFwQHkMDCAcLAwJehbwEACBKQwJihZwABCQuQwMKZoWQEBgrAkgoIwMKZoWyvV1JBUF9SRUFSR19GTEFHkgoRwMDACJDZRVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9yZWFyZy5qc5ihcgAPwMCRCcDCmKFnAQEMwJDAwpmhZAQADcCUDQsOCcDCmaFspXJlYXJnkg0UwMDAC5DZRVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9yZWFyZy5qc5ihcgAFwA6RDMDCmKFnAy8PwJMPEBHAwpihcgAIwBCRBMDCmKFyJQrAEZEBwMKYoXIHD8DAkQnAwpihZwEDE8CQwMKYoWcJCxTAkRTAwpihcgAFwMCRDMDC
====catalogjs annotation end====*/