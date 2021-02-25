import { default as defineProperty } from "./57.js";
function baseAssignValue(object, key, value) {
  if (key == '__proto__' && defineProperty) {
    defineProperty(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}
export { baseAssignValue as default };
/*====catalogjs annotation start====
k5GVwqcuLzU3LmpzA8LAgadkZWZhdWx0laFsr2Jhc2VBc3NpZ25WYWx1ZQvAwJ2XoW8AAAPAkMCZoWQJAAIEkQLAwpmhaa5kZWZpbmVQcm9wZXJ0eZMCCAnAAKdkZWZhdWx0wMDAmKFyCw7AwJEBwMKcoWkAAQEFkQTAwgDCwMCYoWcICcDAkMDCl6FvAQAGCpDAmaFkAMykB8CTCAkHwMKZoWyvYmFzZUFzc2lnblZhbHVlkgcMwMDAwJDZUFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZUFzc2lnblZhbHVlLmpzmKFyCQ/ACJEGwMKYoXIzDsAJkQHAwpihcggOwMCRAcDCmKFnAQMLwJDAwpihZwkLDMCRDMDCmKFyAA/AwJEGwMI=
====catalogjs annotation end====*/