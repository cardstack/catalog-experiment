import { default as hasPath } from "./dist/15.js";
function baseHasIn(object, key) {
  return object != null && key in Object(object);
}
function hasIn(object, path) {
  return object != null && hasPath(object, path, baseHasIn);
}
export { hasIn as default };
/*====catalogjs annotation start====
k5GVwqwuL2Rpc3QvMTUuanMDwsCBp2RlZmF1bHSUoWylaGFzSW4NwJ+XoW8AAAPAkgUIwJmhZAkAAsCRAsDCmKFpp2hhc1BhdGiSAgrAAKdkZWZhdWx0wMCYoXILB8DAkQHAwpyhaQAXAQSQwMIAwsDAl6FvAQAFB5DAmaFkAEMGwJEGwMKYoWypYmFzZUhhc0lukgYLwMDAwNlKV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlSGFzSW4uanOYoXIJCcDAkQXAwpehbwEACAyQwJmhZAAECcCTCgsJwMKYoWylaGFzSW6SCQ7AwMDA2UVXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvaGFzSW4uanOYoXIJBcAKkQjAwpihciwHwAuRAcDCmKFyDwnAwJEFwMKYoWcBAw3AkMDCmKFnCQsOwJEOwMKYoXIABcDAkQjAwg==
====catalogjs annotation end====*/