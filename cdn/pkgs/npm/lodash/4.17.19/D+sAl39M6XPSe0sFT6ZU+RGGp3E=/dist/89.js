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
k5GVwqcuLzkzLmpzA8LAgadkZWZhdWx0laFsq2Nsb25lQnVmZmVyIcDA3AAjl6FvAAADwJDAmaFkCQACBJECwMKZoWmkcm9vdJICF8AAp2RlZmF1bHTAwMCYoXILBMDAkQHAwpyhaQABAQWRBMDCAMLAwJihZwgJwMCQwMKXoW8BAAYgkMCYoWcAAQcJkMDCmaFkBEgIwJIIBsDCmaFsq2ZyZWVFeHBvcnRzkwgMEsDAwAaQ2UxXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Nsb25lQnVmZmVyLmpzmKFyAAvAwJEHwMKYoWcBAQoNkMDCmaFkBEULwJQMCwkHwMKZoWyqZnJlZU1vZHVsZZMLEBHAwMAJkNlMV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19jbG9uZUJ1ZmZlci5qc5ihcgAKwAyRCsDCmKFyAwvAwJEHwMKYoWcBAQ4TkMDCmaFkBAAPwJcQERIPDQoHwMKZoWytbW9kdWxlRXhwb3J0c5IPFsDAwA2Q2UxXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Nsb25lQnVmZmVyLmpzmKFyAA3AEJEOwMKYoXIDCsARkQrAwpihcgQKwBKRCsDCmKFyDQvAwJEHwMKYoWcBARQckMDCmaFkBBMVGJUWFxUTDsDCmaFspkJ1ZmZlcpMVGhvAwMATkNlMV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19jbG9uZUJ1ZmZlci5qc5ihcgAGwBaRFMDCmKFyAw3AF5EOwMKYoXIDBMDAkQHAwpmhZAYYGcCVGhsZExTAwpmhbKthbGxvY1Vuc2FmZZMZHh/AwMATkNlMV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19jbG9uZUJ1ZmZlci5qc5ihcgALwBqRGMDCmKFyAwbAG5EUwMKYoXIDBsDAkRTAwpmhZAFUHcCUHh8dGMDCmaFsq2Nsb25lQnVmZmVykh0iwMDAwJDZTFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fY2xvbmVCdWZmZXIuanOYoXIJC8AekRzAwpihcnALwB+RGMDCmKFyAwvAwJEYwMKYoWcBAyHAkMDCmKFnCQsiwJEiwMKYoXIAC8DAkRzAwg==
====catalogjs annotation end====*/