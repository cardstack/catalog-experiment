import { default as castPath } from "./dist/17.js";
import { default as isFunction } from "./isFunction.js";
import { default as toKey } from "./dist/27.js";
function result(object, path, defaultValue) {
  path = castPath(path, object);
  var index = -1,
      length = path.length;

  if (!length) {
    length = 1;
    object = undefined;
  }

  while (++index < length) {
    var value = object == null ? undefined : object[toKey(path[index])];

    if (value === undefined) {
      index = length;
      value = defaultValue;
    }

    object = isFunction(value) ? value.call(object) : value;
  }

  return object;
}
export { result as default };
/*====catalogjs annotation start====
k5OVwqwuL2Rpc3QvMTcuanMDwsCVwq8uL2lzRnVuY3Rpb24uanMHwsCVwqwuL2Rpc3QvMjcuanMLwsCBp2RlZmF1bHSVoWymcmVzdWx0FMDA3AAWl6FvAAADwJDAmaFkCQACBJECwMKZoWmoY2FzdFBhdGiSAhDAAKdkZWZhdWx0wMDAmKFyCwjAwJEBwMKcoWkAAQEHkQTAwgDCwMCYoWcIDsDAkMDCmaFkCQAGCJEGwMKZoWmqaXNGdW5jdGlvbpIGEsABp2RlZmF1bHTAwMCYoXILCsDAkQXAwpyhaQEBBQuRCMDCAcLAwJihZwgRwMCQwMKZoWQJAAoMkQrAwpmhaaV0b0tleZIKEcACp2RlZmF1bHTAwMCYoXILBcDAkQnAwpyhaQEBCQ2RDMDCAsLAwJihZwgOwMCQwMKXoW8BAA4TkMCZoWQAPQ/AlBAREg/AwpmhbKZyZXN1bHSSDxXAwMDAkNlGV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3Jlc3VsdC5qc5ihcgkGwBCRDsDCmKFyKAjAEZEBwMKYoXLMzgXAEpEJwMKYoXJ2CsDAkQXAwpihZwEDFMCQwMKYoWcJCxXAkRXAwpihcgAGwMCRDsDC
====catalogjs annotation end====*/