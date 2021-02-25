import { default as before } from "./before.js";
function once(func) {
  return before(2, func);
}
export { once as default };
/*====catalogjs annotation start====
k5GVwqsuL2JlZm9yZS5qcwPCwIGnZGVmYXVsdJWhbKRvbmNlCsDAnJehbwAAA8CQwJmhZAkAAgSRAsDCmaFppmJlZm9yZZICCMAAp2RlZmF1bHTAwMCYoXILBsDAkQHAwpyhaQABAQWRBMDCAMLAwJihZwgNwMCQwMKXoW8BAAYJkMCZoWQADAfAkggHwMKZoWykb25jZZIHC8DAwMCQ2URXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvb25jZS5qc5ihcgkEwAiRBsDCmKFyEgbAwJEBwMKYoWcBAwrAkMDCmKFnCQsLwJELwMKYoXIABMDAkQbAwg==
====catalogjs annotation end====*/