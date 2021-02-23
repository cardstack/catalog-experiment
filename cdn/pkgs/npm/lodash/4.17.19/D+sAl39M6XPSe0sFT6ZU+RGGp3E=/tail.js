import { default as baseSlice } from "./dist/142.js";
function tail(array) {
  var length = array == null ? 0 : array.length;
  return length ? baseSlice(array, 1, length) : [];
}
export { tail as default };
/*====catalogjs annotation start====
k5GVwq0uL2Rpc3QvMTQyLmpzA8LAgadkZWZhdWx0laFspHRhaWwKwMCcl6FvAAADwJDAmaFkCQACBJECwMKZoWmpYmFzZVNsaWNlkgIIwACnZGVmYXVsdMDAwJihcgsJwMCRAcDCnKFpAAEBBZEEwMIAwsDAmKFnCA/AwJDAwpehbwEABgmQwJmhZAAaB8CSCAfAwpmhbKR0YWlskgcLwMDAwJDZRFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy90YWlsLmpzmKFyCQTACJEGwMKYoXJNCcDAkQHAwpihZwEDCsCQwMKYoWcJCwvAkQvAwpihcgAEwMCRBsDC
====catalogjs annotation end====*/