import { default as baseEach } from "./75.js";
import { default as baseIteratee } from "./6.js";
import { default as isArray } from "../isArray.js";
function arrayAggregator(array, setter, iteratee, accumulator) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    var value = array[index];
    setter(accumulator, value, iteratee(value), array);
  }

  return accumulator;
}
function baseAggregator(collection, setter, iteratee, accumulator) {
  baseEach(collection, function (value, key, collection) {
    setter(accumulator, value, iteratee(value), collection);
  });
  return accumulator;
}
function createAggregator(setter, initializer) {
  return function (collection, iteratee) {
    var func = isArray(collection) ? arrayAggregator : baseAggregator,
        accumulator = initializer ? initializer() : {};
    return func(collection, setter, baseIteratee(iteratee, 2), accumulator);
  };
}
export { createAggregator as default };
/*====catalogjs annotation start====
k5OVwqcuLzc1LmpzA8LAlcKmLi82LmpzBsLAlcKtLi4vaXNBcnJheS5qcwnCwIGnZGVmYXVsdJWhbLBjcmVhdGVBZ2dyZWdhdG9yGcDA3AAbl6FvAAADwJDAmaFkCQACwJECwMKZoWmoYmFzZUVhY2iSAhDAAKdkZWZhdWx0wMDAmKFyCwjAwJEBwMKcoWkAEgEGkMDCAMLAwJmhZAkABcCRBcDCmaFprGJhc2VJdGVyYXRlZZIFF8ABp2RlZmF1bHTAwMCYoXILDMDAkQTAwpyhaQERBAmQwMIBwsDAmaFkCQAIwJEIwMKZoWmnaXNBcnJheZIIFMACp2RlZmF1bHTAwMCYoXILB8DAkQfAwpyhaQEYBwqQwMICwsDAl6FvAQALDZDAmaFkAMz8DMCRDMDCmaFsr2FycmF5QWdncmVnYXRvcpIMFcDAwMCQ2VBXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2FycmF5QWdncmVnYXRvci5qc5ihcgkPwMCRC8DCl6FvAQAOEZDAmaFkAMyLD8CSEA/AwpmhbK5iYXNlQWdncmVnYXRvcpIPFsDAwMCQ2U9XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VBZ2dyZWdhdG9yLmpzmKFyCQ7AEJEOwMKYoXIwCMDAkQHAwpehbwEAEhiQwJmhZAAjE8CVFBUWFxPAwpmhbLBjcmVhdGVBZ2dyZWdhdG9ykhMawMDAwJDZUVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fY3JlYXRlQWdncmVnYXRvci5qc5ihcgkQwBSREsDCmKFyUgfAFZEHwMKYoXIPD8AWkQvAwpihcgMOwBeRDsDCmKFyXgzAwJEEwMKYoWcBAxnAkMDCmKFnCQsawJEawMKYoXIAEMDAkRLAwg==
====catalogjs annotation end====*/