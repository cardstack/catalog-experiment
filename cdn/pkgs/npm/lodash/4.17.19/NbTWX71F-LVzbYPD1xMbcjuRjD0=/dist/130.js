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
k5GVwqguLi9lcS5qcwPCwIGnZGVmYXVsdJWhbKlMaXN0Q2FjaGUywMDcADSXoW8AAAPAkSbAmaFkCQACwJECwMKZoWmiZXGSAgrAAKdkZWZhdWx0wMDAmKFyCwLAwJEBwMKcoWkAEwEEkMDCAMLAwJehbwEABQeQwJmhZAAtBsCRBsDCmaFsrmxpc3RDYWNoZUNsZWFykgYowMDAwJDZT1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fbGlzdENhY2hlQ2xlYXIuanOYoXIJDsDAkQXAwpehbwEACAuQwJmhZABJCcCSCgnAwpmhbKxhc3NvY0luZGV4T2aVCRUaHiLAwMDAkNlNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19hc3NvY0luZGV4T2YuanOYoXIJDMAKkQjAwpihckoCwMCRAcDCl6FvAQAMF5DAmKFnAAEND5DAwpmhZAQSDsCSDgzAwpmhbKphcnJheVByb3Rvkg4SwMDADJDZUFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fbGlzdENhY2hlRGVsZXRlLmpzmKFyAArAwJENwMKYoWcBARATkMDCmaFkBAcRwJQSEQ8NwMKZoWymc3BsaWNlkhEWwMDAD5DZUFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fbGlzdENhY2hlRGVsZXRlLmpzmKFyAAbAEpEQwMKYoXIDCsDAkQ3AwpmhZAE7FMCUFRYUEMDCmaFsr2xpc3RDYWNoZURlbGV0ZZIUKsDAwMCQ2VBXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2xpc3RDYWNoZURlbGV0ZS5qc5ihcgkPwBWRE8DCmKFyMgzAFpEIwMKYoXLMlwbAwJEQwMKXoW8BABgbkMCZoWQAPxnAkhoZwMKZoWysbGlzdENhY2hlR2V0khkswMDAwJDZTVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fbGlzdENhY2hlR2V0LmpzmKFyCQzAGpEYwMKYoXIyDMDAkQjAwpehbwEAHB+QwJmhZAAcHcCSHh3AwpmhbKxsaXN0Q2FjaGVIYXOSHS7AwMDAkNlNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19saXN0Q2FjaGVIYXMuanOYoXIJDMAekRzAwpihchEMwMCRCMDCl6FvAQAgI5DAmaFkAMyLIcCSIiHAwpmhbKxsaXN0Q2FjaGVTZXSSITDAwMDAkNlNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19saXN0Q2FjaGVTZXQuanOYoXIJDMAikSDAwpihcjkMwMCRCMDCl6FvAQAkMZDAmaFkAMzIJSaRJcDCmaFsqUxpc3RDYWNoZZclJykrLS8zwMDAwJEm2UpXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX0xpc3RDYWNoZS5qc5ihcgkJwMCRJMDCmKFnAQEnwJonKCkqKywtLi8wwMOYoXIACcAokSTAwpihchMOwCmRBcDCmKFyAgnAKpEkwMKYoXIXD8ArkRPAwpihcgIJwCyRJMDCmKFyEQzALZEYwMKYoXICCcAukSTAwpihchEMwC+RHMDCmKFyAgnAMJEkwMKYoXIRDMDAkSDAwpihZwEDMsCQwMKYoWcJCzPAkTPAwpihcgAJwMCRJMDC
====catalogjs annotation end====*/