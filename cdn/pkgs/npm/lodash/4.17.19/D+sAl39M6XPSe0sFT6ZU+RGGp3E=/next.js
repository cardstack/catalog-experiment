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
k5GVwqwuL3RvQXJyYXkuanMDwsCBp2RlZmF1bHSVoWyrd3JhcHBlck5leHQKwMCcl6FvAAADwJDAmaFkCQACBJECwMKZoWmndG9BcnJheZICCMAAp2RlZmF1bHTAwMCYoXILB8DAkQHAwpyhaQABAQWRBMDCAMLAwJihZwgOwMCQwMKXoW8BAAYJkMCZoWQAzMYHwJIIB8DCmaFsq3dyYXBwZXJOZXh0kgcLwMDAwJDZRFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9uZXh0LmpzmKFyCQvACJEGwMKYoXJCB8DAkQHAwpihZwEDCsCQwMKYoWcJCwvAkQvAwpihcgALwMCRBsDC
====catalogjs annotation end====*/