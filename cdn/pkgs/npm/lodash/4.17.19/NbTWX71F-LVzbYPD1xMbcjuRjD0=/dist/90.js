import { default as cloneArrayBuffer } from "./91.js";
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}
export { cloneTypedArray as default };
/*====catalogjs annotation start====
k5GVwqcuLzkxLmpzA8LAgadkZWZhdWx0laFsr2Nsb25lVHlwZWRBcnJheQnAwJuXoW8AAAPAkMCZoWQJAALAkQLAwpmhabBjbG9uZUFycmF5QnVmZmVykgIHwACnZGVmYXVsdMDAwJihcgsQwMCRAcDCnKFpABIBBJDAwgDCwMCXoW8BAAUIkMCZoWQAzIEGwJIHBsDCmaFsr2Nsb25lVHlwZWRBcnJheZIGCsDAwMCQ2VBXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Nsb25lVHlwZWRBcnJheS5qc5ihcgkPwAeRBcDCmKFyLxDAwJEBwMKYoWcBAwnAkMDCmKFnCQsKwJEKwMKYoXIAD8DAkQXAwg==
====catalogjs annotation end====*/