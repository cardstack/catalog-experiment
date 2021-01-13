import { default as baseIsMatch } from "./dist/42.js";
import { default as getMatchData } from "./dist/72.js";
function isMatchWith(object, source, customizer) {
  customizer = typeof customizer == 'function' ? customizer : undefined;
  return baseIsMatch(object, source, getMatchData(source), customizer);
}
export { isMatchWith as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvNDIuanMDwsCVwqwuL2Rpc3QvNzIuanMGwsCBp2RlZmF1bHSUoWyraXNNYXRjaFdpdGgNwJ+XoW8AAAPAkQjAmaFkCQACwJECwMKYoWmrYmFzZUlzTWF0Y2iSAgrAAKdkZWZhdWx0wMCYoXILC8DAkQHAwpyhaQAXAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmsZ2V0TWF0Y2hEYXRhkgULwAGnZGVmYXVsdMDAmKFyCwzAwJEEwMKcoWkBFwQHkMDCAcLAwJehbwEACAyQwJmhZAAYCcCTCgsJwMKYoWyraXNNYXRjaFdpdGiSCQ7AwMDA2UtXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvaXNNYXRjaFdpdGguanOYoXIJC8AKkQjAwpihcnELwAuRAcDCmKFyEQzAwJEEwMKYoWcBAw3AkMDCmKFnCQsOwJEOwMKYoXIAC8DAkQjAwg==
====catalogjs annotation end====*/