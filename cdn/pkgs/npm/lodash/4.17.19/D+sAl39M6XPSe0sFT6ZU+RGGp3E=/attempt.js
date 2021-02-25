import { default as apply } from "./dist/111.js";
import { default as baseRest } from "./dist/49.js";
import { default as isError } from "./isError.js";
var attempt = baseRest(function (func, args) {
  try {
    return apply(func, undefined, args);
  } catch (e) {
    return isError(e) ? e : new Error(e);
  }
});
export { attempt as default };
/*====catalogjs annotation start====
k5OVwq0uL2Rpc3QvMTExLmpzA8LAlcKsLi9kaXN0LzQ5LmpzB8LAlcKsLi9pc0Vycm9yLmpzC8LAgadkZWZhdWx0laFsp2F0dGVtcHQWwMDcABiXoW8AAAPAkQ/AmaFkCQACBJECwMKZoWmlYXBwbHmSAhPAAKdkZWZhdWx0wMDAmKFyCwXAwJEBwMKcoWkAAQEHkQTAwgDCwMCYoWcID8DAkMDCmaFkCQAGCJEGwMKZoWmoYmFzZVJlc3SSBhLAAadkZWZhdWx0wMDAmKFyCwjAwJEFwMKcoWkBAQULkQjAwgHCwMCYoWcIDsDAkMDCmaFkCQAKDJEKwMKZoWmnaXNFcnJvcpIKFMACp2RlZmF1bHTAwMCYoXILB8DAkQnAwpyhaQEBCQ2RDMDCAsLAwJihZwgOwMCQwMKXoW8BAA4VkMCYoWcAAQ/AkMDCmaFkBAAQwJMQDhHAwpmhbKdhdHRlbXB0khAXwMDADpDZR1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9hdHRlbXB0LmpzmKFyAAfAEZEPwMKYoWcDHhLAkxITFMDCmKFyAAjAE5EFwMKYoXIsBcAUkQHAwpihcjQHwMCRCcDCmKFnAQMWwJDAwpihZwkLF8CRF8DCmKFyAAfAwJEPwMI=
====catalogjs annotation end====*/