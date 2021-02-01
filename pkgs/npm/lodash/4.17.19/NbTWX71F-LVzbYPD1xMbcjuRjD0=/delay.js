import { default as baseDelay } from "./dist/161.js";
import { default as baseRest } from "./dist/49.js";
import { default as toNumber } from "./toNumber.js";
var delay = baseRest(function (func, wait, args) {
  return baseDelay(func, toNumber(wait) || 0, args);
});
export { delay as default };
/*====catalogjs annotation start====
k5OVwq0uL2Rpc3QvMTYxLmpzA8LAlcKsLi9kaXN0LzQ5LmpzBsLAlcKtLi90b051bWJlci5qcwnCwIGnZGVmYXVsdJShbKVkZWxheRPA3AAVl6FvAAADwJEMwJmhZAkAAsCRAsDCmKFpqWJhc2VEZWxheZICEMAAp2RlZmF1bHTAwJihcgsJwMCRAcDCnKFpABgBBpDAwgDCwMCZoWQJAAXAkQXAwpihaahiYXNlUmVzdJIFD8ABp2RlZmF1bHTAwJihcgsIwMCRBMDCnKFpARcECZDAwgHCwMCZoWQJAAjAkQjAwpihaah0b051bWJlcpIIEcACp2RlZmF1bHTAwJihcgsIwMCRB8DCnKFpARgHCpDAwgLCwMCXoW8BAAsSkMCYoWcAAQzAkMDCmaFkBAANwJMNCw7AwpihbKVkZWxheZINFMDAwAvZRVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9kZWxheS5qc5ihcgAFwA6RDMDCmKFnAxYPwJMPEBHAwpihcgAIwBCRBMDCmKFyKAnAEZEBwMKYoXIHCMDAkQfAwpihZwEDE8CQwMKYoWcJCxTAkRTAwpihcgAFwMCRDMDC
====catalogjs annotation end====*/