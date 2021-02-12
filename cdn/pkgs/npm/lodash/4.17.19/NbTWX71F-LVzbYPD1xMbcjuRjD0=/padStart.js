import { default as createPadding } from "./dist/21.js";
import { default as stringSize } from "./dist/144.js";
import { default as toInteger } from "./toInteger.js";
import { default as toString0 } from "./toString.js";
function padStart(string, length, chars) {
  string = toString0(string);
  length = toInteger(length);
  var strLength = length ? stringSize(string) : 0;
  return length && strLength < length ? createPadding(length - strLength, chars) + string : string;
}
export { padStart as default };
/*====catalogjs annotation start====
k5SVwqwuL2Rpc3QvMjEuanMDwsCVwq0uL2Rpc3QvMTQ0LmpzBsLAlcKuLi90b0ludGVnZXIuanMJwsCVwq0uL3RvU3RyaW5nLmpzDMLAgadkZWZhdWx0laFsqHBhZFN0YXJ0FcDA3AAXl6FvAAADwJDAmaFkCQACwJECwMKZoWmtY3JlYXRlUGFkZGluZ5ICE8AAp2RlZmF1bHTAwMCYoXILDcDAkQHAwpyhaQAXAQaQwMIAwsDAmaFkCQAFwJEFwMKZoWmqc3RyaW5nU2l6ZZIFEsABp2RlZmF1bHTAwMCYoXILCsDAkQTAwpyhaQEYBAmQwMIBwsDAmaFkCQAIwJEIwMKZoWmpdG9JbnRlZ2VykggRwAKnZGVmYXVsdMDAwJihcgsJwMCRB8DCnKFpARkHDJDAwgLCwMCZoWQJAAvAkQvAwpmhaal0b1N0cmluZzCSCxDAA6dkZWZhdWx0wMDAmKFyCwnAwJEKwMKcoWkBGAoNkMDCA8LAwJehbwEADhSQwJmhZAAwD8CVEBESEw/AwpmhbKhwYWRTdGFydJIPFsDAwMCQ2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvcGFkU3RhcnQuanOYoXIJCMAQkQ7AwpihciUJwBGRCsDCmKFyFQnAEpEHwMKYoXIlCsATkQTAwpihcjYNwMCRAcDCmKFnAQMVwJDAwpihZwkLFsCRFsDCmKFyAAjAwJEOwMI=
====catalogjs annotation end====*/