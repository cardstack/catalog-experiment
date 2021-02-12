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
k5OVwqcuLzY4LmpzA8LAlcKoLi8xMzAuanMGwsCVwqcuLzY2LmpzCcLAgadkZWZhdWx0laFsqE1hcENhY2hld8DA3AB5l6FvAAADwJMMP2vAmaFkCQACwJECwMKZoWmpZ2V0TmF0aXZlkgIPwACnZGVmYXVsdMDAwJihcgsJwMCRAcDCnKFpABIBBpDAwgDCwMCZoWQJAAXAkQXAwpmhaalMaXN0Q2FjaGWSBU/AAadkZWZhdWx0wMDAmKFyCwnAwJEEwMKcoWkBEwQJkMDCAcLAwJmhZAkACMCRCMDCmaFppE1hcDCSCE7AAqdkZWZhdWx0wMDAmKFyCwTAwJEHwMKcoWkBEgcKkMDCAsLAwJehbwEACxCQwJihZwABDMCQwMKZoWQEAA3Akw0LDsDCmaFsrG5hdGl2ZUNyZWF0ZZYNExQlMjrAwMALkNlNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19uYXRpdmVDcmVhdGUuanOYoXIADMAOkQzAwpihZwMSD8CRD8DCmKFyAAnAwJEBwMKXoW8BABEVkMCZoWQAHxLAkxMUEsDCmaFsqWhhc2hDbGVhcpISQcDAwMCQ2UpXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2hhc2hDbGVhci5qc5ihcgkJwBOREcDCmKFyFwzAFJEMwMKYoXIDDMDAkQzAwpehbwEAFhiQwJmhZAB0F8CRF8DCmaFsqmhhc2hEZWxldGWSF0PAwMDAkNlLV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19oYXNoRGVsZXRlLmpzmKFyCQrAwJEWwMKXoW8BABkokMCYoWcAARockMDCmaFkBB4bwJIbGcDCmaFsr0hBU0hfVU5ERUZJTkVEMJIbJsDAwBmQ2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2hhc2hHZXQuanOYoXIAD8DAkRrAwpihZwEBHR+QwMKZoWQEEx7Akh4cwMKZoWysb2JqZWN0UHJvdG8wkh4iwMDAHJDZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9faGFzaEdldC5qc5ihcgAMwMCRHcDCmKFnAQEgI5DAwpmhZAQPIcCUIiEfHcDCmaFsr2hhc093blByb3BlcnR5MZIhJ8DAwB+Q2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2hhc2hHZXQuanOYoXIAD8AikSDAwpihcgMMwMCRHcDCmaFkASskwJYlJickGiDAwpmhbKdoYXNoR2V0kiRFwMDAwJDZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9faGFzaEdldC5qc5ihcgkHwCWRI8DCmKFyKwzAJpEMwMKYoXI2D8AnkRrAwpihciUPwMCRIMDCl6FvAQApNJDAmKFnAAEqLJDAwpmhZAQTK8CSKynAwpmhbKtvYmplY3RQcm90b5IrL8DAwCmQ2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2hhc2hIYXMuanOYoXIAC8DAkSrAwpihZwEBLTCQwMKZoWQEDy7AlC8uLCrAwpmhbK9oYXNPd25Qcm9wZXJ0eTCSLjPAwMAskNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19oYXNoSGFzLmpzmKFyAA/AL5EtwMKYoXIDC8DAkSrAwpmhZAETMcCUMjMxLcDCmaFsp2hhc2hIYXOSMUfAwMDAkNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19oYXNoSGFzLmpzmKFyCQfAMpEwwMKYoXItDMAzkQzAwpihch0PwMCRLcDCl6FvAQA1PJDAmKFnAAE2OJDAwpmhZAQeN8CSNzXAwpmhbK5IQVNIX1VOREVGSU5FRJI3O8DAwDWQ2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2hhc2hTZXQuanOYoXIADsDAkTbAwpmhZAEaOcCUOjs5NsDCmaFsp2hhc2hTZXSSOUnAwMDAkNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19oYXNoU2V0LmpzmKFyCQfAOpE4wMKYoXJfDMA7kQzAwpihchoOwMCRNsDCl6FvAQA9SpDAmaFkAMzIPj+RPsDCmaFspEhhc2iYPkBCREZITVDAwMDAkT/ZRVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fSGFzaC5qc5ihcgkEwMCRPcDCmKFnAQFAwJpAQUJDREVGR0hJwMOYoXIABMBBkT3AwpihchMJwEKREcDCmKFyAgTAQ5E9wMKYoXIXCsBEkRbAwpihcgIEwEWRPcDCmKFyEQfARpEjwMKYoXICBMBHkT3AwpihchEHwEiRMMDCmKFyAgTASZE9wMKYoXIRB8DAkTjAwpehbwEAS1GQwJmhZAAJTMCVTU5PUEzAwpmhbK1tYXBDYWNoZUNsZWFykkxtwMDAwJDZTlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fbWFwQ2FjaGVDbGVhci5qc5ihcgkNwE2RS8DCmKFyOgTATpE9wMKYoXIUBMBPkQfAwpihcgQJwFCRBMDCmKFyFwTAwJE9wMKXoW8BAFJUkMCZoWQAzKdTwJFTwMKZoWypaXNLZXlhYmxlklNXwMDAwJDZSlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9faXNLZXlhYmxlLmpzmKFyCQnAwJFSwMKXoW8BAFVYkMCZoWQARlbAkldWwMKZoWyqZ2V0TWFwRGF0YZVWW19jZ8DAwMCQ2UtXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2dldE1hcERhdGEuanOYoXIJCsBXkVXAwpihcjEJwMCRUsDCl6FvAQBZXJDAmaFkAE1awJJbWsDCmaFsrm1hcENhY2hlRGVsZXRlklpvwMDAwJDZT1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fbWFwQ2FjaGVEZWxldGUuanOYoXIJDsBbkVnAwpihchcKwMCRVcDCl6FvAQBdYJDAmaFkABdewJJfXsDCmaFsq21hcENhY2hlR2V0kl5xwMDAwJDZTFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fbWFwQ2FjaGVHZXQuanOYoXIJC8BfkV3AwpihchEKwMCRVcDCl6FvAQBhZJDAmaFkABdiwJJjYsDCmaFsq21hcENhY2hlSGFzkmJzwMDAwJDZTFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fbWFwQ2FjaGVIYXMuanOYoXIJC8BjkWHAwpihchEKwMCRVcDCl6FvAQBlaJDAmaFkAHdmwJJnZsDCmaFsq21hcENhY2hlU2V0kmZ1wMDAwJDZTFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fbWFwQ2FjaGVTZXQuanOYoXIJC8BnkWXAwpihchwKwMCRVcDCl6FvAQBpdpDAmaFkAMzIamuRasDCmaFsqE1hcENhY2hll2psbnBydHjAwMDAkWvZSVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fTWFwQ2FjaGUuanOYoXIJCMDAkWnAwpihZwEBbMCabG1ub3BxcnN0dcDDmKFyAAjAbZFpwMKYoXITDcBukUvAwpihcgIIwG+RacDCmKFyFw7AcJFZwMKYoXICCMBxkWnAwpihchELwHKRXcDCmKFyAgjAc5FpwMKYoXIRC8B0kWHAwpihcgIIwHWRacDCmKFyEQvAwJFlwMKYoWcBA3fAkMDCmKFnCQt4wJF4wMKYoXIACMDAkWnAwg==
====catalogjs annotation end====*/