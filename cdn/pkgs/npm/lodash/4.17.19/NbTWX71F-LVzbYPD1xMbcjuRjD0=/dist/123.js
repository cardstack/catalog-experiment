import { default as baseFindIndex } from "./124.js";
import { default as baseIsNaN } from "./125.js";
function strictIndexOf(array, value, fromIndex) {
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }

  return -1;
}
function baseIndexOf(array, value, fromIndex) {
  return value === value ? strictIndexOf(array, value, fromIndex) : baseFindIndex(array, baseIsNaN, fromIndex);
}
export { baseIndexOf as default };
/*====catalogjs annotation start====
k5KVwqguLzEyNC5qcwPCwJXCqC4vMTI1LmpzBsLAgadkZWZhdWx0laFsq2Jhc2VJbmRleE9mEcDA3AATl6FvAAADwJDAmaFkCQACwJECwMKZoWmtYmFzZUZpbmRJbmRleJICDsAAp2RlZmF1bHTAwMCYoXILDcDAkQHAwpyhaQATAQaQwMIAwsDAmaFkCQAFwJEFwMKZoWmpYmFzZUlzTmFOkgUPwAGnZGVmYXVsdMDAwJihcgsJwMCRBMDCnKFpARMEB5DAwgHCwMCXoW8BAAgKkMCZoWQAzMMJwJEJwMKZoWytc3RyaWN0SW5kZXhPZpIJDcDAwMCQ2U5XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX3N0cmljdEluZGV4T2YuanOYoXIJDcDAkQjAwpehbwEACxCQwJmhZAAPDMCUDQ4PDMDCmaFsq2Jhc2VJbmRleE9mkgwSwMDAwJDZTFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZUluZGV4T2YuanOYoXIJC8ANkQvAwpihcjcNwA6RCMDCmKFyHA3AD5EBwMKYoXIICcDAkQTAwpihZwEDEcCQwMKYoWcJCxLAkRLAwpihcgALwMCRC8DC
====catalogjs annotation end====*/