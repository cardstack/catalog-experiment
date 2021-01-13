import { default as arrayEach } from "./dist/119.js";
import { default as baseAssignValue } from "./dist/56.js";
import { default as bind } from "./bind.js";
import { default as flatRest } from "./dist/50.js";
import { default as toKey } from "./dist/27.js";
var bindAll = flatRest(function (object, methodNames) {
  arrayEach(methodNames, function (key) {
    key = toKey(key);
    baseAssignValue(object, key, bind(object[key], object));
  });
  return object;
});
export { bindAll as default };
/*====catalogjs annotation start====
k5WVwq0uL2Rpc3QvMTE5LmpzA8LAlcKsLi9kaXN0LzU2LmpzBsLAlcKpLi9iaW5kLmpzCcLAlcKsLi9kaXN0LzUwLmpzDMLAlcKsLi9kaXN0LzI3LmpzD8LAgadkZWZhdWx0lKFsp2JpbmRBbGwbwNwAHZehbwAAA8CREsCZoWQJAALAkQLAwpihaalhcnJheUVhY2iSAhbAAKdkZWZhdWx0wMCYoXILCcDAkQHAwpyhaQAYAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmvYmFzZUFzc2lnblZhbHVlkgUYwAGnZGVmYXVsdMDAmKFyCw/AwJEEwMKcoWkBFwQJkMDCAcLAwJmhZAkACMCRCMDCmKFppGJpbmSSCBnAAqdkZWZhdWx0wMCYoXILBMDAkQfAwpyhaQEUBwyQwMICwsDAmaFkCQALwJELwMKYoWmoZmxhdFJlc3SSCxXAA6dkZWZhdWx0wMCYoXILCMDAkQrAwpyhaQEXCg+QwMIDwsDAmaFkCQAOwJEOwMKYoWmldG9LZXmSDhfABKdkZWZhdWx0wMCYoXILBcDAkQ3AwpyhaQEXDRCQwMIEwsDAl6FvAQARGpDAmKFnAAESwJDAwpmhZAQAE8CTExEUwMKYoWynYmluZEFsbJITHMDAwBHZR1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9iaW5kQWxsLmpzmKFyAAfAFJESwMKYoWcDMRXAlhUWFxgZEsDCmKFyAAjAFpEKwMKYoXIkCcAXkQHAwpihcikFwBiRDcDCmKFyCw/AGZEEwMKYoXIOBMDAkQfAwpihZwEDG8CQwMKYoWcJCxzAkRzAwpihcgAHwMCREsDC
====catalogjs annotation end====*/