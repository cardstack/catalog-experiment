import { default as toString } from "./toString.js";
function replace() {
  var args = arguments,
      string = toString(args[0]);
  return args.length < 3 ? string : string.replace(args[1], args[2]);
}
export { replace as default };
/*====catalogjs annotation start====
k5GVwq0uL3RvU3RyaW5nLmpzA8LAgadkZWZhdWx0lKFsp3JlcGxhY2UJwJuXoW8AAAPAkQXAmaFkCQACwJECwMKYoWmodG9TdHJpbmeSAgfAAKdkZWZhdWx0wMCYoXILCMDAkQHAwpyhaQAYAQSQwMIAwsDAl6FvAQAFCJDAmaFkAFIGwJIHBsDCmKFsp3JlcGxhY2WSBgrAwMDA2UdXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvcmVwbGFjZS5qc5ihcgkHwAeRBcDCmKFyLAjAwJEBwMKYoWcBAwnAkMDCmKFnCQsKwJEKwMKYoXIAB8DAkQXAwg==
====catalogjs annotation end====*/