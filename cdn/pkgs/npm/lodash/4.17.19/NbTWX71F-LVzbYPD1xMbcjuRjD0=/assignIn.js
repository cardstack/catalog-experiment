import { default as copyObject } from "./dist/54.js";
import { default as createAssigner } from "./dist/48.js";
import { default as keysIn } from "./keysIn.js";
var assignIn = createAssigner(function (object, source) {
  copyObject(source, keysIn(source), object);
});
export { assignIn as default };
/*====catalogjs annotation start====
k5OVwqwuL2Rpc3QvNTQuanMDwsCVwqwuL2Rpc3QvNDguanMGwsCVwqsuL2tleXNJbi5qcwnCwIGnZGVmYXVsdJWhbKhhc3NpZ25JbhPAwNwAFZehbwAAA8CRDMCZoWQJAALAkQLAwpmhaapjb3B5T2JqZWN0kgIQwACnZGVmYXVsdMDAwJihcgsKwMCRAcDCnKFpABcBBpDAwgDCwMCZoWQJAAXAkQXAwpmhaa5jcmVhdGVBc3NpZ25lcpIFD8ABp2RlZmF1bHTAwMCYoXILDsDAkQTAwpyhaQEXBAmQwMIBwsDAmaFkCQAIwJEIwMKZoWmma2V5c0lukggRwAKnZGVmYXVsdMDAwJihcgsGwMCRB8DCnKFpARYHCpDAwgLCwMCXoW8BAAsSkMCYoWcAAQzAkMDCmaFkBAANwJMNCw7AwpmhbKhhc3NpZ25JbpINFMDAwAuQ2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvYXNzaWduSW4uanOYoXIACMAOkQzAwpihZwMVD8CTDxARwMKYoXIADsAQkQTAwpihch8KwBGRAcDCmKFyCQbAwJEHwMKYoWcBAxPAkMDCmKFnCQsUwJEUwMKYoXIACMDAkQzAwg==
====catalogjs annotation end====*/