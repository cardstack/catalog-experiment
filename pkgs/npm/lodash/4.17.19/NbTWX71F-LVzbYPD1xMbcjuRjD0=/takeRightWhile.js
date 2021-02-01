import { default as baseIteratee } from "./dist/6.js";
import { default as baseWhile } from "./dist/141.js";
function takeRightWhile(array, predicate) {
  return array && array.length ? baseWhile(array, baseIteratee(predicate, 3), false, true) : [];
}
export { takeRightWhile as default };
/*====catalogjs annotation start====
k5KVwqsuL2Rpc3QvNi5qcwPCwJXCrS4vZGlzdC8xNDEuanMGwsCBp2RlZmF1bHSUoWyudGFrZVJpZ2h0V2hpbGUNwJ+XoW8AAAPAkMCZoWQJAALAkQLAwpihaaxiYXNlSXRlcmF0ZWWSAgvAAKdkZWZhdWx0wMCYoXILDMDAkQHAwpyhaQAWAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmpYmFzZVdoaWxlkgUKwAGnZGVmYXVsdMDAmKFyCwnAwJEEwMKcoWkBGAQHkMDCAcLAwJehbwEACAyQwJmhZAAkCcCTCgsJwMKYoWyudGFrZVJpZ2h0V2hpbGWSCQ7AwMDA2U5XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvdGFrZVJpZ2h0V2hpbGUuanOYoXIJDsAKkQjAwpihcjYJwAuRBMDCmKFyCAzAwJEBwMKYoWcBAw3AkMDCmKFnCQsOwJEOwMKYoXIADsDAkQjAwg==
====catalogjs annotation end====*/