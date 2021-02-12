import { default as baseSlice } from "./142.js";
function castSlice(array, start, end) {
  var length = array.length;
  end = end === undefined ? length : end;
  return !start && end >= length ? array : baseSlice(array, start, end);
}
export { castSlice as default };
/*====catalogjs annotation start====
k5GVwqguLzE0Mi5qcwPCwIGnZGVmYXVsdJWhbKljYXN0U2xpY2UJwMCbl6FvAAADwJDAmaFkCQACwJECwMKZoWmpYmFzZVNsaWNlkgIHwACnZGVmYXVsdMDAwJihcgsJwMCRAcDCnKFpABMBBJDAwgDCwMCXoW8BAAUIkMCZoWQAFgbAkgcGwMKZoWypY2FzdFNsaWNlkgYKwMDAwJDZSlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fY2FzdFNsaWNlLmpzmKFyCQnAB5EFwMKYoXLMiAnAwJEBwMKYoWcBAwnAkMDCmKFnCQsKwJEKwMKYoXIACcDAkQXAwg==
====catalogjs annotation end====*/