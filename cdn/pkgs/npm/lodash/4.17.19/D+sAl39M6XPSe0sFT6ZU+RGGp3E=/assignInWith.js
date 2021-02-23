import { default as copyObject } from "./dist/54.js";
import { default as createAssigner } from "./dist/48.js";
import { default as keysIn } from "./keysIn.js";
var assignInWith = createAssigner(function (object, source, srcIndex, customizer) {
  copyObject(source, keysIn(source), object, customizer);
});
export { assignInWith as default };
/*====catalogjs annotation start====
k5OVwqwuL2Rpc3QvNTQuanMDwsCVwqwuL2Rpc3QvNDguanMHwsCVwqsuL2tleXNJbi5qcwvCwIGnZGVmYXVsdJWhbKxhc3NpZ25JbldpdGgWwMDcABiXoW8AAAPAkQ/AmaFkCQACBJECwMKZoWmqY29weU9iamVjdJICE8AAp2RlZmF1bHTAwMCYoXILCsDAkQHAwpyhaQABAQeRBMDCAMLAwJihZwgOwMCQwMKZoWQJAAYIkQbAwpmhaa5jcmVhdGVBc3NpZ25lcpIGEsABp2RlZmF1bHTAwMCYoXILDsDAkQXAwpyhaQEBBQuRCMDCAcLAwJihZwgOwMCQwMKZoWQJAAoMkQrAwpmhaaZrZXlzSW6SChTAAqdkZWZhdWx0wMDAmKFyCwbAwJEJwMKcoWkBAQkNkQzAwgLCwMCYoWcIDcDAkMDCl6FvAQAOFZDAmKFnAAEPwJDAwpmhZAQAEMCTEA4RwMKZoWysYXNzaWduSW5XaXRokhAXwMDADpDZTFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9hc3NpZ25JbldpdGguanOYoXIADMARkQ/AwpihZwMhEsCTEhMUwMKYoXIADsATkQXAwpihcjUKwBSRAcDCmKFyCQbAwJEJwMKYoWcBAxbAkMDCmKFnCQsXwJEXwMKYoXIADMDAkQ/Awg==
====catalogjs annotation end====*/