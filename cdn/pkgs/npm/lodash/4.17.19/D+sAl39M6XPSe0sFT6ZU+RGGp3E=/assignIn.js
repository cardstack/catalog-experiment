import { default as copyObject } from "./dist/54.js";
import { default as createAssigner } from "./dist/48.js";
import { default as keysIn } from "./keysIn.js";
var assignIn = createAssigner(function (object, source) {
  copyObject(source, keysIn(source), object);
});
export { assignIn as default };
/*====catalogjs annotation start====
k5OVwqwuL2Rpc3QvNTQuanMDwsCVwqwuL2Rpc3QvNDguanMHwsCVwqsuL2tleXNJbi5qcwvCwIGnZGVmYXVsdJWhbKhhc3NpZ25JbhbAwNwAGJehbwAAA8CRD8CZoWQJAAIEkQLAwpmhaapjb3B5T2JqZWN0kgITwACnZGVmYXVsdMDAwJihcgsKwMCRAcDCnKFpAAEBB5EEwMIAwsDAmKFnCA7AwJDAwpmhZAkABgiRBsDCmaFprmNyZWF0ZUFzc2lnbmVykgYSwAGnZGVmYXVsdMDAwJihcgsOwMCRBcDCnKFpAQEFC5EIwMIBwsDAmKFnCA7AwJDAwpmhZAkACgyRCsDCmaFppmtleXNJbpIKFMACp2RlZmF1bHTAwMCYoXILBsDAkQnAwpyhaQEBCQ2RDMDCAsLAwJihZwgNwMCQwMKXoW8BAA4VkMCYoWcAAQ/AkMDCmaFkBAAQwJMQDhHAwpmhbKhhc3NpZ25JbpIQF8DAwA6Q2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvYXNzaWduSW4uanOYoXIACMARkQ/AwpihZwMVEsCTEhMUwMKYoXIADsATkQXAwpihch8KwBSRAcDCmKFyCQbAwJEJwMKYoWcBAxbAkMDCmKFnCQsXwJEXwMKYoXIACMDAkQ/Awg==
====catalogjs annotation end====*/