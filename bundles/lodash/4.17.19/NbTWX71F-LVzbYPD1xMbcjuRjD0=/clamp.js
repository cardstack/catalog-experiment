import { default as baseClamp } from "./dist/148.js";
import { default as toNumber } from "./toNumber.js";
function clamp(number, lower, upper) {
  if (upper === undefined) {
    upper = lower;
    lower = undefined;
  }

  if (upper !== undefined) {
    upper = toNumber(upper);
    upper = upper === upper ? upper : 0;
  }

  if (lower !== undefined) {
    lower = toNumber(lower);
    lower = lower === lower ? lower : 0;
  }

  return baseClamp(toNumber(number), lower, upper);
}
export { clamp as default };
/*====catalogjs annotation start====
k5KVwq0uL2Rpc3QvMTQ4LmpzA8LAlcKtLi90b051bWJlci5qcwbCwIGnZGVmYXVsdJShbKVjbGFtcA/A3AARl6FvAAADwJEIwJmhZAkAAsCRAsDCmKFpqWJhc2VDbGFtcJICDMAAp2RlZmF1bHTAwJihcgsJwMCRAcDCnKFpABgBBpDAwgDCwMCZoWQJAAXAkQXAwpihaah0b051bWJlcpQFCgsNwAGnZGVmYXVsdMDAmKFyCwjAwJEEwMKcoWkBGAQHkMDCAcLAwJehbwEACA6QwJmhZAAaCcCVCgsMDQnAwpihbKVjbGFtcJIJEMDAwMDZRVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9jbGFtcC5qc5ihcgkFwAqRCMDCmKFyzI4IwAuRBMDCmKFyYAjADJEEwMKYoXJACcANkQHAwpihcgEIwMCRBMDCmKFnAQMPwJDAwpihZwkLEMCREMDCmKFyAAXAwJEIwMI=
====catalogjs annotation end====*/