import { default as baseIteratee } from "./dist/6.js";
import { default as baseWhile } from "./dist/141.js";
function dropRightWhile(array, predicate) {
  return array && array.length ? baseWhile(array, baseIteratee(predicate, 3), true, true) : [];
}
export { dropRightWhile as default };
/*====catalogjs annotation start====
k5KVwqsuL2Rpc3QvNi5qcwPCwJXCrS4vZGlzdC8xNDEuanMGwsCBp2RlZmF1bHSUoWyuZHJvcFJpZ2h0V2hpbGUNwJ+XoW8AAAPAkMCZoWQJAALAkQLAwpihaaxiYXNlSXRlcmF0ZWWSAgvAAKdkZWZhdWx0wMCYoXILDMDAkQHAwpyhaQAWAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmpYmFzZVdoaWxlkgUKwAGnZGVmYXVsdMDAmKFyCwnAwJEEwMKcoWkBGAQHkMDCAcLAwJehbwEACAyQwJmhZAAjCcCTCgsJwMKYoWyuZHJvcFJpZ2h0V2hpbGWSCQ7AwMDA2U5XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvZHJvcFJpZ2h0V2hpbGUuanOYoXIJDsAKkQjAwpihcjYJwAuRBMDCmKFyCAzAwJEBwMKYoWcBAw3AkMDCmKFnCQsOwJEOwMKYoXIADsDAkQjAwg==
====catalogjs annotation end====*/