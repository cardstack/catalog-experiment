import { default as baseInvoke } from "./dist/8.js";
import { default as baseRest } from "./dist/49.js";
var method = baseRest(function (path, args) {
  return function (object) {
    return baseInvoke(object, path, args);
  };
});
export { method as default };
/*====catalogjs annotation start====
k5KVwqsuL2Rpc3QvOC5qcwPCwJXCrC4vZGlzdC80OS5qcwbCwIGnZGVmYXVsdJWhbKZtZXRob2QPwMDcABGXoW8AAAPAkQnAmaFkCQACwJECwMKZoWmqYmFzZUludm9rZZICDcAAp2RlZmF1bHTAwMCYoXILCsDAkQHAwpyhaQAWAQaQwMIAwsDAmaFkCQAFwJEFwMKZoWmoYmFzZVJlc3SSBQzAAadkZWZhdWx0wMDAmKFyCwjAwJEEwMKcoWkBFwQHkMDCAcLAwJehbwEACA6QwJihZwABCcCQwMKZoWQEAArAkwoIC8DCmaFspm1ldGhvZJIKEMDAwAiQ2UZXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvbWV0aG9kLmpzmKFyAAbAC5EJwMKYoWcDHQzAkgwNwMKYoXIACMANkQTAwpihckEKwMCRAcDCmKFnAQMPwJDAwpihZwkLEMCREMDCmKFyAAbAwJEJwMI=
====catalogjs annotation end====*/