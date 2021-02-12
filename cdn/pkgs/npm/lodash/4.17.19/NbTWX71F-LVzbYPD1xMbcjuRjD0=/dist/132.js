import { default as overArg } from "./138.js";
import { default as isPrototype } from "./133.js";
var nativeKeys = overArg(Object.keys, Object);
var objectProto = Object.prototype;
var hasOwnProperty0 = objectProto.hasOwnProperty;
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }

  var result = [];

  for (var key in Object(object)) {
    if (hasOwnProperty0.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }

  return result;
}
export { baseKeys as default };
/*====catalogjs annotation start====
k5KVwqguLzEzOC5qcwPCwJXCqC4vMTMzLmpzBsLAgadkZWZhdWx0laFsqGJhc2VLZXlzG8DA3AAdl6FvAAADwJEJwJmhZAkAAsCRAsDCmaFpp292ZXJBcmeSAgzAAKdkZWZhdWx0wMDAmKFyCwfAwJEBwMKcoWkAEwEGkMDCAMLAwJmhZAkABcCRBcDCmaFpq2lzUHJvdG90eXBlkgUXwAGnZGVmYXVsdMDAwJihcgsLwMCRBMDCnKFpARMEB5DAwgHCwMCXoW8BAAgNkMCYoWcAAQnAkMDCmaFkBAAKwJMKCAvAwpmhbKpuYXRpdmVLZXlzkgoYwMDACJDZS1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fbmF0aXZlS2V5cy5qc5ihcgAKwAuRCcDCmKFnAxUMwJEMwMKYoXIAB8DAkQHAwpehbwEADhqQwJihZwABDxGQwMKZoWQEExDAkhAOwMKZoWyrb2JqZWN0UHJvdG+SEBTAwMAOkNlJV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlS2V5cy5qc5ihcgALwMCRD8DCmKFnAQESFZDAwpmhZAQPE8CUFBMRD8DCmaFsr2hhc093blByb3BlcnR5MJITGcDAwBGQ2UlXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VLZXlzLmpzmKFyAA/AFJESwMKYoXIDC8DAkQ/AwpmhZAFjFsCVFxgZFhLAwpmhbKhiYXNlS2V5c5IWHMDAwMCQ2UlXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VLZXlzLmpzmKFyCQjAF5EVwMKYoXISC8AYkQTAwpihchcKwBmRCcDCmKFyTw/AwJESwMKYoWcBAxvAkMDCmKFnCQscwJEcwMKYoXIACMDAkRXAwg==
====catalogjs annotation end====*/