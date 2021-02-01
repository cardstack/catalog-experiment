import { default as baseGet } from "./dist/14.js";
function propertyOf(object) {
  return function (path) {
    return object == null ? undefined : baseGet(object, path);
  };
}
export { propertyOf as default };
/*====catalogjs annotation start====
k5GVwqwuL2Rpc3QvMTQuanMDwsCBp2RlZmF1bHSUoWyqcHJvcGVydHlPZgnAm5ehbwAAA8CQwJmhZAkAAsCRAsDCmKFpp2Jhc2VHZXSSAgfAAKdkZWZhdWx0wMCYoXILB8DAkQHAwpyhaQAXAQSQwMIAwsDAl6FvAQAFCJDAmaFkABYGwJIHBsDCmKFsqnByb3BlcnR5T2aSBgrAwMDA2UpXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvcHJvcGVydHlPZi5qc5ihcgkKwAeRBcDCmKFyTgfAwJEBwMKYoWcBAwnAkMDCmKFnCQsKwJEKwMKYoXIACsDAkQXAwg==
====catalogjs annotation end====*/