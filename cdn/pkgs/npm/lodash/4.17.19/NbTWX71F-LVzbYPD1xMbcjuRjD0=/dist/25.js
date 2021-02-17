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
k5GVwq4uLi90b051bWJlci5qcwPCwIGnZGVmYXVsdJWhbLljcmVhdGVSZWxhdGlvbmFsT3BlcmF0aW9uC8DAnZehbwAAA8CQwJmhZAkAAgSRAsDCmaFpqHRvTnVtYmVykwIICcAAp2RlZmF1bHTAwMCYoXILCMDAkQHAwpyhaQABAQWRBMDCAMLAwJihZwgQwMCQwMKXoW8BAAYKkMCZoWQAOQfAkwgJB8DCmaFsuWNyZWF0ZVJlbGF0aW9uYWxPcGVyYXRpb26SBwzAwMDAkNlaV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19jcmVhdGVSZWxhdGlvbmFsT3BlcmF0aW9uLmpzmKFyCRnACJEGwMKYoXLMgQjACZEBwMKYoXIXCMDAkQHAwpihZwEDC8CQwMKYoWcJCwzAkQzAwpihcgAZwMCRBsDC
====catalogjs annotation end====*/