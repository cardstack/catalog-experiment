import { default as Uint8Array0 } from "./92.js";
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array0(result).set(new Uint8Array0(arrayBuffer));
  return result;
}
export { cloneArrayBuffer as default };
/*====catalogjs annotation start====
k5GVwqcuLzkyLmpzA8LAgadkZWZhdWx0laFssGNsb25lQXJyYXlCdWZmZXILwMCdl6FvAAADwJDAmaFkCQACBJECwMKZoWmrVWludDhBcnJheTCTAggJwACnZGVmYXVsdMDAwJihcgsLwMCRAcDCnKFpAAEBBZEEwMIAwsDAmKFnCAnAwJDAwpehbwEABgqQwJmhZAAiB8CTCAkHwMKZoWywY2xvbmVBcnJheUJ1ZmZlcpIHDMDAwMCQ2VFXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Nsb25lQXJyYXlCdWZmZXIuanOYoXIJEMAIkQbAwpihcloLwAmRAcDCmKFyEQvAwJEBwMKYoWcBAwvAkMDCmKFnCQsMwJEMwMKYoXIAEMDAkQbAwg==
====catalogjs annotation end====*/