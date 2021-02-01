import { default as baseInvoke } from "./dist/8.js";
import { default as baseRest } from "./dist/49.js";
var methodOf = baseRest(function (object, args) {
  return function (path) {
    return baseInvoke(object, path, args);
  };
});
export { methodOf as default };
/*====catalogjs annotation start====
k5KVwqsuL2Rpc3QvOC5qcwPCwJXCrC4vZGlzdC80OS5qcwbCwIGnZGVmYXVsdJShbKhtZXRob2RPZg/A3AARl6FvAAADwJEJwJmhZAkAAsCRAsDCmKFpqmJhc2VJbnZva2WSAg3AAKdkZWZhdWx0wMCYoXILCsDAkQHAwpyhaQAWAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmoYmFzZVJlc3SSBQzAAadkZWZhdWx0wMCYoXILCMDAkQTAwpyhaQEXBAeQwMIBwsDAl6FvAQAIDpDAmKFnAAEJwJDAwpmhZAQACsCTCggLwMKYoWyobWV0aG9kT2aSChDAwMAI2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvbWV0aG9kT2YuanOYoXIACMALkQnAwpihZwMdDMCSDA3AwpihcgAIwA2RBMDCmKFyQQrAwJEBwMKYoWcBAw/AkMDCmKFnCQsQwJEQwMKYoXIACMDAkQnAwg==
====catalogjs annotation end====*/