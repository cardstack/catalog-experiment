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
k5OVwq0uL2Rpc3QvMTcxLmpzA8LAlcKrLi92YWx1ZXMuanMGwsCVwqwuL2lzQXJyYXkuanMJwsCBp2RlZmF1bHSVoWymc2FtcGxlGsDA3AAcl6FvAAADwJDAmaFkCQACwJECwMKZoWmqYmFzZVJhbmRvbZICDcAAp2RlZmF1bHTAwMCYoXILCsDAkQHAwpyhaQAYAQaQwMIAwsDAmaFkCQAFwJEFwMKZoWmmdmFsdWVzkgUSwAGnZGVmYXVsdMDAwJihcgsGwMCRBMDCnKFpARYECZDAwgHCwMCZoWQJAAjAkQjAwpmhaadpc0FycmF5kggWwAKnZGVmYXVsdMDAwJihcgsHwMCRB8DCnKFpARcHCpDAwgLCwMCXoW8BAAsOkMCZoWQAHwzAkg0MwMKZoWyrYXJyYXlTYW1wbGWTDBEXwMDAwJDZTFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYXJyYXlTYW1wbGUuanOYoXIJC8ANkQvAwpihcj8KwMCRAcDCl6FvAQAPE5DAmaFkABAQwJMREhDAwpmhbKpiYXNlU2FtcGxlkhAYwMDAwJDZS1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZVNhbXBsZS5qc5ihcgkKwBGRD8DCmKFyGAvAEpELwMKYoXIBBsDAkQTAwpehbwEAFBmQwJmhZAAeFcCUFhcYFcDCmaFspnNhbXBsZZIVG8DAwMCQ2UZXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvc2FtcGxlLmpzmKFyCQbAFpEUwMKYoXIcB8AXkQfAwpihcg8LwBiRC8DCmKFyAwrAwJEPwMKYoWcBAxrAkMDCmKFnCQsbwJEbwMKYoXIABsDAkRTAwg==
====catalogjs annotation end====*/