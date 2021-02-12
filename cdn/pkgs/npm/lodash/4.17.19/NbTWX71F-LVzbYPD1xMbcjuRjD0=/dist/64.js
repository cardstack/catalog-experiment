import { default as MapCache } from "./65.js";
var HASH_UNDEFINED = '__lodash_hash_undefined__';
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);

  return this;
}
function setCacheHas(value) {
  return this.__data__.has(value);
}
function SetCache(values) {
  var index = -1,
      length = values == null ? 0 : values.length;
  this.__data__ = new MapCache();

  while (++index < length) {
    this.add(values[index]);
  }
}
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;
export { SetCache as default };
/*====catalogjs annotation start====
k5GVwqcuLzY1LmpzA8LAgadkZWZhdWx0laFsqFNldENhY2hlGcDA3AAbl6FvAAADwJESwJmhZAkAAsCRAsDCmaFpqE1hcENhY2hlkgIRwACnZGVmYXVsdMDAwJihcgsIwMCRAcDCnKFpABIBBJDAwgDCwMCXoW8BAAULkMCYoWcAAQYIkMDCmaFkBB4HwJIHBcDCmaFsrkhBU0hfVU5ERUZJTkVEkgcKwMDABZDZTFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fc2V0Q2FjaGVBZGQuanOYoXIADsDAkQbAwpmhZAEUCcCTCgkGwMKZoWyrc2V0Q2FjaGVBZGSSCRXAwMDAkNlMV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19zZXRDYWNoZUFkZC5qc5ihcgkLwAqRCMDCmKFyJQ7AwJEGwMKXoW8BAAwOkMCZoWQALg3AkQ3AwpmhbKtzZXRDYWNoZUhhc5INF8DAwMCQ2UxXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX3NldENhY2hlSGFzLmpzmKFyCQvAwJEMwMKXoW8BAA8YkMCZoWQARBASkhEQwMKZoWyoU2V0Q2FjaGWVEBMUFhrAwMDAkRLZSVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fU2V0Q2FjaGUuanOYoXIJCMARkQ/AwpihcmYIwMCRAcDCmKFnAQETwJUTFBUWF8DDmKFyAAjAFJEPwMKYoXIRCMAVkQ/AwpihchILwBaRCMDCmKFyAgjAF5EPwMKYoXIRC8DAkQzAwpihZwEDGcCQwMKYoWcJCxrAkRrAwpihcgAIwMCRD8DC
====catalogjs annotation end====*/