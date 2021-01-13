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
k5OVwq0uL2Rpc3QvMTcxLmpzA8LAlcKrLi92YWx1ZXMuanMGwsCVwqwuL2lzQXJyYXkuanMJwsCBp2RlZmF1bHSUoWymc2FtcGxlGsDcAByXoW8AAAPAkwsPFMCZoWQJAALAkQLAwpihaapiYXNlUmFuZG9tkgINwACnZGVmYXVsdMDAmKFyCwrAwJEBwMKcoWkAGAEGkMDCAMLAwJmhZAkABcCRBcDCmKFppnZhbHVlc5IFEsABp2RlZmF1bHTAwJihcgsGwMCRBMDCnKFpARYECZDAwgHCwMCZoWQJAAjAkQjAwpihaadpc0FycmF5kggWwAKnZGVmYXVsdMDAmKFyCwfAwJEHwMKcoWkBFwcKkMDCAsLAwJehbwEACw6QwJmhZAAfDMCSDQzAwpihbKthcnJheVNhbXBsZZMMERfAwMDA2UxXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2FycmF5U2FtcGxlLmpzmKFyCQvADZELwMKYoXI/CsDAkQHAwpehbwEADxOQwJmhZAAQEMCTERIQwMKYoWyqYmFzZVNhbXBsZZIQGMDAwMDZS1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZVNhbXBsZS5qc5ihcgkKwBGRD8DCmKFyGAvAEpELwMKYoXIBBsDAkQTAwpehbwEAFBmQwJmhZAAeFcCUFhcYFcDCmKFspnNhbXBsZZIVG8DAwMDZRlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9zYW1wbGUuanOYoXIJBsAWkRTAwpihchwHwBeRB8DCmKFyDwvAGJELwMKYoXIDCsDAkQ/AwpihZwEDGsCQwMKYoWcJCxvAkRvAwpihcgAGwMCRFMDC
====catalogjs annotation end====*/