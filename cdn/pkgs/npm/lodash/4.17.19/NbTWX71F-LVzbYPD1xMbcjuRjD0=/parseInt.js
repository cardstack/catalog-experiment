import { default as root } from "./dist/93.js";
import { default as toString0 } from "./toString.js";
var reTrimStart = /^\s+/;
var nativeParseInt = root.parseInt;
function parseInt0(string, radix, guard) {
  if (guard || radix == null) {
    radix = 0;
  } else if (radix) {
    radix = +radix;
  }

  return nativeParseInt(toString0(string).replace(reTrimStart, ''), radix || 0);
}
export { parseInt0 as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvOTMuanMDwsCVwq0uL3RvU3RyaW5nLmpzBsLAgadkZWZhdWx0laFsqXBhcnNlSW50MBXAwNwAF5ehbwAAA8CQwJmhZAkAAsCRAsDCmaFppHJvb3SSAg7AAKdkZWZhdWx0wMDAmKFyCwTAwJEBwMKcoWkAFwEGkMDCAMLAwJmhZAkABcCRBcDCmaFpqXRvU3RyaW5nMJIFEsABp2RlZmF1bHTAwMCYoXILCcDAkQTAwpyhaQEYBAeQwMIBwsDAl6FvAQAIFJDAmKFnAAEJC5DAwpmhZAQJCsCSCgjAwpmhbKtyZVRyaW1TdGFydJIKE8DAwAiQ2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvcGFyc2VJbnQuanOYoXIAC8DAkQnAwpihZwEBDA+QwMKZoWQECQ3Akw4NC8DCmaFsrm5hdGl2ZVBhcnNlSW50kg0RwMDAC5DZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9wYXJzZUludC5qc5ihcgAOwA6RDMDCmKFyAwTAwJEBwMKZoWQBFRDAlhESExAMCcDCmaFsqXBhcnNlSW50MJIQFsDAwMCQ2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvcGFyc2VJbnQuanOYoXIJCcARkQ/AwpihcsyADsASkQzAwpihcgEJwBORBMDCmKFyEQvAwJEJwMKYoWcBAxXAkMDCmKFnCQsWwJEWwMKYoXIACcDAkQ/Awg==
====catalogjs annotation end====*/