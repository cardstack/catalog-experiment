import { default as getNative } from "./68.js";
var defineProperty = function () {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}();
export { defineProperty as default };
/*====catalogjs annotation start====
k5GVwqcuLzY4LmpzA8LAgadkZWZhdWx0laFsrmRlZmluZVByb3BlcnR5C8DAnZehbwAAA8CRBsCZoWQJAALAkQLAwpmhaalnZXROYXRpdmWSAgnAAKdkZWZhdWx0wMDAmKFyCwnAwJEBwMKcoWkAEgEEkMDCAMLAwJehbwEABQqQwJihZwABBsCQwMKZoWQEAAfAkwcFCMDCmaFsrmRlZmluZVByb3BlcnR5kgcMwMDABZDZT1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fZGVmaW5lUHJvcGVydHkuanOYoXIADsAIkQbAwpihZwNXCcCRCcDCmKFyJQnAwJEBwMKYoWcBAwvAkMDCmKFnCQsMwJEMwMKYoXIADsDAkQbAwg==
====catalogjs annotation end====*/