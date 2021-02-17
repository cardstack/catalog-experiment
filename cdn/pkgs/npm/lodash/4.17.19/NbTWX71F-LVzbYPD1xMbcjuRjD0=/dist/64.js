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
k5GVwqcuLzY1LmpzA8LAgadkZWZhdWx0laFsqFNldENhY2hlGsDA3AAcl6FvAAADwJETwJmhZAkAAgSRAsDCmaFpqE1hcENhY2hlkgISwACnZGVmYXVsdMDAwJihcgsIwMCRAcDCnKFpAAEBBZEEwMIAwsDAmKFnCAnAwJDAwpehbwEABgyQwJihZwABBwmQwMKZoWQEHgjAkggGwMKZoWyuSEFTSF9VTkRFRklORUSSCAvAwMAGkNlMV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19zZXRDYWNoZUFkZC5qc5ihcgAOwMCRB8DCmaFkARQKwJMLCgfAwpmhbKtzZXRDYWNoZUFkZJIKFsDAwMCQ2UxXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX3NldENhY2hlQWRkLmpzmKFyCQvAC5EJwMKYoXIlDsDAkQfAwpehbwEADQ+QwJmhZAAuDsCRDsDCmaFsq3NldENhY2hlSGFzkg4YwMDAwJDZTFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fc2V0Q2FjaGVIYXMuanOYoXIJC8DAkQ3AwpehbwEAEBmQwJmhZABEEROSEhHAwpmhbKhTZXRDYWNoZZURFBUXG8DAwMCRE9lJV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19TZXRDYWNoZS5qc5ihcgkIwBKREMDCmKFyZgjAwJEBwMKYoWcBARTAlRQVFhcYwMOYoXIACMAVkRDAwpihchEIwBaREMDCmKFyEgvAF5EJwMKYoXICCMAYkRDAwpihchELwMCRDcDCmKFnAQMawJDAwpihZwkLG8CRG8DCmKFyAAjAwJEQwMI=
====catalogjs annotation end====*/