import { default as createWrap } from "./dist/23.js";
var WRAP_ARY_FLAG = 128;
function ary(func, n, guard) {
  n = guard ? undefined : n;
  n = func && n == null ? func.length : n;
  return createWrap(func, WRAP_ARY_FLAG, undefined, undefined, undefined, undefined, n);
}
export { ary as default };
/*====catalogjs annotation start====
k5GVwqwuL2Rpc3QvMjMuanMDwsCBp2RlZmF1bHSUoWyjYXJ5DcCfl6FvAAADwJDAmaFkCQACwJECwMKYoWmqY3JlYXRlV3JhcJICCsAAp2RlZmF1bHTAwJihcgsKwMCRAcDCnKFpABcBBJDAwgDCwMCXoW8BAAUMkMCYoWcAAQYIkMDCmaFkBAYHwJIHBcDCmKFsrVdSQVBfQVJZX0ZMQUeSBwvAwMAF2UNXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvYXJ5LmpzmKFyAA3AwJEGwMKZoWQBMwnAlAoLCQbAwpihbKNhcnmSCQ7AwMDA2UNXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvYXJ5LmpzmKFyCQPACpEIwMKYoXJkCsALkQHAwpihcgcNwMCRBsDCmKFnAQMNwJDAwpihZwkLDsCRDsDCmKFyAAPAwJEIwMI=
====catalogjs annotation end====*/