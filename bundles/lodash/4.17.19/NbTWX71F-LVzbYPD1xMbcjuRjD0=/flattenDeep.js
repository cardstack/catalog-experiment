import { default as baseFlatten } from "./dist/85.js";
var INFINITY = 1 / 0;
function flattenDeep(array) {
  var length = array == null ? 0 : array.length;
  return length ? baseFlatten(array, INFINITY) : [];
}
export { flattenDeep as default };
/*====catalogjs annotation start====
k5GVwqwuL2Rpc3QvODUuanMDwsCBp2RlZmF1bHSUoWyrZmxhdHRlbkRlZXANwJ+XoW8AAAPAkQjAmaFkCQACwJECwMKYoWmrYmFzZUZsYXR0ZW6SAgrAAKdkZWZhdWx0wMCYoXILC8DAkQHAwpyhaQAXAQSQwMIAwsDAl6FvAQAFDJDAmKFnAAEGCJDAwpmhZAQIB8CSBwXAwpihbKhJTkZJTklUWZIHC8DAwAXZS1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9mbGF0dGVuRGVlcC5qc5ihcgAIwMCRBsDCmaFkAQkJwJQKCwkGwMKYoWyrZmxhdHRlbkRlZXCSCQ7AwMDA2UtXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvZmxhdHRlbkRlZXAuanOYoXIJC8AKkQjAwpihck0LwAuRAcDCmKFyCAjAwJEGwMKYoWcBAw3AkMDCmKFnCQsOwJEOwMKYoXIAC8DAkQjAwg==
====catalogjs annotation end====*/