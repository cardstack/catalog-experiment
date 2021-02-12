import { default as ListCache } from "./130.js";
import { default as Map0 } from "./66.js";
import { default as MapCache } from "./65.js";
function stackClear() {
  this.__data__ = new ListCache();
  this.size = 0;
}
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);
  this.size = data.size;
  return result;
}
function stackGet(key) {
  return this.__data__.get(key);
}
function stackHas(key) {
  return this.__data__.has(key);
}
var LARGE_ARRAY_SIZE = 200;
function stackSet(key, value) {
  var data = this.__data__;

  if (data instanceof ListCache) {
    var pairs = data.__data__;

    if (!Map0 || pairs.length < LARGE_ARRAY_SIZE - 1) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }

    data = this.__data__ = new MapCache(pairs);
  }

  data.set(key, value);
  this.size = data.size;
  return this;
}
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;
export { Stack as default };
/*====catalogjs annotation start====
k5OVwqguLzEzMC5qcwPCwJXCpy4vNjYuanMGwsCVwqcuLzY1LmpzCcLAgadkZWZhdWx0laFspVN0YWNrMcDA3AAzl6FvAAADwJElwJmhZAkAAsCRAsDCmaFpqUxpc3RDYWNoZZQCDR0kwACnZGVmYXVsdMDAwJihcgsJwMCRAcDCnKFpABMBBpDAwgDCwMCZoWQJAAXAkQXAwpmhaaRNYXAwkgUewAGnZGVmYXVsdMDAwJihcgsEwMCRBMDCnKFpARIECZDAwgHCwMCZoWQJAAjAkQjAwpmhaahNYXBDYWNoZZIIIMACp2RlZmF1bHTAwMCYoXILCMDAkQfAwpyhaQESBwqQwMICwsDAl6FvAQALDpDAmaFkABYMwJINDMDCmaFsqnN0YWNrQ2xlYXKSDCfAwMDAkNlLV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19zdGFja0NsZWFyLmpzmKFyCQrADZELwMKYoXIbCcDAkQHAwpehbwEADxGQwJmhZABzEMCREMDCmaFsq3N0YWNrRGVsZXRlkhApwMDAwJDZTFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fc3RhY2tEZWxldGUuanOYoXIJC8DAkQ/AwpehbwEAEhSQwJmhZAAqE8CRE8DCmaFsqHN0YWNrR2V0khMrwMDAwJDZSVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fc3RhY2tHZXQuanOYoXIJCMDAkRLAwpehbwEAFReQwJmhZAAqFsCRFsDCmaFsqHN0YWNrSGFzkhYtwMDAwJDZSVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fc3RhY2tIYXMuanOYoXIJCMDAkRXAwpehbwEAGCGQwJihZwABGRuQwMKZoWQEBhrAkhoYwMKZoWywTEFSR0VfQVJSQVlfU0laRZIaH8DAwBiQ2UlXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX3N0YWNrU2V0LmpzmKFyABDAwJEZwMKZoWQBTxzAlh0eHyAcGcDCmaFsqHN0YWNrU2V0khwvwMDAwJDZSVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fc3RhY2tTZXQuanOYoXIJCMAdkRvAwpihckIJwB6RAcDCmKFyLQTAH5EEwMKYoXITEMAgkRnAwpihcsyACMDAkQfAwpehbwEAIjCQwJmhZAAlIyWSJCPAwpmhbKVTdGFja5cjJigqLC4ywMDAwJEl2UZXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX1N0YWNrLmpzmKFyCQXAJJEiwMKYoXItCcDAkQHAwpihZwEBJsCaJicoKSorLC0uL8DDmKFyAAXAJ5EiwMKYoXITCsAokQvAwpihcgIFwCmRIsDCmKFyFwvAKpEPwMKYoXICBcArkSLAwpihchEIwCyREsDCmKFyAgXALZEiwMKYoXIRCMAukRXAwpihcgIFwC+RIsDCmKFyEQjAwJEbwMKYoWcBAzHAkMDCmKFnCQsywJEywMKYoXIABcDAkSLAwg==
====catalogjs annotation end====*/