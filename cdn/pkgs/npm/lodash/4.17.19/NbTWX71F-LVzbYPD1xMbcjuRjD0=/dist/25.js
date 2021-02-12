import { default as toNumber } from "../toNumber.js";
function createRelationalOperation(operator) {
  return function (value, other) {
    if (!(typeof value == 'string' && typeof other == 'string')) {
      value = toNumber(value);
      other = toNumber(other);
    }

    return operator(value, other);
  };
}
export { createRelationalOperation as default };
/*====catalogjs annotation start====
k5GVwq4uLi90b051bWJlci5qcwPCwIGnZGVmYXVsdJWhbLljcmVhdGVSZWxhdGlvbmFsT3BlcmF0aW9uCsDAnJehbwAAA8CQwJmhZAkAAsCRAsDCmaFpqHRvTnVtYmVykwIHCMAAp2RlZmF1bHTAwMCYoXILCMDAkQHAwpyhaQAZAQSQwMIAwsDAl6FvAQAFCZDAmaFkADkGwJMHCAbAwpmhbLljcmVhdGVSZWxhdGlvbmFsT3BlcmF0aW9ukgYLwMDAwJDZWlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fY3JlYXRlUmVsYXRpb25hbE9wZXJhdGlvbi5qc5ihcgkZwAeRBcDCmKFyzIEIwAiRAcDCmKFyFwjAwJEBwMKYoWcBAwrAkMDCmKFnCQsLwJELwMKYoXIAGcDAkQXAwg==
====catalogjs annotation end====*/