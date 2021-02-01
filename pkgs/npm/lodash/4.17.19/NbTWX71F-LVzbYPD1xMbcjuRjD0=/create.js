import { default as baseAssign } from "./dist/52.js";
import { default as baseCreate } from "./dist/106.js";
function create(prototype, properties) {
  var result = baseCreate(prototype);
  return properties == null ? result : baseAssign(result, properties);
}
export { create as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvNTIuanMDwsCVwq0uL2Rpc3QvMTA2LmpzBsLAgadkZWZhdWx0lKFspmNyZWF0ZQ3An5ehbwAAA8CQwJmhZAkAAsCRAsDCmKFpqmJhc2VBc3NpZ26SAgvAAKdkZWZhdWx0wMCYoXILCsDAkQHAwpyhaQAXAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmqYmFzZUNyZWF0ZZIFCsABp2RlZmF1bHTAwJihcgsKwMCRBMDCnKFpARgEB5DAwgHCwMCXoW8BAAgMkMCZoWQAFwnAkwoLCcDCmKFspmNyZWF0ZZIJDsDAwMDZRlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9jcmVhdGUuanOYoXIJBsAKkQjAwpihcikKwAuRBMDCmKFyNArAwJEBwMKYoWcBAw3AkMDCmKFnCQsOwJEOwMKYoXIABsDAkQjAwg==
====catalogjs annotation end====*/