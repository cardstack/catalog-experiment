import { default as baseDelay } from "./dist/161.js";
import { default as baseRest } from "./dist/49.js";
var defer = baseRest(function (func, args) {
  return baseDelay(func, 1, args);
});
export { defer as default };
/*====catalogjs annotation start====
k5KVwq0uL2Rpc3QvMTYxLmpzA8LAlcKsLi9kaXN0LzQ5LmpzB8LAgadkZWZhdWx0laFspWRlZmVyEcDA3AATl6FvAAADwJELwJmhZAkAAgSRAsDCmaFpqWJhc2VEZWxheZICD8AAp2RlZmF1bHTAwMCYoXILCcDAkQHAwpyhaQABAQeRBMDCAMLAwJihZwgPwMCQwMKZoWQJAAYIkQbAwpmhaahiYXNlUmVzdJIGDsABp2RlZmF1bHTAwMCYoXILCMDAkQXAwpyhaQEBBQmRCMDCAcLAwJihZwgOwMCQwMKXoW8BAAoQkMCYoWcAAQvAkMDCmaFkBAAMwJMMCg3AwpmhbKVkZWZlcpIMEsDAwAqQ2UVXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvZGVmZXIuanOYoXIABcANkQvAwpihZwMTDsCSDg/AwpihcgAIwA+RBcDCmKFyIgnAwJEBwMKYoWcBAxHAkMDCmKFnCQsSwJESwMKYoXIABcDAkQvAwg==
====catalogjs annotation end====*/