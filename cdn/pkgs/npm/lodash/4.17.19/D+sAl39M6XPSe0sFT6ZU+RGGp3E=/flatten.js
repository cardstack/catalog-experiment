import { default as baseFlatten } from "./dist/85.js";
function flatten(array) {
  var length = array == null ? 0 : array.length;
  return length ? baseFlatten(array, 1) : [];
}
export { flatten as default };
/*====catalogjs annotation start====
k5GVwqwuL2Rpc3QvODUuanMDwsCBp2RlZmF1bHSVoWynZmxhdHRlbgrAwJyXoW8AAAPAkMCZoWQJAAIEkQLAwpmhaatiYXNlRmxhdHRlbpICCMAAp2RlZmF1bHTAwMCYoXILC8DAkQHAwpyhaQABAQWRBMDCAMLAwJihZwgOwMCQwMKXoW8BAAYJkMCZoWQAEgfAkggHwMKZoWynZmxhdHRlbpIHC8DAwMCQ2UdXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvZmxhdHRlbi5qc5ihcgkHwAiRBsDCmKFyTQvAwJEBwMKYoWcBAwrAkMDCmKFnCQsLwJELwMKYoXIAB8DAkQbAwg==
====catalogjs annotation end====*/