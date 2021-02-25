import { default as baseSet } from "./dist/16.js";
function setWith(object, path, value, customizer) {
  customizer = typeof customizer == 'function' ? customizer : undefined;
  return object == null ? object : baseSet(object, path, value, customizer);
}
export { setWith as default };
/*====catalogjs annotation start====
k5GVwqwuL2Rpc3QvMTYuanMDwsCBp2RlZmF1bHSVoWync2V0V2l0aArAwJyXoW8AAAPAkMCZoWQJAAIEkQLAwpmhaadiYXNlU2V0kgIIwACnZGVmYXVsdMDAwJihcgsHwMCRAcDCnKFpAAEBBZEEwMIAwsDAmKFnCA7AwJDAwpehbwEABgmQwJmhZAAkB8CSCAfAwpmhbKdzZXRXaXRokgcLwMDAwJDZR1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9zZXRXaXRoLmpzmKFyCQfACJEGwMKYoXLMkAfAwJEBwMKYoWcBAwrAkMDCmKFnCQsLwJELwMKYoXIAB8DAkQbAwg==
====catalogjs annotation end====*/