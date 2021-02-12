import { default as arrayReduce } from "./146.js";
import { default as deburr } from "../deburr.js";
import { default as words } from "../words.js";
var rsApos = "['\u2019]";
var reApos = RegExp(rsApos, 'g');
function createCompounder(callback) {
  return function (string) {
    return arrayReduce(words(deburr(string).replace(reApos, '')), callback, '');
  };
}
export { createCompounder as default };
/*====catalogjs annotation start====
k5OVwqguLzE0Ni5qcwPCwJXCrC4uL2RlYnVyci5qcwbCwJXCqy4uL3dvcmRzLmpzCcLAgadkZWZhdWx0laFssGNyZWF0ZUNvbXBvdW5kZXIawMDcAByXoW8AAAPAkQ/AmaFkCQACwJECwMKZoWmrYXJyYXlSZWR1Y2WSAhXAAKdkZWZhdWx0wMDAmKFyCwvAwJEBwMKcoWkAEwEGkMDCAMLAwJmhZAkABcCRBcDCmaFppmRlYnVycpIFF8ABp2RlZmF1bHTAwMCYoXILBsDAkQTAwpyhaQEXBAmQwMIBwsDAmaFkCQAIwJEIwMKZoWmld29yZHOSCBbAAqdkZWZhdWx0wMDAmKFyCwXAwJEHwMKcoWkBFgcKkMDCAsLAwJehbwEACxmQwJihZwABDA6QwMKZoWQEDg3Akg0LwMKZoWymcnNBcG9zkg0SwMDAC5DZUVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fY3JlYXRlQ29tcG91bmRlci5qc5ihcgAGwMCRDMDCmKFnAQEPE5DAwpmhZAQAEMCUEA4RDMDCmaFspnJlQXBvc5IQGMDAwA6Q2VFXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2NyZWF0ZUNvbXBvdW5kZXIuanOYoXIABsARkQ/AwpihZwMGEsCREsDCmKFyBwbAwJEMwMKZoWQBHRTAlhUWFxgUD8DCmaFssGNyZWF0ZUNvbXBvdW5kZXKSFBvAwMDAkNlRV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19jcmVhdGVDb21wb3VuZGVyLmpzmKFyCRDAFZETwMKYoXI1C8AWkQHAwpihcgEFwBeRB8DCmKFyAQbAGJEEwMKYoXIRBsDAkQ/AwpihZwEDGsCQwMKYoWcJCxvAkRvAwpihcgAQwMCRE8DC
====catalogjs annotation end====*/