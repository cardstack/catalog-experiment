import { default as getNative } from "./68.js";
import { default as ListCache } from "./130.js";
import { default as Map0 } from "./66.js";
var nativeCreate = getNative(Object, 'create');
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}
var HASH_UNDEFINED0 = '__lodash_hash_undefined__';
var objectProto0 = Object.prototype;
var hasOwnProperty1 = objectProto0.hasOwnProperty;
function hashGet(key) {
  var data = this.__data__;

  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED0 ? undefined : result;
  }

  return hasOwnProperty1.call(data, key) ? data[key] : undefined;
}
var objectProto = Object.prototype;
var hasOwnProperty0 = objectProto.hasOwnProperty;
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty0.call(data, key);
}
var HASH_UNDEFINED = '__lodash_hash_undefined__';
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = nativeCreate && value === undefined ? HASH_UNDEFINED : value;
  return this;
}
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;
  this.clear();

  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash(),
    'map': new (Map0 || ListCache)(),
    'string': new Hash()
  };
}
function isKeyable(value) {
  var type = typeof value;
  return type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean' ? value !== '__proto__' : value === null;
}
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key) ? data[typeof key == 'string' ? 'string' : 'hash'] : data.map;
}
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;
  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;
  this.clear();

  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;
export { MapCache as default };
/*====catalogjs annotation start====
k5OVwqcuLzY4LmpzA8LAlcKoLi8xMzAuanMHwsCVwqcuLzY2LmpzC8LAgadkZWZhdWx0laFsqE1hcENhY2hlesDA3AB8l6FvAAADwJMPQm7AmaFkCQACBJECwMKZoWmpZ2V0TmF0aXZlkgISwACnZGVmYXVsdMDAwJihcgsJwMCRAcDCnKFpAAEBB5EEwMIAwsDAmKFnCAnAwJDAwpmhZAkABgiRBsDCmaFpqUxpc3RDYWNoZZIGUsABp2RlZmF1bHTAwMCYoXILCcDAkQXAwpyhaQEBBQuRCMDCAcLAwJihZwgKwMCQwMKZoWQJAAoMkQrAwpmhaaRNYXAwkgpRwAKnZGVmYXVsdMDAwJihcgsEwMCRCcDCnKFpAQEJDZEMwMICwsDAmKFnCAnAwJDAwpehbwEADhOQwJihZwABD8CQwMKZoWQEABDAkxAOEcDCmaFsrG5hdGl2ZUNyZWF0ZZYQFhcoNT3AwMAOkNlNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19uYXRpdmVDcmVhdGUuanOYoXIADMARkQ/AwpihZwMSEsCREsDCmKFyAAnAwJEBwMKXoW8BABQYkMCZoWQAHxXAkxYXFcDCmaFsqWhhc2hDbGVhcpIVRMDAwMCQ2UpXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2hhc2hDbGVhci5qc5ihcgkJwBaRFMDCmKFyFwzAF5EPwMKYoXIDDMDAkQ/AwpehbwEAGRuQwJmhZAB0GsCRGsDCmaFsqmhhc2hEZWxldGWSGkbAwMDAkNlLV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19oYXNoRGVsZXRlLmpzmKFyCQrAwJEZwMKXoW8BABwrkMCYoWcAAR0fkMDCmaFkBB4ewJIeHMDCmaFsr0hBU0hfVU5ERUZJTkVEMJIeKcDAwByQ2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2hhc2hHZXQuanOYoXIAD8DAkR3AwpihZwEBICKQwMKZoWQEEyHAkiEfwMKZoWysb2JqZWN0UHJvdG8wkiElwMDAH5DZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9faGFzaEdldC5qc5ihcgAMwMCRIMDCmKFnAQEjJpDAwpmhZAQPJMCUJSQiIMDCmaFsr2hhc093blByb3BlcnR5MZIkKsDAwCKQ2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2hhc2hHZXQuanOYoXIAD8AlkSPAwpihcgMMwMCRIMDCmaFkASsnwJYoKSonHSPAwpmhbKdoYXNoR2V0kidIwMDAwJDZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9faGFzaEdldC5qc5ihcgkHwCiRJsDCmKFyKwzAKZEPwMKYoXI2D8AqkR3AwpihciUPwMCRI8DCl6FvAQAsN5DAmKFnAAEtL5DAwpmhZAQTLsCSLizAwpmhbKtvYmplY3RQcm90b5IuMsDAwCyQ2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2hhc2hIYXMuanOYoXIAC8DAkS3AwpihZwEBMDOQwMKZoWQEDzHAlDIxLy3AwpmhbK9oYXNPd25Qcm9wZXJ0eTCSMTbAwMAvkNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19oYXNoSGFzLmpzmKFyAA/AMpEwwMKYoXIDC8DAkS3AwpmhZAETNMCUNTY0MMDCmaFsp2hhc2hIYXOSNErAwMDAkNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19oYXNoSGFzLmpzmKFyCQfANZEzwMKYoXItDMA2kQ/Awpihch0PwMCRMMDCl6FvAQA4P5DAmKFnAAE5O5DAwpmhZAQeOsCSOjjAwpmhbK5IQVNIX1VOREVGSU5FRJI6PsDAwDiQ2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2hhc2hTZXQuanOYoXIADsDAkTnAwpmhZAEaPMCUPT48OcDCmaFsp2hhc2hTZXSSPEzAwMDAkNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19oYXNoU2V0LmpzmKFyCQfAPZE7wMKYoXJfDMA+kQ/AwpihchoOwMCROcDCl6FvAQBATZDAmaFkAMzIQUKRQcDCmaFspEhhc2iYQUNFR0lLUFPAwMDAkULZRVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fSGFzaC5qc5ihcgkEwMCRQMDCmKFnAQFDwJpDREVGR0hJSktMwMOYoXIABMBEkUDAwpihchMJwEWRFMDCmKFyAgTARpFAwMKYoXIXCsBHkRnAwpihcgIEwEiRQMDCmKFyEQfASZEmwMKYoXICBMBKkUDAwpihchEHwEuRM8DCmKFyAgTATJFAwMKYoXIRB8DAkTvAwpehbwEATlSQwJmhZAAJT8CVUFFSU0/AwpmhbK1tYXBDYWNoZUNsZWFykk9wwMDAwJDZTlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fbWFwQ2FjaGVDbGVhci5qc5ihcgkNwFCRTsDCmKFyOgTAUZFAwMKYoXIUBMBSkQnAwpihcgQJwFORBcDCmKFyFwTAwJFAwMKXoW8BAFVXkMCZoWQAzKdWwJFWwMKZoWypaXNLZXlhYmxlklZawMDAwJDZSlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9faXNLZXlhYmxlLmpzmKFyCQnAwJFVwMKXoW8BAFhbkMCZoWQARlnAklpZwMKZoWyqZ2V0TWFwRGF0YZVZXmJmasDAwMCQ2UtXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2dldE1hcERhdGEuanOYoXIJCsBakVjAwpihcjEJwMCRVcDCl6FvAQBcX5DAmaFkAE1dwJJeXcDCmaFsrm1hcENhY2hlRGVsZXRlkl1ywMDAwJDZT1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fbWFwQ2FjaGVEZWxldGUuanOYoXIJDsBekVzAwpihchcKwMCRWMDCl6FvAQBgY5DAmaFkABdhwJJiYcDCmaFsq21hcENhY2hlR2V0kmF0wMDAwJDZTFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fbWFwQ2FjaGVHZXQuanOYoXIJC8BikWDAwpihchEKwMCRWMDCl6FvAQBkZ5DAmaFkABdlwJJmZcDCmaFsq21hcENhY2hlSGFzkmV2wMDAwJDZTFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fbWFwQ2FjaGVIYXMuanOYoXIJC8BmkWTAwpihchEKwMCRWMDCl6FvAQBoa5DAmaFkAHdpwJJqacDCmaFsq21hcENhY2hlU2V0kml4wMDAwJDZTFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fbWFwQ2FjaGVTZXQuanOYoXIJC8BqkWjAwpihchwKwMCRWMDCl6FvAQBseZDAmaFkAMzIbW6RbcDCmaFsqE1hcENhY2hll21vcXN1d3vAwMDAkW7ZSVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fTWFwQ2FjaGUuanOYoXIJCMDAkWzAwpihZwEBb8Cab3BxcnN0dXZ3eMDDmKFyAAjAcJFswMKYoXITDcBxkU7AwpihcgIIwHKRbMDCmKFyFw7Ac5FcwMKYoXICCMB0kWzAwpihchELwHWRYMDCmKFyAgjAdpFswMKYoXIRC8B3kWTAwpihcgIIwHiRbMDCmKFyEQvAwJFowMKYoWcBA3rAkMDCmKFnCQt7wJF7wMKYoXIACMDAkWzAwg==
====catalogjs annotation end====*/