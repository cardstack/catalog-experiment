import { default as baseForOwn } from "./77.js";
function baseInverter(object, setter, iteratee, accumulator) {
  baseForOwn(object, function (value, key, object) {
    setter(accumulator, iteratee(value), key, object);
  });
  return accumulator;
}
function createInverter(setter, toIteratee) {
  return function (object, iteratee) {
    return baseInverter(object, setter, toIteratee(iteratee), {});
  };
}
export { createInverter as default };
/*====catalogjs annotation start====
k5GVwqcuLzc3LmpzA8LAgadkZWZhdWx0laFsrmNyZWF0ZUludmVydGVyDsDA3AAQl6FvAAADwJDAmaFkCQACBJECwMKZoWmqYmFzZUZvck93bpICCMAAp2RlZmF1bHTAwMCYoXILCsDAkQHAwpyhaQABAQWRBMDCAMLAwJihZwgJwMCQwMKXoW8BAAYJkMCZoWQAfQfAkggHwMKZoWysYmFzZUludmVydGVykgcMwMDAwJDZTVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZUludmVydGVyLmpzmKFyCQzACJEGwMKYoXIsCsDAkQHAwpehbwEACg2QwJmhZAAyC8CSDAvAwpmhbK5jcmVhdGVJbnZlcnRlcpILD8DAwMCQ2U9XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2NyZWF0ZUludmVydGVyLmpzmKFyCQ7ADJEKwMKYoXJJDMDAkQbAwpihZwEDDsCQwMKYoWcJCw/AkQ/AwpihcgAOwMCRCsDC
====catalogjs annotation end====*/