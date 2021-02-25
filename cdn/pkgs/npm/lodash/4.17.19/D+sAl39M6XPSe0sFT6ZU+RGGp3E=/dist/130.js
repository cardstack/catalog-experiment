import { default as eq } from "../eq.js";
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}
function assocIndexOf(array, key) {
  var length = array.length;

  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }

  return -1;
}
var arrayProto = Array.prototype;
var splice = arrayProto.splice;
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }

  var lastIndex = data.length - 1;

  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }

  --this.size;
  return true;
}
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);
  return index < 0 ? undefined : data[index][1];
}
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }

  return this;
}
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;
  this.clear();

  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;
export { ListCache as default };
/*====catalogjs annotation start====
k5GVwqguLi9lcS5qcwPCwIGnZGVmYXVsdJWhbKlMaXN0Q2FjaGUzwMDcADWXoW8AAAPAkSfAmaFkCQACBJECwMKZoWmiZXGSAgvAAKdkZWZhdWx0wMDAmKFyCwLAwJEBwMKcoWkAAQEFkQTAwgDCwMCYoWcICsDAkMDCl6FvAQAGCJDAmaFkAC0HwJEHwMKZoWyubGlzdENhY2hlQ2xlYXKSBynAwMDAkNlPV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19saXN0Q2FjaGVDbGVhci5qc5ihcgkOwMCRBsDCl6FvAQAJDJDAmaFkAEkKwJILCsDCmaFsrGFzc29jSW5kZXhPZpUKFhsfI8DAwMCQ2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Fzc29jSW5kZXhPZi5qc5ihcgkMwAuRCcDCmKFySgLAwJEBwMKXoW8BAA0YkMCYoWcAAQ4QkMDCmaFkBBIPwJIPDcDCmaFsqmFycmF5UHJvdG+SDxPAwMANkNlQV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19saXN0Q2FjaGVEZWxldGUuanOYoXIACsDAkQ7AwpihZwEBERSQwMKZoWQEBxLAlBMSEA7AwpmhbKZzcGxpY2WSEhfAwMAQkNlQV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19saXN0Q2FjaGVEZWxldGUuanOYoXIABsATkRHAwpihcgMKwMCRDsDCmaFkATsVwJQWFxURwMKZoWyvbGlzdENhY2hlRGVsZXRlkhUrwMDAwJDZUFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fbGlzdENhY2hlRGVsZXRlLmpzmKFyCQ/AFpEUwMKYoXIyDMAXkQnAwpihcsyXBsDAkRHAwpehbwEAGRyQwJmhZAA/GsCSGxrAwpmhbKxsaXN0Q2FjaGVHZXSSGi3AwMDAkNlNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19saXN0Q2FjaGVHZXQuanOYoXIJDMAbkRnAwpihcjIMwMCRCcDCl6FvAQAdIJDAmaFkABwewJIfHsDCmaFsrGxpc3RDYWNoZUhhc5IeL8DAwMCQ2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2xpc3RDYWNoZUhhcy5qc5ihcgkMwB+RHcDCmKFyEQzAwJEJwMKXoW8BACEkkMCZoWQAzIsiwJIjIsDCmaFsrGxpc3RDYWNoZVNldJIiMcDAwMCQ2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2xpc3RDYWNoZVNldC5qc5ihcgkMwCORIcDCmKFyOQzAwJEJwMKXoW8BACUykMCZoWQAzMgmJ5EmwMKZoWypTGlzdENhY2hllyYoKiwuMDTAwMDAkSfZSlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fTGlzdENhY2hlLmpzmKFyCQnAwJElwMKYoWcBASjAmigpKissLS4vMDHAw5ihcgAJwCmRJcDCmKFyEw7AKpEGwMKYoXICCcArkSXAwpihchcPwCyRFMDCmKFyAgnALZElwMKYoXIRDMAukRnAwpihcgIJwC+RJcDCmKFyEQzAMJEdwMKYoXICCcAxkSXAwpihchEMwMCRIcDCmKFnAQMzwJDAwpihZwkLNMCRNMDCmKFyAAnAwJElwMI=
====catalogjs annotation end====*/