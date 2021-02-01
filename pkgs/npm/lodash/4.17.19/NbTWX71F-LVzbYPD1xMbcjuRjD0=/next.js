import { default as toArray } from "./toArray.js";
function wrapperNext() {
  if (this.__values__ === undefined) {
    this.__values__ = toArray(this.value());
  }

  var done = this.__index__ >= this.__values__.length,
      value = done ? undefined : this.__values__[this.__index__++];
  return {
    'done': done,
    'value': value
  };
}
export { wrapperNext as default };
/*====catalogjs annotation start====
k5GVwqwuL3RvQXJyYXkuanMDwsCBp2RlZmF1bHSUoWyrd3JhcHBlck5leHQJwJuXoW8AAAPAkMCZoWQJAALAkQLAwpihaad0b0FycmF5kgIHwACnZGVmYXVsdMDAmKFyCwfAwJEBwMKcoWkAFwEEkMDCAMLAwJehbwEABQiQwJmhZADMxgbAkgcGwMKYoWyrd3JhcHBlck5leHSSBgrAwMDA2URXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvbmV4dC5qc5ihcgkLwAeRBcDCmKFyQgfAwJEBwMKYoWcBAwnAkMDCmKFnCQsKwJEKwMKYoXIAC8DAkQXAwg==
====catalogjs annotation end====*/