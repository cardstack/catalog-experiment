import { default as baseGet } from "./dist/14.js";
function propertyOf(object) {
  return function (path) {
    return object == null ? undefined : baseGet(object, path);
  };
}
export { propertyOf as default };
/*====catalogjs annotation start====
k5GVwqwuL2Rpc3QvMTQuanMDwsCBp2RlZmF1bHSVoWyqcHJvcGVydHlPZgrAwJyXoW8AAAPAkMCZoWQJAAIEkQLAwpmhaadiYXNlR2V0kgIIwACnZGVmYXVsdMDAwJihcgsHwMCRAcDCnKFpAAEBBZEEwMIAwsDAmKFnCA7AwJDAwpehbwEABgmQwJmhZAAWB8CSCAfAwpmhbKpwcm9wZXJ0eU9mkgcLwMDAwJDZSlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9wcm9wZXJ0eU9mLmpzmKFyCQrACJEGwMKYoXJOB8DAkQHAwpihZwEDCsCQwMKYoWcJCwvAkQvAwpihcgAKwMCRBsDC
====catalogjs annotation end====*/