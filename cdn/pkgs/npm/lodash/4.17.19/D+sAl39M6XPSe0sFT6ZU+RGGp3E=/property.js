import { default as baseGet } from "./dist/14.js";
import { default as baseProperty } from "./dist/156.js";
import { default as isKey } from "./dist/26.js";
import { default as toKey } from "./dist/27.js";
function basePropertyDeep(path) {
  return function (object) {
    return baseGet(object, path);
  };
}
function property(path) {
  return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
}
export { property as default };
/*====catalogjs annotation start====
k5SVwqwuL2Rpc3QvMTQuanMDwsCVwq0uL2Rpc3QvMTU2LmpzB8LAlcKsLi9kaXN0LzI2LmpzC8LAlcKsLi9kaXN0LzI3LmpzD8LAgadkZWZhdWx0laFsqHByb3BlcnR5HcDA3AAfl6FvAAADwJDAmaFkCQACBJECwMKZoWmnYmFzZUdldJICFMAAp2RlZmF1bHTAwMCYoXILB8DAkQHAwpyhaQABAQeRBMDCAMLAwJihZwgOwMCQwMKZoWQJAAYIkQbAwpmhaaxiYXNlUHJvcGVydHmSBhnAAadkZWZhdWx0wMDAmKFyCwzAwJEFwMKcoWkBAQULkQjAwgHCwMCYoWcID8DAkMDCmaFkCQAKDJEKwMKZoWmlaXNLZXmSChjAAqdkZWZhdWx0wMDAmKFyCwXAwJEJwMKcoWkBAQkPkQzAwgLCwMCYoWcIDsDAkMDCmaFkCQAOEJEOwMKZoWmldG9LZXmSDhrAA6dkZWZhdWx0wMDAmKFyCwXAwJENwMKcoWkBAQ0RkRDAwgPCwMCYoWcIDsDAkMDCl6FvAQASFZDAmaFkABYTwJIUE8DCmaFssGJhc2VQcm9wZXJ0eURlZXCSExvAwMDAkNlRV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlUHJvcGVydHlEZWVwLmpzmKFyCRDAFJESwMKYoXIxB8DAkQHAwpehbwEAFhyQwJmhZAAJF8CVGBkaGxfAwpmhbKhwcm9wZXJ0eZIXHsDAwMCQ2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvcHJvcGVydHkuanOYoXIJCMAYkRbAwpihchIFwBmRCcDCmKFyCQzAGpEFwMKYoXIBBcAbkQ3AwpihcgoQwMCREsDCmKFnAQMdwJDAwpihZwkLHsCRHsDCmKFyAAjAwJEWwMI=
====catalogjs annotation end====*/