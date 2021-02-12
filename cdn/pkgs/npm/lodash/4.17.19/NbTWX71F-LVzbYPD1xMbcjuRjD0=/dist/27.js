import { default as isSymbol } from "../isSymbol.js";
var INFINITY = 1 / 0;
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }

  var result = value + '';
  return result == '0' && 1 / value == -INFINITY ? '-0' : result;
}
export { toKey as default };
/*====catalogjs annotation start====
k5GVwq4uLi9pc1N5bWJvbC5qcwPCwIGnZGVmYXVsdJWhbKV0b0tleQ3AwJ+XoW8AAAPAkMCZoWQJAALAkQLAwpmhaahpc1N5bWJvbJICCsAAp2RlZmF1bHTAwMCYoXILCMDAkQHAwpyhaQAZAQSQwMIAwsDAl6FvAQAFDJDAmKFnAAEGCJDAwpmhZAQIB8CSBwXAwpmhbKhJTkZJTklUWZIHC8DAwAWQ2UZXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX3RvS2V5LmpzmKFyAAjAwJEGwMKZoWQBEwnAlAoLCQbAwpmhbKV0b0tleZIJDsDAwMCQ2UZXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX3RvS2V5LmpzmKFyCQXACpEIwMKYoXIsCMALkQHAwpihcmUIwMCRBsDCmKFnAQMNwJDAwpihZwkLDsCRDsDCmKFyAAXAwJEIwMI=
====catalogjs annotation end====*/