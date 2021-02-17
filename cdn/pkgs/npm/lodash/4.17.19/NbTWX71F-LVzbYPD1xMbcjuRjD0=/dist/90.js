import { default as cloneArrayBuffer } from "./91.js";
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}
export { cloneTypedArray as default };
/*====catalogjs annotation start====
k5GVwqcuLzkxLmpzA8LAgadkZWZhdWx0laFsr2Nsb25lVHlwZWRBcnJheQrAwJyXoW8AAAPAkMCZoWQJAAIEkQLAwpmhabBjbG9uZUFycmF5QnVmZmVykgIIwACnZGVmYXVsdMDAwJihcgsQwMCRAcDCnKFpAAEBBZEEwMIAwsDAmKFnCAnAwJDAwpehbwEABgmQwJmhZADMgQfAkggHwMKZoWyvY2xvbmVUeXBlZEFycmF5kgcLwMDAwJDZUFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fY2xvbmVUeXBlZEFycmF5LmpzmKFyCQ/ACJEGwMKYoXIvEMDAkQHAwpihZwEDCsCQwMKYoWcJCwvAkQvAwpihcgAPwMCRBsDC
====catalogjs annotation end====*/