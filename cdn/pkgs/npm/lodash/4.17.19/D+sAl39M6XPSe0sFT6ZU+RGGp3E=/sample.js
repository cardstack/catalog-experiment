import { default as baseRandom } from "./dist/171.js";
import { default as values } from "./values.js";
import { default as isArray } from "./isArray.js";
function arraySample(array) {
  var length = array.length;
  return length ? array[baseRandom(0, length - 1)] : undefined;
}
function baseSample(collection) {
  return arraySample(values(collection));
}
function sample(collection) {
  var func = isArray(collection) ? arraySample : baseSample;
  return func(collection);
}
export { sample as default };
/*====catalogjs annotation start====
k5OVwq0uL2Rpc3QvMTcxLmpzA8LAlcKrLi92YWx1ZXMuanMHwsCVwqwuL2lzQXJyYXkuanMLwsCBp2RlZmF1bHSVoWymc2FtcGxlHcDA3AAfl6FvAAADwJDAmaFkCQACBJECwMKZoWmqYmFzZVJhbmRvbZICEMAAp2RlZmF1bHTAwMCYoXILCsDAkQHAwpyhaQABAQeRBMDCAMLAwJihZwgPwMCQwMKZoWQJAAYIkQbAwpmhaaZ2YWx1ZXOSBhXAAadkZWZhdWx0wMDAmKFyCwbAwJEFwMKcoWkBAQULkQjAwgHCwMCYoWcIDcDAkMDCmaFkCQAKDJEKwMKZoWmnaXNBcnJheZIKGcACp2RlZmF1bHTAwMCYoXILB8DAkQnAwpyhaQEBCQ2RDMDCAsLAwJihZwgOwMCQwMKXoW8BAA4RkMCZoWQAHw/AkhAPwMKZoWyrYXJyYXlTYW1wbGWTDxQawMDAwJDZTFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYXJyYXlTYW1wbGUuanOYoXIJC8AQkQ7Awpihcj8KwMCRAcDCl6FvAQASFpDAmaFkABATwJMUFRPAwpmhbKpiYXNlU2FtcGxlkhMbwMDAwJDZS1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZVNhbXBsZS5qc5ihcgkKwBSREsDCmKFyGAvAFZEOwMKYoXIBBsDAkQXAwpehbwEAFxyQwJmhZAAeGMCUGRobGMDCmaFspnNhbXBsZZIYHsDAwMCQ2UZXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvc2FtcGxlLmpzmKFyCQbAGZEXwMKYoXIcB8AakQnAwpihcg8LwBuRDsDCmKFyAwrAwJESwMKYoWcBAx3AkMDCmKFnCQsewJEewMKYoXIABsDAkRfAwg==
====catalogjs annotation end====*/