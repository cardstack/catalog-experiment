import { default as root } from "./93.js";
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;
var moduleExports = freeModule && freeModule.exports === freeExports;
var Buffer = moduleExports ? root.Buffer : undefined,
    allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }

  var length = buffer.length,
      result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
  buffer.copy(result);
  return result;
}
export { cloneBuffer as default };
/*====catalogjs annotation start====
k5GVwqcuLzkzLmpzA8LAgadkZWZhdWx0laFsq2Nsb25lQnVmZmVyIMDA3AAil6FvAAADwJDAmaFkCQACwJECwMKZoWmkcm9vdJICFsAAp2RlZmF1bHTAwMCYoXILBMDAkQHAwpyhaQASAQSQwMIAwsDAl6FvAQAFH5DAmKFnAAEGCJDAwpmhZARIB8CSBwXAwpmhbKtmcmVlRXhwb3J0c5MHCxHAwMAFkNlMV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19jbG9uZUJ1ZmZlci5qc5ihcgALwMCRBsDCmKFnAQEJDJDAwpmhZARFCsCUCwoIBsDCmaFsqmZyZWVNb2R1bGWTCg8QwMDACJDZTFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fY2xvbmVCdWZmZXIuanOYoXIACsALkQnAwpihcgMLwMCRBsDCmKFnAQENEpDAwpmhZAQADsCXDxARDgwJBsDCmaFsrW1vZHVsZUV4cG9ydHOSDhXAwMAMkNlMV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19jbG9uZUJ1ZmZlci5qc5ihcgANwA+RDcDCmKFyAwrAEJEJwMKYoXIECsARkQnAwpihcg0LwMCRBsDCmKFnAQETG5DAwpmhZAQTFBeVFRYUEg3AwpmhbKZCdWZmZXKTFBkawMDAEpDZTFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fY2xvbmVCdWZmZXIuanOYoXIABsAVkRPAwpihcgMNwBaRDcDCmKFyAwTAwJEBwMKZoWQGGBjAlRkaGBITwMKZoWyrYWxsb2NVbnNhZmWTGB0ewMDAEpDZTFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fY2xvbmVCdWZmZXIuanOYoXIAC8AZkRfAwpihcgMGwBqRE8DCmKFyAwbAwJETwMKZoWQBVBzAlB0eHBfAwpmhbKtjbG9uZUJ1ZmZlcpIcIcDAwMCQ2UxXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Nsb25lQnVmZmVyLmpzmKFyCQvAHZEbwMKYoXJwC8AekRfAwpihcgMLwMCRF8DCmKFnAQMgwJDAwpihZwkLIcCRIcDCmKFyAAvAwJEbwMI=
====catalogjs annotation end====*/